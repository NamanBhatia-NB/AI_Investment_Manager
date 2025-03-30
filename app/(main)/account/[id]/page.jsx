import { getAccountWithTransactions } from '@/actions/accounts';
import React, { Suspense } from 'react'
import TransactionTable from '../_components/transaction-table';
import { BarLoader } from 'react-spinners';
import NotFound from '@/app/not-found';

export default async function AccountPage({ params }) {
    const resolvedParams = await params;
    const accountData = await getAccountWithTransactions(resolvedParams.id);

    if (!accountData) {
        return (
            <div className=''>
                <NotFound />
            </div>
        )
    }

    const { transactions, ...account } = accountData;

    return (
        <div className='space-y-8 px-5'>
            <div className='flex gap-4 items-end justify-between'>
                <div>
                    <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>
                        {account.name}
                    </h1>
                    <p className='text-muted-foreground'>
                        {account.type.charAt(0) + account.type.slice(1).toLowerCase()}
                    </p>
                </div>

                <div className='text-right pb-2'>
                    <div>
                        ₹ {parseFloat(account.balance).toFixed(2)}
                    </div>

                    <p className='text-sm text-muted-foreground'>
                        {account._count.transactions} Transactions
                    </p>

                </div>
            </div>

            {/* Charts Section */}

            {/* Transactions Table */}
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />} >
                <TransactionTable transactions={transactions} />
            </Suspense>

        </div>
    )
}
