import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("sinonexus.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    pass_type TEXT,
    nationality TEXT,
    age INTEGER,
    sector TEXT,
    probability INTEGER,
    tier TEXT,
    ip TEXT
  );

  CREATE TABLE IF NOT EXISTS corporate_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,
    company_name TEXT,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    company_size TEXT,
    service_needed TEXT,
    urgency TEXT,
    budget TEXT,
    message TEXT,
    status TEXT DEFAULT 'new'
  );

  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Simple bearer token auth
const ADMIN_KEY = process.env.ADMIN_KEY || 'sinonexus-admin-2026-change-me';

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Default Weights
const DEFAULT_CONFIG = {
  weights: {
    criteriaMatch: 45,
    trendApproval: 20,
    districtFactor: 20,
    nationalityMod: 10,
    ageFactor: 5
  },
  thresholds: {
    epSalaryMin: 5600,
    epSalaryFinance: 6200,
    sPassSalaryMin: 3300,
    compassMin: 40
  }
};

// Helper to get config
function getConfig() {
  const row = db.prepare("SELECT value FROM config WHERE key = 'algorithm'").get() as { value: string } | undefined;
  return row ? JSON.parse(row.value) : DEFAULT_CONFIG;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin: Get Config
  app.get("/api/admin/config", requireAuth, (req, res) => {
    res.json(getConfig());
  });

  // Admin: Update Config (This is how you control your IP)
  app.post("/api/admin/config", requireAuth, (req, res) => {
    const newConfig = req.body;
    db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)").run('algorithm', JSON.stringify(newConfig));
    res.json({ success: true, message: "Algorithm updated instantly." });
  });

  // Admin: Get Leads
  app.get("/api/admin/leads", requireAuth, (req, res) => {
    const leads = db.prepare("SELECT * FROM corporate_leads ORDER BY timestamp DESC").all();
    res.json(leads);
  });

  // Assessment Endpoint
  app.post("/api/assess", (req, res) => {
    const config = getConfig();
    const { passType, nationality, age, monthlySalary, sector, education, universityTier } = req.body;
    
    let score = 50;
    const warnings = [];

    // Use dynamic thresholds from config
    const salary = parseInt(monthlySalary) || 0;
    const userAge = parseInt(age) || 30;
    let requiredSalary = config.thresholds.epSalaryMin;
    
    if (userAge > 23) {
      const increments = { 25: 100, 30: 400, 35: 900, 40: 1500, 45: 2200 };
      for (const [bracket, inc] of Object.entries(increments)) {
        if (userAge >= parseInt(bracket)) requiredSalary = config.thresholds.epSalaryMin + inc;
      }
    }

    // Apply weights (simplified implementation of the 45/20/20/10/5 split)
    if (salary >= requiredSalary) {
      score += (config.weights.criteriaMatch * 0.5);
    } else if (salary >= requiredSalary * 0.9) {
      score += (config.weights.criteriaMatch * 0.2);
      warnings.push("Salary is slightly below the recommended threshold for your age.");
    }

    if (universityTier === 'top_100') {
      score += 15;
    }

    const probability = Math.min(98, Math.max(2, Math.round(score)));
    
    let tier = 'moderate';
    if (probability >= 75) tier = 'high';
    if (probability < 40) tier = 'low';

    const stmt = db.prepare("INSERT INTO assessments (pass_type, nationality, age, sector, probability, tier, ip) VALUES (?, ?, ?, ?, ?, ?, ?)");
    stmt.run(passType, nationality, userAge, sector, probability, tier, req.ip);

    res.json({
      probability,
      tier,
      recommendation: tier === 'high' ? "Strong candidate - High probability of approval" : (tier === 'moderate' ? "Moderate candidate - Consider strengthening application" : "Challenging case - Major eligibility gaps identified"),
      warnings,
      disclaimer: "This assessment is based on statistical trends and official criteria. Actual approval is at the discretion of Singapore authorities."
    });
  });

  // Corporate Lead Endpoint
  app.post("/api/corporate-lead", (req, res) => {
    const { companyName, contactName, email, phone, companySize, serviceNeeded, urgency, budget, message, sessionId } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO corporate_leads (session_id, company_name, contact_name, email, phone, company_size, service_needed, urgency, budget, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(sessionId, companyName, contactName, email, phone, companySize, serviceNeeded, urgency, budget, message);
    
    res.json({ success: true, message: "Thank you! Our corporate team will contact you within 24 hours." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
