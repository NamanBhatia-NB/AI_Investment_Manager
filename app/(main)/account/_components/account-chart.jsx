"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const DATE_RANGES = {
    "7D": { label: "Last 7 days", days: 7 },
    "1M": { label: "Last Month", days: 30 },
    "3M": { label: "Last 3 Months", days: 90 },
    "6M": { label: "Last 6 Months", days: 180 },
    ALL: { label: "All Time", days: null },
};

const AccountChart = ({ transactions }) => {
    const [dateRange, setDateRange] = useState("1M");

    const filteredData = useMemo(() => {
        const range = DATE_RANGES[dateRange];
        const now = new Date();
        const startDate = range.days
            ? startOfDay(subDays(now, range.days))
            : startOfDay(new Date(0));

        // Filter transactions with date range
        const filtered = transactions.filter(
            (t) => new Date(t.timestamp) >= startDate && new Date(t.timestamp) <= endOfDay(now)
        );

        const grouped = filtered.reduce((acc, transaction) => {
            const date = format(new Date(transaction.timestamp), "MMM dd");

            if (!acc[date]) {
                acc[date] = { date, profit: 0, loss: 0 };
            }

            if (transaction.transactionType === "SELL") {
                acc[date].profit += transaction.totalAmount;
            }
            else {
                acc[date].loss += transaction.totalAmount;
            }
            return acc;
        }, {});

        // Convert to array and sort by date
        return Object.values(grouped).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

    }, [transactions, dateRange]);

    const totals = useMemo(() => {
        return filteredData.reduce(
            (acc, day) => ({
                profit: acc.profit + day.profit,
                loss: acc.loss + day.loss,
            }),
            { profit: 0, loss: 0 }
        );
    }, [filteredData]);


    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-base font-normal">Transaction Overview</CardTitle>
                    <Select defaultValue={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent >
                            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className='flex justify-around mb-6 text-sm'>
                        <div className='text-center'>
                            <p className='text-muted-foreground'>Total Profit</p>
                            <p className='text-lg font-bold text-green-500'>₹ {totals.profit.toFixed(2)}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-muted-foreground'>Total Loss</p>
                            <p className='text-lg font-bold text-red-500'>₹ {totals.loss.toFixed(2)}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-muted-foreground'>Net Profit/Loss</p>
                            <p
                                className={
                                    `text-lg font-bold ${totals.profit - totals.loss >= 0
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                            >
                                ₹ {(totals.profit - totals.loss).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className='h-[300px]'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={filteredData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 10,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹ ${value}`}
                                />
                                <Tooltip formatter={(value) => [`₹ ${value}`]} />
                                <Legend />
                                <Bar dataKey="profit" fill="#22c55e" name='Profit' radius={[4, 4, 0, 0]} />
                                <Bar dataKey="loss" fill="#ef4444" name='Loss' radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </CardContent>
            </Card>


        </div>
    )
}

export default AccountChart;