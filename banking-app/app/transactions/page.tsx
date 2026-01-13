"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Account {
  id: string
  account_number: string
  account_type: string
  user_id: string
}

interface Transaction {
  id: string
  from_account_id: string
  to_account_id: string | null
  amount: number
  transaction_type: string
  description: string
  status: string
  created_at: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTransactionsAndAccounts = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get user accounts
      const { data: accountsData } = await supabase.from("accounts").select("*").eq("user_id", user.id)

      if (accountsData) {
        setAccounts(accountsData)

        // Get transactions for all user accounts
        const { data: transactionsData } = await supabase
          .from("transactions")
          .select("*")
          .or(
            `from_account_id.in.(${accountsData.map((a) => `"${a.id}"`).join(",")}),to_account_id.in.(${accountsData.map((a) => `"${a.id}"`).join(",")})`,
          )
          .order("created_at", { ascending: false })

        if (transactionsData) {
          setTransactions(transactionsData)
        }
      }

      setIsLoading(false)
    }

    loadTransactionsAndAccounts()
  }, [])

  const getAccountLabel = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    return account ? `${account.account_type} ${account.account_number}` : "Unknown Account"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold">Transaction History</h2>
        <p className="text-muted-foreground">View all your transactions</p>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const isOutgoing = transaction.transaction_type === "transfer"
            return (
              <Card key={transaction.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <p className="font-semibold capitalize">{transaction.transaction_type}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {isOutgoing && transaction.to_account_id ? (
                          <>
                            From: {getAccountLabel(transaction.from_account_id)}
                            <br />
                            To: {getAccountLabel(transaction.to_account_id)}
                          </>
                        ) : (
                          <>Account: {getAccountLabel(transaction.from_account_id)}</>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${isOutgoing ? "text-destructive" : "text-green-600"}`}>
                        {isOutgoing ? "-" : "+"}${transaction.amount.toFixed(2)}
                      </div>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                      <p className="mt-2 text-sm text-muted-foreground">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Transactions</CardTitle>
            <CardDescription>You don&apos;t have any transactions yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/transfer">
              <Button>Make a Transfer</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
