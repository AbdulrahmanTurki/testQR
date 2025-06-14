"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns';

const statusColors: { [key: string]: string } = {
    'New': 'bg-blue-500',
    'In Progress': 'bg-yellow-500',
    'Ready': 'bg-green-500',
    'Completed': 'bg-gray-500',
};

type OrderStatus = 'New' | 'In Progress' | 'Ready' | 'Completed';

// Types based on your new DB schema and the join query
export type OrderItem = {
    id: number;
    quantity: number;
    menu_items: {
        name: string;
    } | null;
};

export type Order = {
    id: number;
    table_name: string;
    status: OrderStatus;
    created_at: string;
    order_items: OrderItem[];
};


export default function KitchenManagementPage() {
    const supabase = createClient()
    const [orders, setOrders] = useState<Order[]>([])

    const fetchOrders = async () => {
        // Fetch only active orders and join with order_items and menu_items
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, menu_items(name))')
            .in('status', ['New', 'In Progress', 'Ready'])
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching orders:', error);
        } else if (data) {
            // The data from Supabase needs to be cast to our defined types
            setOrders(data as Order[]);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Set up a real-time subscription to the orders table
        const channel = supabase.channel('realtime-orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('Change received!', payload);
                    // Refetch all orders when any change occurs
                    fetchOrders();
                }
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .match({ id: orderId });
        
        if (error) {
            console.error('Error updating order status:', error);
        }
        // The real-time listener will handle refreshing the UI
    };


    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Live Kitchen Display</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                 {orders.length === 0 && (
                    <p className="text-muted-foreground col-span-full">No active orders right now.</p>
                )}
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Table {order.table_name}</CardTitle>
                            <Badge className={`${statusColors[order.status]} text-white`}>{order.status}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Order #{order.id}</div>
                             <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                            </p>
                            <ul className="mt-4 space-y-2">
                                {order.order_items.map((item) => (
                                    <li key={item.id} className="flex justify-between">
                                        <span>{item.menu_items?.name || 'Unknown Item'}</span>
                                        <span className="font-bold">x{item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            {order.status === 'New' && (
                                <Button className="w-full" onClick={() => handleUpdateStatus(order.id, 'In Progress')}>
                                    Accept Order
                                </Button>
                            )}
                             {order.status === 'In Progress' && (
                                <Button className="w-full bg-yellow-500 hover:bg-yellow-600" onClick={() => handleUpdateStatus(order.id, 'Ready')}>
                                    Mark as Ready
                                </Button>
                            )}
                             {order.status === 'Ready' && (
                                <Button className="w-full bg-green-500 hover:bg-green-600" onClick={() => handleUpdateStatus(order.id, 'Completed')}>
                                    Mark as Completed
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
} 