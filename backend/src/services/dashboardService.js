import { propertyRepository } from '../repositories/propertyRepository.js';
import { unitRepository } from '../repositories/unitRepository.js';
import { tenantRepository } from '../repositories/tenantRepository.js';
import { paymentRepository } from '../repositories/paymentRepository.js';
import { maintenanceRepository } from '../repositories/maintenanceRepository.js';
import { UNIT_STATUS, PAYMENT_STATUS, TICKET_STATUS } from '../constants/roles.js';

export const dashboardService = {
  getLandlordMetrics: async (tenantFilter) => {
    const totalProperties = await propertyRepository.count(tenantFilter);
    const totalUnits = await unitRepository.count(tenantFilter);
    const occupiedUnits = await unitRepository.count({ ...tenantFilter, status: UNIT_STATUS.OCCUPIED });
    const vacantUnits = await unitRepository.count({ ...tenantFilter, status: UNIT_STATUS.VACANT });
    const maintenanceUnits = await unitRepository.count({ ...tenantFilter, status: UNIT_STATUS.MAINTENANCE });

    const totalTenants = await tenantRepository.count(tenantFilter);

    const totalRevenue = await paymentRepository.aggregateRevenue(tenantFilter);
    const pendingRent = await paymentRepository.aggregatePendingRevenue(tenantFilter);

    const openTickets = await maintenanceRepository.count({
      ...tenantFilter,
      status: { $in: [TICKET_STATUS.OPEN, TICKET_STATUS.IN_PROGRESS] },
    });

    // Chart Data Generation (Last 6 Months Revenue Trend)
    const monthlyRevenueData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const monthName = d.toLocaleString('default', { month: 'short' });

      const paidRevenue = await paymentRepository.aggregateRevenue({
        ...tenantFilter,
        paidDate: { $gte: startOfMonth, $lte: endOfMonth },
      });

      monthlyRevenueData.push({
        month: monthName,
        revenue: paidRevenue,
      });
    }

    // Occupancy Distribution Data
    const occupancyChart = [
      { name: 'Occupied', value: occupiedUnits },
      { name: 'Vacant', value: vacantUnits },
      { name: 'Maintenance', value: maintenanceUnits },
    ];

    // Maintenance Priority Distribution Data
    const lowPriority = await maintenanceRepository.count({ ...tenantFilter, priority: 'LOW' });
    const mediumPriority = await maintenanceRepository.count({ ...tenantFilter, priority: 'MEDIUM' });
    const highPriority = await maintenanceRepository.count({ ...tenantFilter, priority: 'HIGH' });

    const ticketPriorityChart = [
      { priority: 'Low', count: lowPriority },
      { priority: 'Medium', count: mediumPriority },
      { priority: 'High', count: highPriority },
    ];

    return {
      summary: {
        totalProperties,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        totalTenants,
        totalRevenue,
        pendingRent,
        openTickets,
        occupancyRate: totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : 0,
      },
      charts: {
        monthlyRevenue: monthlyRevenueData,
        occupancy: occupancyChart,
        ticketPriority: ticketPriorityChart,
      },
    };
  },

  getTenantMetrics: async (userId) => {
    const tenantProfile = await tenantRepository.findByUserId(userId);
    if (!tenantProfile) {
      return {
        profile: null,
        pendingPaymentsCount: 0,
        openTicketsCount: 0,
        recentPayments: [],
        recentTickets: [],
      };
    }

    const tenantFilter = { tenantProfileId: tenantProfile._id };

    const pendingPayments = await paymentRepository.findAll({
      ...tenantFilter,
      paymentStatus: { $in: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.OVERDUE] },
    });

    const openTickets = await maintenanceRepository.findAll({
      ...tenantFilter,
      status: { $in: [TICKET_STATUS.OPEN, TICKET_STATUS.IN_PROGRESS] },
    });

    const recentPayments = await paymentRepository.findAll(tenantFilter);
    const recentTickets = await maintenanceRepository.findAll(tenantFilter);

    return {
      profile: tenantProfile,
      pendingPaymentsCount: pendingPayments.length,
      openTicketsCount: openTickets.length,
      recentPayments: recentPayments.slice(0, 5),
      recentTickets: recentTickets.slice(0, 5),
    };
  },
};
