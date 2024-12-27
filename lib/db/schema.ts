import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { AVAILABLE_STATUSES } from "../data/invoices";

const statuses = AVAILABLE_STATUSES.map(({ id }) => id) as Array<Status>;

export type Status = typeof AVAILABLE_STATUSES[number]["id"];

export const statusEnum = pgEnum('status', statuses as [Status, ...Array<Status
    >
])

export const Invoices = pgTable('invoices', {
    userId: text('userId').notNull(),
    id: serial('id').primaryKey().notNull(),
    customerId: integer('customerId').notNull().references(() => Customers.id),
    createTs: timestamp('createTs').defaultNow().notNull(),
    status: statusEnum('status').notNull(),
    value: integer('value').notNull(),
    description: text('description').notNull(),
})
export const Customers = pgTable('customers', {
    userId: text('userId').notNull(),
    id: serial('id').primaryKey().notNull(),
    createTs: timestamp('createTs').defaultNow().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
})