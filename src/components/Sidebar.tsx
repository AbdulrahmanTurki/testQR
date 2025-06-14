"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    ShoppingCart,
    Package,
    Users,
    LineChart,
    Settings,
    LayoutGrid,
    Wallet,
    FileText,
    Table,
    Box,
    QrCode,
    Utensils,
    BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const mainNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/dashboard/qr-tables", label: "QR Tables", icon: QrCode },
    { href: "/dashboard/menu-management", label: "Menu", icon: Utensils },
    { href: "/dashboard/payments", label: "Payments", icon: Wallet },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

const quickActionLinks = [
    { href: "/dashboard/table-management", label: "Table Management", icon: Utensils },
    { href: "/dashboard/inventory", label: "Inventory", icon: Box },
    { href: "/dashboard/reports", label: "Reports", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-background lg:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <LayoutGrid className="h-6 w-6" />
                        <span className="">QR Dine</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <span className="px-3 py-2 text-xs text-muted-foreground">NAVIGATION</span>
                        {mainNavLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    pathname === link.href && "bg-muted text-primary"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                         <span className="px-3 py-4 text-xs text-muted-foreground">QUICK ACTIONS</span>
                         {quickActionLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    pathname === link.href && "bg-muted text-primary"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Card>
                        <CardHeader className="p-2 pt-0 md:p-4">
                           <CardTitle className="text-sm">Bella Vista Cafe</CardTitle>
                           <p className="text-xs text-muted-foreground">Premium Plan</p>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    )
} 