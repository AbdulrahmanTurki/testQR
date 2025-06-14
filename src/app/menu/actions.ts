"use server"

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Define the type for items in the cart
type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

// This server action will be called by the client to place an order.
// It uses the service role key to bypass RLS and insert into the database.
export async function placeOrder(
    restaurantUserId: string,
    tableName: string,
    cart: CartItem[]
) {

    // Ensure we have the required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return { error: { message: "Supabase environment variables are not set." } };
    }

    // Create a new Supabase client with the service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // 1. Calculate the total price on the server to ensure accuracy
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // 2. Create the order in the 'orders' table
    const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
            user_id: restaurantUserId,
            table_name: tableName,
            total_price: totalPrice,
            status: 'New',
        })
        .select('id')
        .single();

    if (orderError) {
        console.error("Error creating order:", orderError);
        return { error: orderError };
    }

    // 3. Create the items in the 'order_items' table
    const orderItemsToInsert = cart.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItemsToInsert);

    if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Attempt to delete the order if items fail to be created
        await supabaseAdmin.from('orders').delete().match({ id: orderData.id });
        return { error: itemsError };
    }

    return { success: true, orderId: orderData.id };
} 