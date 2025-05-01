import React, { Suspense } from 'react'
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getDashboardData, getUserAccounts } from '@/actions/dashboard';
import { getCurrentBudget } from '@/actions/budget';
import AccountCard from './_components/account-card';
import CreateAccountDrawer from '@/components/create-account-drawer';
import InvestmentProgress from './_components/investment-progress';
import DashboardOverview from './_components/transaction-overview';

async function DashboardPage() {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData();

  return (
    <div className='space-y-8'>
      {/* Investment Progress */}
      {defaultAccount && (
        <InvestmentProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Overview */}
      <Suspense fallback={"Loading Overview..."}>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []}
        />
      </Suspense>

      {/* Accounts Grid */}
      <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer>
          <Card className="hover:shadow-md hover:scale-105 transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className='h-10 w-10 mb-2' />
              <p className='text-sm font-medium'>Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 && accounts?.map((account) => {
          return <AccountCard key={account.id} account={account} />;
        })}
      </div>
    </div>
  )
}

export default DashboardPage;