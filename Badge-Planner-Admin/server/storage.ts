import { db } from "./db";
import {
  admins, badges, schedule,
  type Admin, type InsertAdmin,
  type Badge, type InsertBadge,
  type ScheduleItem, type InsertSchedule
} from "@shared/schema";
import { eq, sql, desc, asc } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Admins
  getAdmins(): Promise<Admin[]>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  deleteAdmin(id: number): Promise<void>;

  // Badges
  getBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  getBadgeByQrCode(qrCodeId: string): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  incrementScanCount(id: number): Promise<void>;

  // Schedule
  getSchedule(): Promise<ScheduleItem[]>;
  createScheduleItem(item: InsertSchedule): Promise<ScheduleItem>;
  updateScheduleItem(id: number, updates: Partial<InsertSchedule>): Promise<ScheduleItem>;
  deleteScheduleItem(id: number): Promise<void>;

  // Stats
  getStats(): Promise<{ totalBadges: number; totalScans: number }>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods delegated to the existing authStorage
  async getUser(id: string) {
    return authStorage.getUser(id);
  }
  async upsertUser(user: any) {
    return authStorage.upsertUser(user);
  }

  // Admins
  async getAdmins(): Promise<Admin[]> {
    return await db.select().from(admins);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  async deleteAdmin(id: number): Promise<void> {
    await db.delete(admins).where(eq(admins.id, id));
  }

  // Badges
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges).orderBy(desc(badges.createdAt));
  }

  async getBadge(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }

  async getBadgeByQrCode(qrCodeId: string): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.qrCodeId, qrCodeId));
    return badge;
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db.insert(badges).values(insertBadge).returning();
    return badge;
  }

  async incrementScanCount(id: number): Promise<void> {
    await db
      .update(badges)
      .set({ 
        scanCount: sql`${badges.scanCount} + 1`,
        lastScannedAt: new Date()
      })
      .where(eq(badges.id, id));
  }

  // Schedule
  async getSchedule(): Promise<ScheduleItem[]> {
    return await db.select().from(schedule).orderBy(asc(schedule.order), asc(schedule.time));
  }

  async createScheduleItem(insertItem: InsertSchedule): Promise<ScheduleItem> {
    const [item] = await db.insert(schedule).values(insertItem).returning();
    return item;
  }

  async updateScheduleItem(id: number, updates: Partial<InsertSchedule>): Promise<ScheduleItem> {
    const [item] = await db
      .update(schedule)
      .set(updates)
      .where(eq(schedule.id, id))
      .returning();
    return item;
  }

  async deleteScheduleItem(id: number): Promise<void> {
    await db.delete(schedule).where(eq(schedule.id, id));
  }

  // Stats
  async getStats(): Promise<{ totalBadges: number; totalScans: number }> {
    const [badgeCount] = await db.select({ count: sql<number>`count(*)` }).from(badges);
    const [scanSum] = await db.select({ sum: sql<number>`sum(${badges.scanCount})` }).from(badges);
    
    return {
      totalBadges: Number(badgeCount?.count || 0),
      totalScans: Number(scanSum?.sum || 0),
    };
  }
}

export const storage = new DatabaseStorage();
