'use client'

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { Customers, Invoices } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/shared/container";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES  } from "@/lib/data/invoices";
import { updateStatusAction, deleteInvoiceAction } from "@/lib/actions/actions";
import  { ChevronDown, Ellipsis, Trash2 } from 'lucide-react'
import { useOptimistic } from "react";

interface InvoiceProps {
    invoice: typeof Invoices.$inferSelect & { customer: typeof Customers.$inferSelect } 
}

export default function Invoice({ invoice }: InvoiceProps ) {
    const [currentStatus, setCurrentStatus] = useOptimistic(invoice.status, (state, newStatus) =>{
        return String(newStatus)
    })

    async function handleOnUpdateStatus(formData: FormData) {
        const originalStatus = currentStatus;

        setCurrentStatus(formData.get('status'))
        try {
            await updateStatusAction(formData)
        } catch (error) {
            setCurrentStatus(originalStatus);
        }
        
    }

  return (
    <main className="w-full justify-center gap-6 h-full">
      <Container>
      <div className="flex justify-between">
        <h1 className="flex items-center gap-4 text-3xl font-bold">Invoice #{invoice.id}
          <Badge className={cn(
            "rounded-full capitalize",
            currentStatus === "open" && "bg-blue-500",
            currentStatus === "paid" && "bg-green-500",
            currentStatus === "void" && "bg-zinc-500",
            currentStatus === "uncollectible" && "bg-red-700",
          )}>
            {invoice.status}
          </Badge>
        </h1>

        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='flex items-center gap-2' variant={"outline"}>Change Status<ChevronDown className="w-4 h-auto"/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {AVAILABLE_STATUSES.map(status => {
                return (
                  <DropdownMenuItem key={status.id}>
                    <form action={handleOnUpdateStatus}>
                      <input type="hidden" name="id" value={invoice.id}/>
                      <input type="hidden" name="status" value={status.id}/>
                      <button>{status.label}</button>
                      </form></DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='flex items-center gap-2' variant={"outline"}><span className="sr-only">More Options</span>
                <Ellipsis className="w-4 h-auto"/></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                    <DropdownMenuItem>
                        <DialogTrigger asChild><button className='flex gap-2 items-center' ><Trash2 className='w-4 h-auto' />Delete Invoice</button>
                        </DialogTrigger>
                      </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="gap-4">
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete invoice?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </DialogDescription>
                <DialogFooter>
                  <form action={deleteInvoiceAction}>
                    <input type="hidden" name="id" value={invoice.id}/>
                  </form>
                  <Button variant="destructive" className='flex gap-2 items-center' ><Trash2 className='w-4 h-auto' />Delete Invoice</Button>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        
      </div>

      <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
      <p className="text-lg mb-8">{invoice.description}</p>

      <h2 className="font-bold text-lg mb-4">Billing Details</h2>

      <ul className="grid gap-2">
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID</strong>
          <span>{invoice.id}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date</strong>
          <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
          <span>{invoice.customer.name}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Email</strong>
          <span>{invoice.customer.email}</span>
        </li>
      </ul>
      </Container>
    </main>
  );
}