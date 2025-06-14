"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase"
import {
    LayoutDashboard,
    Settings,
    LogOut,
    BotMessageSquare,
    Utensils,
    CookingPot,
    QrCode,
    BarChart3
} from "lucide-react"
import { Button } from "./ui/button"

export default function Sidebar() {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <BotMessageSquare className="h-6 w-6" />
                        <span className="">Paytab</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/menu-management"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Utensils className="h-4 w-4" />
                            Menu Management
                        </Link>
                        <Link
                            href="/dashboard/kitchen-management"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <CookingPot className="h-4 w-4" />
                            Kitchen Management
                        </Link>
                        <Link
                            href="/dashboard/qr-code-generator"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <QrCode className="h-4 w-4" />
                            QR Code Generator
                        </Link>
                        <Link
                            href="/dashboard/analytics"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <LogOut className="h-4 w-4" />
                            Log Out
                        </Button>
                    </nav>
                </div>
            </div>
        </div>
    )
}