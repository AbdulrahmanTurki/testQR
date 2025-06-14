"use client"

import { useState, useEffect } from "react"
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
    CardFooter,
} from "@/components/ui/card"
import { QRCode } from "react-qr-code"
import { Trash2 } from "lucide-react"

export type QrCodeType = {
    id: number;
    table_name: string;
    qr_value: string;
    user_id?: string;
    created_at?: string;
}

export default function QrCodeGeneratorPage() {
    const supabase = createClient()
    const [savedCodes, setSavedCodes] = useState<QrCodeType[]>([])
    const [qrValue, setQrValue] = useState("")
    const [tableName, setTableName] = useState("")

    const fetchQrCodes = async () => {
        const { data, error } = await supabase.from('qr_codes').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching QR codes:', error);
        } else if (data) {
            setSavedCodes(data);
        }
    };

    useEffect(() => {
        fetchQrCodes();
    }, []);

    const handleGenerateAndSave = async () => {
        if (!tableName) {
            alert("Please enter a table name or identifier.");
            return;
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            console.error("User not logged in");
            return;
        }
        
        // Generate a unique URL that includes the user's ID to identify the restaurant
        const generatedQrValue = `${window.location.origin}/menu/${user.id}?table=${encodeURIComponent(tableName)}`;
        setQrValue(generatedQrValue);

        const { error } = await supabase.from('qr_codes').insert({
            table_name: tableName,
            qr_value: generatedQrValue,
            user_id: user.id
        });

        if (error) {
            console.error('Error saving QR code:', error);
        } else {
            fetchQrCodes(); // Refresh the list
            setTableName("") // Reset input
        }
    };
    
    const handleDeleteCode = async (codeId: number) => {
        const { error } = await supabase.from('qr_codes').delete().match({ id: codeId });
        if (error) {
            console.error('Error deleting QR code:', error);
        } else {
            fetchQrCodes(); // Refresh the list
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">QR Code Generator</h1>
            </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Generator</CardTitle>
                        <CardDescription>
                            Enter a table name or identifier to generate a unique QR code.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="table-name">Table Name</Label>
                            <Input
                                id="table-name"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                placeholder="e.g., Table 1, Patio 5, Bar Seat 2"
                            />
                        </div>
                        <Button onClick={handleGenerateAndSave}>Generate & Save QR Code</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Saved QR Codes</CardTitle>
                        <CardDescription>
                            Here are all the QR codes you've generated for your tables.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {savedCodes.length === 0 && (
                            <p className="text-muted-foreground col-span-full">You haven't generated any QR codes yet.</p>
                        )}
                        {savedCodes.map((code) => (
                            <Card key={code.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-base">{code.table_name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex items-center justify-center">
                                    <div style={{ background: 'white', padding: '16px' }}>
                                        <QRCode value={code.qr_value} size={128} />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                     <Button variant="ghost" size="icon" onClick={() => handleDeleteCode(code.id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 