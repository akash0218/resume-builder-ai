import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./swagger";
import { apiKeyAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

import healthRoutes from "./routes/health";
import analyzeJdRoutes from "./routes/analyzeJd";
import generateResumeRoutes from "./routes/generateResume";
import repairResumeRoutes from "./routes/repairResume";
import suggestTechStackRoutes from "./routes/suggestTechStack";

const app: Express = express();

// ===== Security Middleware =====
// Disable CSP for Swagger UI to work properly
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ===== CORS =====
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["content-type", "authorization", "x-api-key"],
    credentials: false,
  })
);

// ===== Request Limits =====
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// ===== Rate Limiting =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ===== Swagger Documentation (no auth) =====
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Health Check (no auth) =====
app.use("/", healthRoutes);

// ===== API Key Authentication =====
app.use(apiKeyAuth);

// ===== API Routes =====
app.use("/v1", analyzeJdRoutes);
app.use("/v1", generateResumeRoutes);
app.use("/v1", repairResumeRoutes);
app.use("/v1", suggestTechStackRoutes);

// ===== Error Handler (must be last) =====
app.use(errorHandler);

export default app;
