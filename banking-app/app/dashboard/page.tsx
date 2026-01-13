"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Account {
  id: string
  account_number: string
  account_type: string
  balance: number
  currency: string
}

interface Profile {
  full_name: string
  email: string
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadDashboardData = async () => {
      const supabase = createClient()

      // Get user profile
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      // Get user accounts
      const { data: accountsData } = await supabase.from("accounts").select("*").eq("user_id", user.id)

      if (accountsData) {
        setAccounts(accountsData)
      }

      setIsLoading(false)
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold">Welcome, {profile?.full_name}</h2>
        <p className="text-muted-foreground">Manage your accounts and finances</p>
      </div>

      {/* Total Balance Card */}
      <Card className="border-primary bg-gradient-to-br from-primary to-primary/80">
        <CardHeader>
          <CardDescription className="text-primary-foreground/80">Total Balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary-foreground">${totalBalance.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div>
        <h3 className="mb-4 text-xl font-semibold">Your Accounts</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="text-lg">{account.account_type}</CardTitle>
                <CardDescription>{account.account_number}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-2xl font-bold">${account.balance.toFixed(2)}</p>
                  </div>
                  <Button size="sm" onClick={() => router.push("/transfer")}>
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Accounts</CardTitle>
            <CardDescription>You don&apos;t have any accounts yet.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
