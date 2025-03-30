"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { categoryColors } from '@/data/categories';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
}

const TransactionTable = ({ transactions }) => {
  const router = useRouter();
  const filteredAndSortedTransactions = transactions;

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field == field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item != id) : [...current, id]
    );
  };

  const handleSelectAll = (id) => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length ? [] : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  return (
    <div className='space-y-4'>
      {/* Filters */}

      {/* Transactions */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0
                  }
                />
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => { handleSort("date") }}
              >
                <div className='flex items-center'>
                  Date{" "}
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className='ml-1 h-4 w-4' />
                    ) : (
                      <ChevronDown className='ml-1 h-4 w-4' />
                    ))}
                </div>
              </TableHead>

              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => { handleSort("category") }}
              >
                <div className='flex items-center'>
                  Category{" "}
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className='ml-1 h-4 w-4' />
                    ) : (
                      <ChevronDown className='ml-1 h-4 w-4' />
                    ))}
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => { handleSort("amount") }}
              >
                <div className='flex items-center justify-end'>
                  Amount{" "}
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className='ml-1 h-4 w-4' />
                    ) : (
                      <ChevronDown className='ml-1 h-4 w-4' />
                    ))}
                </div>
              </TableHead>

              <TableHead>Reccuring</TableHead>

              <TableHead className="w-[50px]" />

            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              < TableRow >
                <TableCell className="text-center text-muted-foreground" colSpan={7} >No Transactions Found !</TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell >
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>

                  <TableCell className="font-medium">
                    {format(new Date(transaction.timestamp), "PP")}
                  </TableCell>

                  <TableCell>{transaction.assetName}</TableCell>

                  <TableCell className="capitalize"

                  >
                    <span
                      style={{
                        background: categoryColors[transaction.transactionType],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.transactionType}
                    </span>
                  </TableCell>
                  <TableCell
                    className='text-right font-medium'
                    style={{
                      color: transaction.transactionType === "BUY" ? "red" : "green",
                    }}
                  >
                    {transaction.transactionType === "BUY" ? "-" : "+"}
                    ₹ {transaction.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1 bg-purple-100 hover:bg-purple-200 text-purple-700 ">
                              <RefreshCw className="h-3 w-3" />
                              {RECURRING_INTERVALS[transaction.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className='text-sm'>
                              <div className='font-medium'>Next Date : </div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className='h-3 w-3' />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={
                            () => {
                              router.push(
                                `/transaction/create?edit=${transaction.id}`
                              )
                            }
                          }
                        >Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                        // onClick={() => {deleteFn([transaction.id])}}
                        >Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}

          </TableBody>
        </Table>
      </div>

    </div >
  )
}

export default TransactionTable;
