"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Account {
  id: string
  account_number: string
  account_type: string
  balance: number
}

export default function TransferPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [fromAccountId, setFromAccountId] = useState("")
  const [toAccountId, setToAccountId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isTransferring, setIsTransferring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadAccounts = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: accountsData } = await supabase.from("accounts").select("*").eq("user_id", user.id)

      if (accountsData) {
        setAccounts(accountsData)
        if (accountsData.length > 0) {
          setFromAccountId(accountsData[0].id)
        }
      }

      setIsLoading(false)
    }

    loadAccounts()
  }, [])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!fromAccountId || !toAccountId || !amount) {
      setError("Please fill in all fields")
      return
    }

    if (fromAccountId === toAccountId) {
      setError("Cannot transfer to the same account")
      return
    }

    const transferAmount = Number.parseFloat(amount)
    const fromAccount = accounts.find((acc) => acc.id === fromAccountId)

    if (!fromAccount || fromAccount.balance < transferAmount) {
      setError("Insufficient funds")
      return
    }

    const supabase = createClient()
    setIsTransferring(true)

    try {
      // Create transaction record
      const { error: transactionError } = await supabase.from("transactions").insert({
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        amount: transferAmount,
        transaction_type: "transfer",
        description: description || "Transfer between accounts",
        status: "completed",
      })

      if (transactionError) throw transactionError

      // Update from account balance
      const { error: updateFromError } = await supabase
        .from("accounts")
        .update({ balance: fromAccount.balance - transferAmount })
        .eq("id", fromAccountId)

      if (updateFromError) throw updateFromError

      // Update to account balance
      const toAccount = accounts.find((acc) => acc.id === toAccountId)
      if (!toAccount) throw new Error("Recipient account not found")

      const { error: updateToError } = await supabase
        .from("accounts")
        .update({ balance: toAccount.balance + transferAmount })
        .eq("id", toAccountId)

      if (updateToError) throw updateToError

      setSuccess(`Successfully transferred $${transferAmount.toFixed(2)}!`)
      setAmount("")
      setDescription("")
      setToAccountId("")

      // Reload accounts
      const { data: updatedAccounts } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id!)

      if (updatedAccounts) {
        setAccounts(updatedAccounts)
      }

      setTimeout(() => {
        router.push("/transactions")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Transfer failed")
    } finally {
      setIsTransferring(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold">Transfer Money</h2>
        <p className="text-muted-foreground">Send money between your accounts</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Transfer</CardTitle>
          <CardDescription>Fill in the details below to transfer funds</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-6">
            {/* From Account */}
            <div className="grid gap-2">
              <Label htmlFor="from-account">From Account</Label>
              <Select value={fromAccountId} onValueChange={setFromAccountId}>
                <SelectTrigger id="from-account">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_type} - {account.account_number} (${account.balance.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Account */}
            <div className="grid gap-2">
              <Label htmlFor="to-account">To Account</Label>
              <Select value={toAccountId} onValueChange={setToAccountId}>
                <SelectTrigger id="to-account">
                  <SelectValue placeholder="Select recipient account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((acc) => acc.id !== fromAccountId)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.account_type} - {account.account_number}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                type="text"
                placeholder="e.g., Savings deposit"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <Button type="submit" className="w-full" disabled={isTransferring || accounts.length < 2}>
              {isTransferring ? "Processing..." : "Transfer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {accounts.length < 2 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle>Multiple Accounts Required</CardTitle>
            <CardDescription>You need at least 2 accounts to make a transfer</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
