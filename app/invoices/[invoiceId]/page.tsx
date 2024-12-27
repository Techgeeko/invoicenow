import { db } from "@/lib/db";
import { Customers, Invoices } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./invoice";

export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { userId } = await auth();
  const { invoiceId } = await params;

  if (!userId) return;

  const parsedInvoiceId = parseInt(invoiceId);

  // Fetch the invoice data
  const result = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(
      and(
        eq(Invoices.id, parsedInvoiceId),  
        eq(Invoices.userId, userId)
      )
    )
    .limit(1);

  // Handle missing invoice
  if (!result || result.length === 0) {
    return (
      <main className="max-w-5xl justify-center gap-6 h-full mx-auto my-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Invoice Not Found</h1>
          <p className="text-lg mt-4">The invoice with ID #{invoiceId} does not exist.</p>
        </div>
      </main>
    );
  }

  const invoiceWithCustomer = {
    ...result[0].invoices,
    customer: result[0].customers
  };

  return <Invoice invoice={invoiceWithCustomer} />;
}