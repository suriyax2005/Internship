import { ROLES } from '../constants/roles.js';

export const enforceTenantScope = (req, res, next) => {
  if (req.user && req.user.role !== ROLES.SUPER_ADMIN) {
    req.tenantFilter = { tenantId: req.user.tenantId };
  } else {
    req.tenantFilter = {};
  }
  next();
};
