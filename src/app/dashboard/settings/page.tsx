"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { toast } from "sonner"

type Profile = {
    full_name: string;
    restaurant_name: string;
};

export default function SettingsPage() {
    const supabase = createClient()
    const [profile, setProfile] = useState<Profile>({ full_name: '', restaurant_name: '' })
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null);

    const getProfile = useCallback(async (uid: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select(`full_name, restaurant_name`)
            .eq('id', uid)
            .single()

        if (error) {
            console.error('Error fetching profile:', error)
            toast.error("Failed to load profile data.")
        }
        if (data) {
            setProfile(data)
        }
        setLoading(false)
    }, [supabase]);


    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                getProfile(user.id);
            } else {
                setLoading(false);
                toast.error("You must be logged in to view settings.");
            }
        }
        fetchUserAndProfile();
    }, [getProfile, supabase.auth]);

    const handleUpdateProfile = async () => {
        if (!userId) return;
        setLoading(true);
        const { error } = await supabase.from('profiles').update({
            full_name: profile.full_name,
            restaurant_name: profile.restaurant_name,
        }).eq('id', userId);

        if (error) {
            toast.error("Failed to update profile. Please try again.");
            console.error(error)
        } else {
            toast.success("Profile updated successfully!");
        }
        setLoading(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Update your personal and restaurant information here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {loading ? (
                        <p>Loading profile...</p>
                    ) : (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    value={profile.full_name || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., John Doe"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="restaurant_name">Restaurant Name</Label>
                                <Input
                                    id="restaurant_name"
                                    value={profile.restaurant_name || ''}
                                    onChange={handleInputChange}
                                    placeholder="e.g., The Good Fork"
                                />
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleUpdateProfile} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
} 