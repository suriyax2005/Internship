import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import unitReducer from './slices/unitSlice';
import tenantReducer from './slices/tenantSlice';
import leaseReducer from './slices/leaseSlice';
import paymentReducer from './slices/paymentSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import documentReducer from './slices/documentSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    units: unitReducer,
    tenants: tenantReducer,
    leases: leaseReducer,
    payments: paymentReducer,
    maintenance: maintenanceReducer,
    documents: documentReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
