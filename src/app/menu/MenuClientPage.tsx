"use client"

import { useState } from 'react'
import { placeOrder } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from "sonner"
import { ShoppingCart, PlusCircle, MinusCircle } from 'lucide-react'

// Types
type MenuItem = {
    id: number;
    name: string;
    category: string | null;
    price: number;
    status: string | null;
};

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

type MenuClientPageProps = {
    menuItems: MenuItem[];
    restaurantName: string;
    restaurantUserId: string;
    tableName: string;
};

export default function MenuClientPage({ menuItems, restaurantName, restaurantUserId, tableName }: MenuClientPageProps) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addToCart = (item: MenuItem) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return currentCart.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...currentCart, { ...item, quantity: 1 }];
        });
        toast.success(`${item.name} added to cart!`);
    };

    const removeFromCart = (itemId: number) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(cartItem => cartItem.id === itemId);
            if (existingItem && existingItem.quantity > 1) {
                return currentCart.map(cartItem =>
                    cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
                );
            }
            return currentCart.filter(cartItem => cartItem.id !== itemId);
        });
    };

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        const result = await placeOrder(restaurantUserId, tableName, cart);

        if (result.error) {
            toast.error(`Failed to place order: ${result.error.message}`);
        } else {
            toast.success(`Order #${result.orderId} placed successfully!`);
            setCart([]); // Clear cart on successful order
        }
        setIsSubmitting(false);
    };


    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight">{restaurantName}</h1>
                <p className="text-xl text-muted-foreground mt-2">Welcome to Table {tableName}</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Menu Items Section */}
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">Menu</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {menuItems.filter(item => item.status === 'Available').map(item => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardDescription>${item.price.toFixed(2)}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{item.category}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => addToCart(item)}>
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Cart Section */}
                <div>
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle>Your Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cart.length === 0 ? (
                                <p className="text-muted-foreground">Your cart is empty.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {cart.map(item => (
                                        <li key={item.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                 <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                                                    <MinusCircle className="h-4 w-4" />
                                                </Button>
                                                <span className="font-bold">{item.quantity}</span>
                                                <Button variant="ghost" size="icon" onClick={() => addToCart(item)}>
                                                    <PlusCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                        {cart.length > 0 && (
                            <CardFooter className="flex-col items-stretch space-y-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <Button className="w-full" onClick={handlePlaceOrder} disabled={isSubmitting}>
                                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
} 