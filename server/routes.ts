import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.post("/api/users", async (req, res) => {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const existing = await storage.getUserByUsername(parsed.data.username);
    if (existing) {
      return res.json(existing);
    }

    const user = await storage.createUser(parsed.data);
    res.json(user);
  });

  app.post("/api/users/:id/clicks", async (req, res) => {
    const { clicks, rank } = req.body;
    const id = parseInt(req.params.id);
    
    try {
      const user = await storage.updateUserClicks(id, clicks, rank);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/leaderboard", async (_req, res) => {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  });

  return createServer(app);
}
