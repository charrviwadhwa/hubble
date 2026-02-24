import { pgTable, serial, varchar, text, timestamp, integer,boolean,unique } from "drizzle-orm/pg-core";


export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 20 }).default('student'),
  
  // 🟢 NEW CAMPUS IDENTITY COLUMNS
  branch: varchar('branch', { length: 100 }), // e.g., "Information Technology"
  year: varchar('year', { length: 20 }),      // e.g., "3rd Year"
  
  // 🟢 NEW SOCIAL LINKS
  github: text('github'),
  linkedin: text('linkedin'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  societyId: integer("society_id").references(() => societies.id),
  banner: text("banner"),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  shortDescription: varchar("short_description", { length: 255 }),
  longDescription: text("long_description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: varchar("location", { length: 255 }).notNull(), // "Online" or "Room 401"
  registrationDeadline: timestamp("registration_deadline"),
});
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
  attended: boolean("attended").default(false),
});

export const societies = pgTable("societies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  collegeName: varchar("college_name", { length: 255 }).notNull(),
  presidentName: varchar("president_name", { length: 255 }).notNull(),
  instaLink: text("insta_link"),
  mailLink: text("mail_link"),
  linkedinLink: text("linkedin_link"),
  logo: text("logo"), // Stores the image path or Base64 string
  ownerId: integer("owner_id").references(() => users.id),
});

export const societyManagers = pgTable('society_managers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  societyId: integer('society_id').references(() => societies.id),
}, (table) => {
  return {
    // This ensures a user can only be added to a specific society ONCE
    unq: unique().on(table.userId, table.societyId),
  };
});