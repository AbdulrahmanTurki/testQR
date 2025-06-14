"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Order, OrderItem } from "@/app/dashboard/kitchen-management/page" // Re-use types

// Define additional types for analytics data
type AnalyticsStats = {
    totalRevenue: number;
    totalOrders: number;
    customerCount: number;
};

type RecentOrder = {
    id: number;
    email: string | undefined; // Assuming email from auth user
    total_price: number;
    created_at: string;
    status: string;
};

type TopSellingItem = {
    name: string | null;
    count: number;
};

export default function AnalyticsPage() {
    const supabase = createClient()
    const [stats, setStats] = useState<AnalyticsStats>({ totalRevenue: 0, totalOrders: 0, customerCount: 0 });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [topItems, setTopItems] = useState<TopSellingItem[]>([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            // Fetch all orders for the logged-in user
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('user_id, total_price, created_at, status, order_items!inner(*, menu_items!inner(name))');

            if (ordersError || !orders) {
                console.error("Error fetching orders:", ordersError);
                return;
            }

            // 1. Calculate stats
            const totalRevenue = orders.reduce((acc, order) => acc + order.total_price, 0);
            const totalOrders = orders.length;
            const customerCount = new Set(orders.map(o => o.user_id)).size; // Simple unique user count
            setStats({ totalRevenue, totalOrders, customerCount });

            // 2. Format recent orders (just show latest 5 for example)
            const formattedRecentOrders = orders
                .slice(0, 5)
                .map(o => ({
                    id: o.id,
                    email: 'user@example.com', // Placeholder - getting customer email is more complex
                    total_price: o.total_price,
                    created_at: o.created_at,
                    status: o.status,
                }));
            setRecentOrders(formattedRecentOrders as any);

            // 3. Calculate top selling items
            const itemCounts: { [key: string]: number } = {};
            orders.forEach(order => {
                order.order_items.forEach((item: any) => {
                    const itemName = item.menu_items.name;
                    if (itemName) {
                        itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity;
                    }
                });
            });
            const sortedTopItems = Object.entries(itemCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));
            setTopItems(sortedTopItems);
        };

        fetchAnalyticsData();
    }, []);


    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <span className="text-2xl">💰</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Customers
                        </CardTitle>
                        <span className="text-2xl">👥</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.customerCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <span className="text-2xl">📦</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg. Order Value
                        </CardTitle>
                        <span className="text-2xl">📈</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>
                                A look at your most recent transactions.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-medium">Order #{order.id}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {order.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="text-xs" variant="outline">
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                       {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">${order.total_price.toFixed(2)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Items</CardTitle>
                        <CardDescription>
                            Your most popular menu items this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                         {topItems.map(item => (
                         <div key={item.name} className="flex items-center gap-4">
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">
                                    {item.name}
                                </p>
                            </div>
                            <div className="ml-auto font-medium">{item.count} sold</div>
                        </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 