import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwtUtils.js';
import { logger } from './logger.js';

let io = null;

export const initSocket = (httpServer, allowedOrigin) => {
  const allowedOrigins = Array.isArray(allowedOrigin)
    ? allowedOrigin
    : typeof allowedOrigin === 'string'
    ? allowedOrigin.split(',').map((s) => s.trim()).filter(Boolean)
    : ['http://localhost:5173'];

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  // Authentication Middleware for Socket.IO
  io.use((socket, next) => {
    try {
      let token = socket.handshake.auth?.token;

      // Also check headers if not in auth payload
      if (!token && socket.handshake.headers?.authorization) {
        const authHeader = socket.handshake.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyAccessToken(token);
      if (!decoded) {
        return next(new Error('Authentication error: Invalid or expired token'));
      }

      socket.user = decoded;
      next();
    } catch (err) {
      logger.warn(`Socket authentication failed: ${err.message}`);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    logger.info(`Socket connected: ${socket.id} (User: ${user?.id}, Role: ${user?.role})`);

    if (user?.id) {
      // Room for personal notifications
      socket.join(`user:${user.id}`);
    }

    if (user?.tenantId) {
      // Room for landlord organization/tenant scope
      socket.join(`tenant:${user.tenantId}`);
    }

    if (user?.role) {
      // Room for role-based broadcast
      socket.join(`role:${user.role}`);
    }

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  logger.info('WebSocket Socket.IO server initialized successfully');
  return io;
};

export const getIO = () => {
  return io;
};

export const emitToUser = (userId, event, payload) => {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
};

export const emitToTenant = (tenantId, event, payload) => {
  if (io && tenantId) {
    io.to(`tenant:${tenantId}`).emit(event, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
};

export const emitToRole = (role, event, payload) => {
  if (io && role) {
    io.to(`role:${role}`).emit(event, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
};

export const emitToAll = (event, payload) => {
  if (io) {
    io.emit(event, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
};
