import type { Express } from "express";
import { createServer } from "http";
import { setupAuth } from "./auth";
import cors from "cors";
import express from "express";
import subscriptionRoutes from "./routes/subscription";
import webhookRoutes from "./routes/webhook";
import aiRoutes from "./routes/ai";
import { registerFeatureRoutes } from "./routes/features";
import { registerContentRoutes } from "./routes/content";
import { registerCloneMeRoutes } from "./routes/cloneMe";
import messagesRoutes from "./routes/announcements";
import adminLogsRoutes from "./routes/admin-logs";
import paymentRoutes from "./routes/payment";
import { registerSupergodRoutes } from "./routes/supergod";
import { logError } from "./utils/logger";
import { requireRole, requireSupergod } from "./middleware/rbac";

// Simple auth checks
const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  res.status(403).json({ message: "Not authorized" });
};

// Global error handler
const errorHandler = async (err: any, req: any, res: any, next: any) => {
  await logError(
    "ERROR",
    err.message,
    `${req.method} ${req.path}`,
    err.stack
  );

  res.status(500).json({
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "production" ? undefined : err.message
  });
};

export function registerRoutes(app: Express) {
  // Basic CORS setup
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : '*',
    credentials: true
  }));

  // Form data parser
  app.use(express.urlencoded({ 
    extended: true,
    limit: '50mb'
  }));

  // Setup auth
  setupAuth(app);

  // Register routes
  app.use("/api/subscription", subscriptionRoutes);
  app.use("/api/webhook", webhookRoutes);
  app.use("/api/ai", aiRoutes);

  // Register feature routes
  registerFeatureRoutes(app);
  
  // Register content generation routes
  registerContentRoutes(app);
  
  // Register Clone Me feature routes
  registerCloneMeRoutes(app);

  app.use("/api/messages", messagesRoutes);
  app.use("/api/admin", requireAdmin, adminLogsRoutes);
  app.use("/api/payment", paymentRoutes);
  
  // Register supergod-only routes
  registerSupergodRoutes(app); // These routes have their own middleware checks

  // Error handler must be last
  app.use(errorHandler);

  return createServer(app);
}