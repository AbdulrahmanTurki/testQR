"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the type for a menu item based on your DB schema
export type MenuItem = {
    id: number;
    name: string;
    category: string | null;
    price: number;
    status: string | null;
    user_id?: string;
    created_at?: string;
};


export default function MenuManagementPage() {
    const supabase = createClient()
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [open, setOpen] = useState(false)
    const [newItem, setNewItem] = useState({ name: '', category: '', price: '' })

    const fetchMenuItems = async () => {
        const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false })
        if (error) {
            console.error('Error fetching menu items:', error)
        } else if (data) {
            setMenuItems(data)
        }
    }

    useEffect(() => {
        fetchMenuItems()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNewItem(prev => ({ ...prev, [id]: value }));
    };

    const handleAddItem = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            console.error("User not logged in");
            return;
        }

        const { error } = await supabase.from('menu_items').insert({
            name: newItem.name,
            category: newItem.category,
            price: parseFloat(newItem.price),
            user_id: user.id
        })

        if (error) {
            console.error('Error adding item:', error)
        } else {
            setNewItem({ name: '', category: '', price: '' }) // Reset form
            fetchMenuItems() // Refresh the list
            setOpen(false) // Close dialog
        }
    }

    const handleDeleteItem = async (itemId: number) => {
        const { error } = await supabase.from('menu_items').delete().match({ id: itemId });
        if (error) {
            console.error('Error deleting item:', error);
        } else {
            fetchMenuItems(); // Refresh the list
        }
    };


    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Menu Management</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Menu Item
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Menu Item</DialogTitle>
                                <DialogDescription>
                                    Add a new item to your menu. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" value={newItem.name} onChange={handleInputChange} placeholder="Margherita Pizza" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">Category</Label>
                                    <Input id="category" value={newItem.category} onChange={handleInputChange} placeholder="Main Course" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="price" className="text-right">Price</Label>
                                    <Input id="price" type="number" value={newItem.price} onChange={handleInputChange} placeholder="12.50" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddItem}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="border shadow-sm rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'Available' ? 'outline' : 'destructive'}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
} 