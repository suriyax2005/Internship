import { paymentRepository } from '../repositories/paymentRepository.js';
import { unitRepository } from '../repositories/unitRepository.js';
import { maintenanceRepository } from '../repositories/maintenanceRepository.js';

export const reportService = {
  getFinancialReport: async (tenantFilter, startDate, endDate) => {
    const filter = { ...tenantFilter };
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const payments = await paymentRepository.findAll(filter);
    const totalCollected = payments
      .filter((p) => p.paymentStatus === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter((p) => p.paymentStatus === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOverdue = payments
      .filter((p) => p.paymentStatus === 'OVERDUE')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      summary: {
        totalCollected,
        totalPending,
        totalOverdue,
        totalRecords: payments.length,
      },
      payments,
    };
  },

  getOccupancyReport: async (tenantFilter) => {
    const units = await unitRepository.findAll(tenantFilter);
    const total = units.length;
    const occupied = units.filter((u) => u.status === 'OCCUPIED').length;
    const vacant = units.filter((u) => u.status === 'VACANT').length;
    const maintenance = units.filter((u) => u.status === 'MAINTENANCE').length;

    return {
      summary: {
        totalUnits: total,
        occupiedUnits: occupied,
        vacantUnits: vacant,
        maintenanceUnits: maintenance,
        occupancyRate: total > 0 ? ((occupied / total) * 100).toFixed(1) : 0,
      },
      units,
    };
  },

  getMaintenanceReport: async (tenantFilter) => {
    const tickets = await maintenanceRepository.findAll(tenantFilter);
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'OPEN').length;
    const inProgress = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
    const resolved = tickets.filter((t) => t.status === 'RESOLVED').length;
    const closed = tickets.filter((t) => t.status === 'CLOSED').length;

    return {
      summary: {
        totalTickets: total,
        openTickets: open,
        inProgressTickets: inProgress,
        resolvedTickets: resolved,
        closedTickets: closed,
      },
      tickets,
    };
  },
};
