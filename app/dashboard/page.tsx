import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { db } from "@/lib/db";
import { Customers, Invoices } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/shared/container";
import { auth } from '@clerk/nextjs/server'
import { eq } from "drizzle-orm";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId ) return;
  const results = await db.select().from(Invoices).innerJoin(Customers, eq(Invoices.customerId, Customers.id)).where(eq(Invoices.userId, userId));
 
  const invoices = results?.map(({ invoices, customers }) => {
    return {
      ...invoices,
      customer: customers
    }
  });

  return (
    <main className="w-full text-center gap-6 h-full mx-auto my-12">
      <Container>
        <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="flex justify-between">
              <Button variant="ghost" className="inline-flex justify-between gap-2">
                  <Link href='/invoices/new' className="flex items-center gap-2">
                      <CirclePlus className="h-4 w-4"/>
                      <span>Create Invoice</span>
                  </Link>
              </Button>
          </p>
        </div>
      
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px] p-4">Date</TableHead>
            <TableHead className="p-4">Customer</TableHead>
            <TableHead className="p-4">Email</TableHead>
            <TableHead className="text-center p-4">Status</TableHead>
            <TableHead className="text-right p-4">Value</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(result => {
             return (
              <TableRow key={result.id}>
              <TableCell className="font-medium text-left"><Link href={`/invoices/${result.id}`} className="font-semibold p-4">{new Date(result.createTs).toLocaleDateString()}</Link></TableCell>
              <TableCell className="text-left"><Link href={`/invoices/${result.id}`} className="font-semibold p-4">{result.customer.name}</Link></TableCell>
              <TableCell className="text-left"><Link className="p-4" href={`/invoices/${result.id}`}>{result.customer.email}</Link></TableCell>
              <TableCell className="text-center"><Link className="p-4" href={`/invoices/${result.id}`}><Badge className={cn(
                        "rounded-full capitalize",
                        result.status === "open" && "bg-blue-500",
                        result.status === "paid" && "bg-green-500",
                        result.status === "void" && "bg-zinc-500",
                        result.status === "uncollectible" && "bg-red-700",
                      )}>{result.status}</Badge></Link></TableCell>
              <TableCell className="text-right"><Link className="p-4" href={`/invoices/${result.id}`}>${(result.value / 100).toFixed(2)}</Link></TableCell>
              </TableRow>
             )
          })}
        </TableBody>
      </Table>
      </Container>
    </main>
  );
}
