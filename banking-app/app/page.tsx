"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div className="flex h-svh items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">SecureBank</h1>
        <p className="text-lg text-muted-foreground">Your trusted banking solution</p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/auth/login")} size="lg">
          Login
        </Button>
        <Button onClick={() => router.push("/auth/sign-up")} size="lg" variant="outline">
          Sign Up
        </Button>
      </div>
    </div>
  )
}
