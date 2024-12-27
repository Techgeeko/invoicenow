"use server";

import { Customers, Invoices, Status } from "../db/schema";
import { db } from "../db";
import { redirect } from "next/navigation";
import { auth } from '@clerk/nextjs/server'
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAction(formData: FormData) {
  const { userId } = await auth();


  if (!userId) {
    return;
  }

  const value = formData.get("value");
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const parsedValue = Math.floor(parseFloat(value ? String(value) : "0") * 100);

  console.log("Form Data:", Object.fromEntries(formData.entries()));
  console.log("Parsed Value:", parsedValue);

    const [customer] = await db.insert(Customers).values({
      name,
      email,
      userId,
    }).returning({id: Customers.id})

    const results = await db.insert(Invoices).values({
      value: parsedValue,
      description,
      userId,
      customerId: customer.id,
      status: "open",
    }).returning({id: Invoices.id})

    redirect(`/invoices/${results[0].id}`)
}

export async function updateStatusAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  const results = await db.update(Invoices).set({ status }).where(
    and( 
      eq(Invoices.id, parseInt(id)),
      eq(Invoices.userId, userId)
    )
  )

  revalidatePath(`/invoices/${id}`, `page`)

  console.log('results', results)
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get('id') as string;

  const results = await db.delete(Invoices).where(
    and( 
      eq(Invoices.id, parseInt(id)),
      eq(Invoices.userId, userId)
    )
  )

  redirect('/dashboard')
}