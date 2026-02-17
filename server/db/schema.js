import { pgTable, serial, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";

// Societies: The organizers
export const societies = pgTable("societies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  adminEmail: varchar("admin_email", { length: 256 }).unique().notNull(),
});

// Events: The core content
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  societyId: integer("society_id").references(() => societies.id),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  capacity: integer("capacity").default(100),
});

// Registrations: Who is going where
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  studentEmail: varchar("student_email", { length: 256 }).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
});