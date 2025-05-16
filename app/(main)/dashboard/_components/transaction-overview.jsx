"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

const COLORS = [
    "#4e79a7", // Blue
    "#f28e2b", // Orange
    "#e15759", // Red
    "#76b7b2", // Teal
    "#59a14f", // Green
    "#edc948", // Yellow
    "#b07aa1", // Purple
    "#ff9da7", // Pink
    "#9c755f", // Brown
    "#bab0ab"  // Gray
];


const DashboardOverview = ({ accounts, transactions }) => {
    const [selectedAccountId, setSelectedAccountId] = useState(accounts.find((a) => a.isDefault)?.id || accounts[0]?.id);

    // Filter transactions for selected account
    const accountTransactions = transactions.filter(
        (t) => t.accountId === selectedAccountId
    );

    const recentTransactions = accountTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    const currentDate = new Date();
    const currentMonthExpenses = accountTransactions.filter((t) => {
        const transactionDate = new Date(t.timestamp);
        return (
            t.transactionType === "BUY" &&
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear()
        );
    });

    // Group expenses by category
    const expensesByAssetName = currentMonthExpenses.reduce((acc, transaction) => {
        const assetName = transaction.assetName;
        if (!acc[assetName]) {
            acc[assetName] = 0;
        }
        acc[assetName] += transaction.totalAmount;

        return acc;
    }, {});

    // Format data for pie chart
    const pieChartData = Object.entries(expensesByAssetName).map(
        ([assetName, totalAmount]) => ({
            name: assetName,
            value: totalAmount,
        })
    )

    const [showLabel, setShowLabel] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setShowLabel(window.innerWidth >= 768); // show only on md and up
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className='grid gap-4 md:grid-cols-2'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                    <CardTitle className='text-base font-normal'>Recent Transactions</CardTitle>
                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {recentTransactions.length === 0 ? (
                            <p className='text-center text-muted-foreground py-4'>No recent transactions !</p>
                        ) : (
                            recentTransactions.map((transaction) => {
                                return (
                                    <div key={transaction.id} className='flex items-center justify-between'>
                                        <div className='space-y-1'>
                                            <p className='text-sm font-medium leading-none'>
                                                {transaction.description || "Untitled Transaction"}
                                            </p>
                                            <p className='text-sm font-medium leading-none'>
                                                {format(new Date(transaction.timestamp), "PP")}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div
                                                className={cn(
                                                    "flex items-center",
                                                    transaction.transactionType === "BUY" ? "text-red-500" : "text-green-500"
                                                )}>
                                                {transaction.transactionType === "BUY" ? (
                                                    <ArrowDownRight className="mr-1 h-4 w-4" />
                                                ) : (
                                                    <ArrowUpRight className="mr-1 h-4 w-4" />
                                                )}
                                                ₹ {transaction.totalAmount.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Monthly Investments Breakdown</CardTitle>
                </CardHeader>
                <CardContent className='p-0 pb-5'>
                    {pieChartData.length === 0 ? (
                        <p className='text-center text-muted-foreground py-4'>
                            No Investments this month
                        </p>
                    ) : (
                        <div className='h-[300px]'>
                            <ResponsiveContainer width="100%" height="100%" >
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={showLabel ? ({ name, value }) => `${name} : ₹ ${value.toFixed(2)}` : ({ name, value }) => `₹ ${value.toFixed(2)}`}
                                    >
                                        {
                                            pieChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))
                                        }
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardOverview;
