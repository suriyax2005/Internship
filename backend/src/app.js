import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import unitRoutes from './routes/unitRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import leaseRoutes from './routes/leaseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

import { errorHandler } from './middleware/errorMiddleware.js';
import { mongoSanitize, requestLogger } from './middleware/securityMiddleware.js';

const app = express();

// Trust reverse proxy (Render, Railway, Heroku, AWS ELB, etc.) for secure cookies & rate limiting
app.set('trust proxy', 1);

// Security Helmet headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration (supports comma-separated origins, e.g., 'https://frontend.vercel.app,http://localhost:5173')
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Request Logger
app.use(requestLogger);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// NoSQL Injection Sanitizer
app.use(mongoSanitize);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// General API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Rental SaaS Backend API is operational.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/units', unitRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/leases', leaseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/reports', reportRoutes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
