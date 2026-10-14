import 'dotenv/config';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is resolved regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });


import app from './app.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import { startCronJobs } from './jobs/cronJobs.js';
import { initSocket } from './config/socket.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize Cron Jobs
startCronJobs();

// Create HTTP server & Socket.IO
const server = http.createServer(app);
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
initSocket(server, allowedOrigin);

server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server running or gracefully shut down if critical
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception Error: ${err.message}`);
});
