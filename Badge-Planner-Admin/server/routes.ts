import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Middleware to check if user is an admin
  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const email = req.user?.claims?.email;
    if (!email) {
      return res.status(401).json({ message: "No email found in user claims" });
    }

    const admin = await storage.getAdminByEmail(email);
    if (!admin) {
      // Auto-allow first user as admin if table is empty (bootstrapping)
      const admins = await storage.getAdmins();
      if (admins.length === 0) {
        await storage.createAdmin({ email, password: "admin" });
        return next();
      }
      return res.status(401).json({ message: "Access denied: Not an admin" });
    }
    next();
  };

  // === ADMINS ===
  app.get(api.admins.list.path, requireAdmin, async (req, res) => {
    const admins = await storage.getAdmins();
    res.json(admins);
  });

  app.post(api.admins.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.admins.create.input.parse(req.body);
      const admin = await storage.createAdmin(input);
      res.status(201).json(admin);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.admins.delete.path, requireAdmin, async (req, res) => {
    await storage.deleteAdmin(Number(req.params.id));
    res.status(204).send();
  });

  // === BADGES ===
  app.get(api.badges.list.path, requireAdmin, async (req, res) => {
    const badges = await storage.getBadges();
    res.json(badges);
  });

  app.post(api.badges.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.badges.create.input.parse(req.body);
      const badge = await storage.createBadge(input);
      res.status(201).json(badge);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Public Get Badge by QR Code (mapped to ID for now, or use separate lookup if needed)
  // The route is /api/badges/:id, but public view might use qrCodeId. 
  // Let's support looking up by qrCodeId via a query param or a separate endpoint if needed.
  // Actually, the route is /api/badges/:id. If :id is a number, look by ID.
  // But wait, the public URL is /view/:qrCodeId. Frontend will request /api/badges?qrCodeId=... OR we need a dedicated endpoint.
  // The schema has `get` as /api/badges/:id. Let's stick to ID for internal usage.
  // BUT the QR code likely contains the UUID (qrCodeId).
  // Let's add a specialized public endpoint for fetching by QR Code ID if the standard ID lookups aren't enough.
  // Actually, let's overload GET /api/badges/:id to handle both numeric ID or string QR ID? 
  // Or just iterate:
  app.get(api.badges.get.path, async (req, res) => {
    const idParam = req.params.id;
    let badge;
    
    // Try as numeric ID
    if (!isNaN(Number(idParam))) {
      badge = await storage.getBadge(Number(idParam));
    }
    
    // If not found, try as qrCodeId
    if (!badge) {
      badge = await storage.getBadgeByQrCode(idParam);
    }

    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }
    res.json(badge);
  });

  app.post(api.badges.scan.path, async (req, res) => {
    const idParam = req.params.id;
    let badge;
    
    if (!isNaN(Number(idParam))) {
      badge = await storage.getBadge(Number(idParam));
    }
    if (!badge) {
      badge = await storage.getBadgeByQrCode(idParam);
    }

    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }
    
    await storage.incrementScanCount(badge.id);
    res.json({ success: true });
  });

  // === SCHEDULE ===
  app.get(api.schedule.list.path, async (req, res) => {
    const schedule = await storage.getSchedule();
    res.json(schedule);
  });

  app.post(api.schedule.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.schedule.create.input.parse(req.body);
      const item = await storage.createScheduleItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.schedule.update.path, requireAdmin, async (req, res) => {
    try {
      const input = api.schedule.update.input.parse(req.body);
      const item = await storage.updateScheduleItem(Number(req.params.id), input);
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.schedule.delete.path, requireAdmin, async (req, res) => {
    await storage.deleteScheduleItem(Number(req.params.id));
    res.status(204).send();
  });

  // === STATS ===
  app.get(api.stats.get.path, requireAdmin, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Seeding (Optional, for demo)
  const existingSchedule = await storage.getSchedule();
  if (existingSchedule.length === 0) {
    await storage.createScheduleItem({ time: "09:00 AM", activity: "Welcome Breakfast", order: 1 });
    await storage.createScheduleItem({ time: "10:00 AM", activity: "Keynote Speech", order: 2 });
    await storage.createScheduleItem({ time: "12:00 PM", activity: "Lunch Break", order: 3 });
    await storage.createScheduleItem({ time: "02:00 PM", activity: "Workshops", order: 4 });
  }

  return httpServer;
}
