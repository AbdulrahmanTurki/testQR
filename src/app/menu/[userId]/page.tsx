import { createClient } from "@/lib/supabase";
import MenuClientPage from "./MenuClientPage";
import { notFound } from 'next/navigation';

type MenuPageProps = {
    params: {
        userId: string;
    };
    searchParams: {
        table: string;
    };
};

// This is the main server component for the menu page.
// It fetches the data and passes it to the client component.
export default async function MenuPage({ params, searchParams }: MenuPageProps) {
    const supabase = createClient();
    const { userId } = params;
    const { table } = searchParams;

    // Fetch profile data and menu items in parallel
    const [profileResult, menuItemsResult] = await Promise.all([
        supabase.from('profiles').select('restaurant_name').eq('id', userId).single(),
        supabase.from('menu_items').select('*').eq('user_id', userId)
    ]);

    const { data: profile, error: profileError } = profileResult;
    const { data: menuItems, error: menuItemsError } = menuItemsResult;

    // If there's an error or the profile doesn't exist, show a 404 page.
    if (profileError || !profile) {
        console.error("Error fetching profile:", profileError);
        notFound();
    }
    
    if (menuItemsError) {
        console.error("Error fetching menu items:", menuItemsError);
        // Decide if you want to show an error or an empty menu
    }
    
    // If the table name is missing, we can't place an order.
    if (!table) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Error: Table information is missing from the QR code.</p>
            </div>
        )
    }

    return (
        <MenuClientPage
            menuItems={menuItems || []}
            restaurantName={profile.restaurant_name || 'Welcome'}
            restaurantUserId={userId}
            tableName={table}
        />
    );
} 