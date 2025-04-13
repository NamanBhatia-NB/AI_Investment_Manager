"use server"

import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
