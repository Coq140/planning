import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users as authUsers, sessions } from "./models/auth";

// Re-export auth models so they are included in migrations
export { authUsers as users, sessions };

// === TABLE DEFINITIONS ===

// Admins whitelist
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Badges (QR Codes)
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Name of the badge holder
  qrCodeId: text("qr_code_id").notNull().unique(), // Unique ID for the QR URL
  scanCount: integer("scan_count").default(0),
  lastScannedAt: timestamp("last_scanned_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schedule (Global for the day)
export const schedule = pgTable("schedule", {
  id: serial("id").primaryKey(),
  time: text("time").notNull(), // e.g., "09:00", "10:30 AM"
  activity: text("activity").notNull(),
  delay: integer("delay").default(0), // Delay in minutes
  order: integer("order").notNull().default(0), // For sorting
});

// === SCHEMAS ===

export const insertAdminSchema = createInsertSchema(admins).pick({ email: true, password: true });
export const insertBadgeSchema = createInsertSchema(badges).pick({ name: true, qrCodeId: true });
export const insertScheduleSchema = createInsertSchema(schedule).omit({ id: true });

// === TYPES ===

export type Admin = typeof admins.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type ScheduleItem = typeof schedule.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
