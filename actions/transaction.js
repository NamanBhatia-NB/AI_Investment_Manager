"use server"

import aj from "@/lib/arcjet";
import { categories, request } from "@arcjet/next";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => ({
    ...obj,
    totalAmount: obj.totalAmount?.toNumber?.() ?? obj.totalAmount,
    quantity: obj.quantity?.toNumber?.() ?? obj.quantity,
});

export async function createTransaction(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // Get request Data for ArcJet
        const req = await request();

        // Check rate limit
        const decision = await aj.protect(req, {
            userId,
            requested: 1, // Specify how many tokens to consume
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset,
                    },
                });

                throw new Error("Too many requests. Please try again later.");
            }

            throw new Error("Request Blocked.");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });

        if (!account) {
            throw new Error("Account not found");
        }

        const balanceChange = data.transactionType === "BUY" ? -data.totalAmount : data.totalAmount;
        const newBalance = account.balance.toNumber() + balanceChange;

        const transaction = await db.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.timestamp, data.recurringInterval) : null,
                    status: "COMPLETED",
                    quantity: data.quantity || 0,
                    ticker: "",
                    description: data.description || "",
                },
            });

            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            });

            return newTransaction;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return {
            success: true,
            data: serializeAmount(transaction),
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
}

// Helper function to calculate the next recurring date
function calculateNextRecurringDate(startDate, interval) {
    const timestamp = new Date(startDate);

    switch (interval) {
        case "DAILY":
            timestamp.setDate(timestamp.getDate() + 1);
            break;
        case "WEEKLY":
            timestamp.setDate(timestamp.getDate() + 7);
            break;
        case "MONTHLY":
            timestamp.setMonth(timestamp.getMonth() + 1);
            break;
        case "YEARLY":
            timestamp.setFullYear(timestamp.getFullYear() + 1);
            break;
    }

    return timestamp;
}

export async function scanReceipt(file) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Convert ArrayBuffer to Base64
        const base64String = Buffer.from(arrayBuffer).toString("base64");

        const prompt = `
            You are an intelligent financial assistant.

            Analyze the uploaded **receipt or investment transaction slip** and extract the following details. Return only a valid JSON object with this exact format:

            {
            "assetName" : "string",             // Name of the asset or share
            "amount": number,                   // Total transaction amount
            "date": "ISO date string",          // Date of the transaction (e.g., "2025-04-13T00:00:00.000Z")
            "description": "string",            // Brief description of the asset or transaction
            "transactionType": "string",        // Either "BUY" or "SELL"
            "isRecurring": boolean              // true if this is a recurring investment, false otherwise
            "recurringInterval":"string" // DAILY, WEEKLY, MONTHLY, YEARLY
            }

            📌 Notes:
            - Return **only** a clean JSON object. Do NOT include \`\`\`json, explanations, or extra text.
            - If this image is not a valid investment-related receipt or does not contain enough info, return: {}
            - Prefer uppercase values for "transactionType".

            ✅ Example output:
            {
            "assetName":"Tata",
            "amount": 1500.00,
            "date": "2025-04-01T00:00:00.000Z",
            "description": "Mutual fund purchase via Groww",
            "transactionType": "BUY",
            "isRecurring": true,
            "recurringInterval":"MONTHLY"
            }
        `;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                },
            },
            prompt,
        ]);

        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        try {
            const data = JSON.parse(cleanedText);
            return {
                assetName: data.assetName,
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                transactionType: data.transactionType?.toLowerCase() === "sell" ? "SELL" : "BUY",
                isRecurring: Boolean(data.isRecurring),
                recurringInterval: data.recurringInterval
            };
        } catch (parseError) {
            console.error("Error parsing JSON response :", parseError);
            throw new Error("Invalid response format from Gemini.");
        }
    } catch (error) {
        console.error("Error scanning receipt : ", error.message);
        throw new Error("Failed to scan receipt");
    }
}

export async function getTransaction(id) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const transaction = await db.transaction.findUnique({
        where: {
            id,
            userId: user.id,
        },
    });

    if (!transaction) throw new Error("Transaction not found.");

    return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        // Get original transaction to calculate balance change
        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                account: true,
            },
        });

        if (!originalTransaction) throw new Error("Transaction not found.");

        // Calculate balance changes
        const oldBalanceChange = originalTransaction.transactionType === "BUY"
            ? -originalTransaction.totalAmount.toNumber()
            : originalTransaction.totalAmount.toNumber();

        const newBalanceChange = data.transactionType === "BUY" ? -data.totalAmount : data.totalAmount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        // Update transaction and account balance in a transaction
        const transaction = await db.$transaction(async (tx) => {
            const updated = await tx.transaction.update({
                where: {
                    id,
                    userId: user.id,
                },
                data: {
                    ...data,
                    nextRecurringDate: data.isRecurring && data.recurringInterval ? calculateNextRecurringDate(data.timestamp, data.recurringInterval) : null,
                },
            });

            // Update account balance
            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        increment: netBalanceChange,
                    },
                },
            });

            return updated;
        });
        revalidatePath("/dashboard");
        revalidatePath(`/account/${data.accountId}`);

        return { success: true, data: serializeAmount(transaction) };
    } catch (error) {
        throw new Error(error.message);
    }
}