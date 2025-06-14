import Link from "next/link"
import { createClient } from "@/lib/supabase"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Utensils,
    CookingPot,
    QrCode,
    BarChart3,
    Settings,
    DollarSign,
    Package,
} from "lucide-react"

export default async function DashboardPage() {
    const supabase = createClient();

    // Fetch analytics data for summary
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_price');

    const totalRevenue = orders?.reduce((acc, order) => acc + order.total_price, 0) ?? 0;
    const totalOrders = orders?.length ?? 0;

    const navItems = [
        {
            href: "/dashboard/menu-management",
            icon: Utensils,
            title: "Menu Management",
            description: "Add, edit, and organize your menu items."
        },
        {
            href: "/dashboard/kitchen-management",
            icon: CookingPot,
            title: "Kitchen Display",
            description: "View and manage incoming orders in real-time."
        },
        {
            href: "/dashboard/qr-code-generator",
            icon: QrCode,
            title: "QR Code Generator",
            description: "Create and manage QR codes for your tables."
        },
        {
            href: "/dashboard/analytics",
            icon: BarChart3,
            title: "Analytics",
            description: "View detailed sales and customer analytics."
        },
        {
            href: "/dashboard/settings",
            icon: Settings,
            title: "Settings",
            description: "Manage your account and restaurant settings."
        }
    ];

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalOrders}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Card className="h-full hover:bg-muted/50 transition-colors flex flex-col justify-between">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <div className="p-3 rounded-md bg-muted">
                                   <item.icon className="h-6 w-6" />
                                </div>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{item.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    )
} 