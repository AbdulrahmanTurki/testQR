import Link from "next/link"
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
    BarChart3
} from "lucide-react"
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
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold md:text-3xl">Welcome to your Dashboard</h1>
                <p className="text-muted-foreground">
                    Here's a quick overview of your restaurant's operations.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Link href="/dashboard/menu-management">
                    <Card className="hover:bg-muted/80 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menu Management</CardTitle>
                            <Utensils className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                Add, edit, and manage your menu items.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/kitchen-management">
                    <Card className="hover:bg-muted/80 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Kitchen Display</CardTitle>
                            <CookingPot className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                View and manage incoming orders in real-time.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/qr-code-generator">
                    <Card className="hover:bg-muted/80 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">QR Code Generator</CardTitle>
                            <QrCode className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                Generate QR codes for tables.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/analytics">
                    <Card className="hover:bg-muted/80 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                            <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                View detailed sales and customer analytics.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            A list of your recent transactions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reciever</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Emma Ryan Jr.</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">Pending</Badge>
                                    </TableCell>
                                    <TableCell>Feb 19th, 2023</TableCell>
                                    <TableCell className="text-right">$3,892</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Adrian Daren</TableCell>
                                    <TableCell>Bonus</TableCell>
                                    <TableCell>
                                        <Badge>Done</Badge>
                                    </TableCell>
                                    <TableCell>Feb 18th, 2023</TableCell>
                                    <TableCell className="text-right">$1,073</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Roxanne Hills</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>
                                        <Badge>Done</Badge>
                                    </TableCell>
                                    <TableCell>Apr 16th, 2023</TableCell>
                                    <TableCell className="text-right">$2,790</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 