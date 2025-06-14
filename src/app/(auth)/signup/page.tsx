"use client"

import Link from "next/link"
import { Apple, BotMessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

function GoogleIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 15.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z" />
        <path d="M12 4.5c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5-3.358-7.5-7.5-7.5z" />
      </svg>
    )
  }

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [username, setUsername] = useState("")
    const [restaurantName, setRestaurantName] = useState("")
    const router = useRouter()
    const supabase = createClient()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    restaurant_name: restaurantName,
                },
            },
        })
        if (error) {
            alert(error.message)
        } else {
            router.push("/dashboard")
        }
    }

    const handleGoogleSignUp = async () => {
        await supabase.auth.signInWithOAuth({
          provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        })
      }
    
      const handleAppleSignUp = async () => {
        await supabase.auth.signInWithOAuth({
          provider: "apple",
          options: {
            redirectTo: `${location.origin}/auth/callback`
          }
        })
      }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-muted lg:block bg-gradient-to-br from-gray-900 via-[#001a12] to-teal-900 text-white p-12 flex flex-col justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <BotMessageSquare className="h-8 w-8" />
            Paytab
        </Link>
        <div className="mb-48">
            <h1 className="text-5xl font-bold">Your Keys.</h1>
            <h1 className="text-5xl font-bold">Your Chats.</h1>
            <h1 className="text-5xl font-bold">Your Security.</h1>
            <p className="text-gray-300 mt-4">
                Take control of your conversations, ensuring that only you and your recipients have access to your communication.
            </p>
        </div>
        <div></div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">Sign Up An Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your personal data to create your account
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleGoogleSignUp}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" onClick={handleAppleSignUp}>
              <Apple className="mr-2 h-4 w-4" />
              Apple
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or
                </span>
            </div>
           </div>
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="Max" required onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="robinson@example.com" type="email" required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <Input id="restaurant-name" placeholder="The Good Place" required onChange={(e) => setRestaurantName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input id="confirm-password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-[#001a12] hover:bg-teal-800">
                  Sign Up
                </Button>
              </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 