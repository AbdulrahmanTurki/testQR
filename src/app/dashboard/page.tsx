import Link from "next/link"
import {
    Activity,
    ArrowUpRight,
    CircleUser,
    CreditCard,
    DollarSign,
    Menu,
    Package2,
    Search,
    Users,
    Bell,
    Home,
    LineChart,
    Package,
    ShoppingCart,
    CalendarDays,
    Table,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table as UiTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase"
import LogoutButton from "@/components/LogoutButton"

// This is a server component, so we can fetch data directly
export default async function DashboardPage() {
    const supabase = createClient()

    // 1. Fetch recent orders
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
            id,
            created_at,
            total_price,
            status,
            order_items (
                quantity,
                menu_items (
                    name
                )
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

    // 2. Fetch stats
    const { data: allOrders, error: allOrdersError } = await supabase
        .from('orders')
        .select('total_price, status, created_at')
    
    const totalRevenue = allOrders?.reduce((acc, order) => acc + order.total_price, 0) ?? 0;
    const activeOrders = allOrders?.filter(o => o.status === 'preparing' || o.status === 'new').length ?? 0;
    const avgOrderValue = allOrders && allOrders.length > 0 ? totalRevenue / allOrders.length : 0;
    
    // Placeholder - in a real app, this would be more complex
    const occupiedTables = 10; 
    const totalTables = 16;
    const occupancyRate = (occupiedTables / totalTables) * 100;

    return (
        <div className="flex w-full flex-col">
            <header className="flex flex-col sm:flex-row items-center gap-4 sm:h-auto py-4">
                <div className="w-full flex-1">
                    <h1 className="text-2xl font-bold">Welcome back, Bella Vista! 👋</h1>
                    <p className="text-muted-foreground">Here's what's happening at your restaurant today</p>
                </div>
                <div className="flex w-full sm:w-auto items-center justify-end gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4"/>
                        <span>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </Button>
                </div>
            </header>
            <div className="flex items-center gap-4 py-4 border-y">
                 <div className="relative w-full flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search orders, tables, menu..."
                        className="w-full rounded-lg bg-background pl-8"
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                </Button>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Bella Vista Cafe</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/dashboard/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <LogoutButton />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 py-8">
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
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{activeOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Occupied Tables</CardTitle>
                        <Table className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{occupiedTables}/{totalTables}</div>
                        <p className="text-xs text-muted-foreground">
                           {occupancyRate.toFixed(1)}% occupancy rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                         <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>
                                Latest orders from your restaurant.
                            </CardDescription>
                        </div>
                         <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/dashboard/orders">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <UiTable>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Table</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders?.map((order, index) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#ORD-{order.id.toString().padStart(3, '0')}</TableCell>
                                        <TableCell>Table {5 + index}</TableCell>
                                        <TableCell>{['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emma Brown', 'Chris Lee'][index]}</TableCell>
                                        <TableCell>
                                            {order.order_items.map((oi: any) => oi.menu_items.name).join(', ')}
                                        </TableCell>
                                        <TableCell className="text-right">${order.total_price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{order.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={index % 2 === 0 ? "default" : "secondary"}>
                                                {index % 2 === 0 ? 'Paid' : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </UiTable>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                         <CardDescription>
                            Manage your restaurant operations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button asChild>
                           <Link href="/dashboard/qr-code-generator">Generate QR Codes</Link>
                        </Button>
                        <Button variant="outline" disabled>Update Menu (Soon)</Button>
                        <Button variant="outline" disabled>Manage Inventory (Soon)</Button>
                    </CardContent>
                </Card>
            </div>
             <div className="grid gap-4 md:gap-8 lg:grid-cols-2 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Table Status</CardTitle>
                        <CardDescription>Real-time table occupancy overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">This component is under construction.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Menu Performance</CardTitle>
                        <CardDescription>Top performing menu items today</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">This component is under construction.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 