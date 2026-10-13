import { leaseRepository } from '../repositories/leaseRepository.js';
import { unitRepository } from '../repositories/unitRepository.js';
import { tenantRepository } from '../repositories/tenantRepository.js';
import { paymentRepository } from '../repositories/paymentRepository.js';
import { ApiError } from '../utils/apiError.js';
import { LEASE_STATUS, UNIT_STATUS, PAYMENT_STATUS } from '../constants/roles.js';

export const leaseService = {
  createLease: async (leaseData, user) => {
    const tenantId = user.tenantId || user._id;

    const unit = await unitRepository.findById(leaseData.unitId, { tenantId });
    if (!unit) {
      throw new ApiError(404, 'Associated unit not found.');
    }

    const tenantProfile = await tenantRepository.findById(leaseData.tenantProfileId, { tenantId });
    if (!tenantProfile) {
      throw new ApiError(404, 'Associated tenant profile not found.');
    }

    const payload = {
      ...leaseData,
      tenantId,
      status: leaseData.status || LEASE_STATUS.ACTIVE,
    };

    const lease = await leaseRepository.create(payload);

    // Update unit status to OCCUPIED and update tenant dates
    await unitRepository.updateById(leaseData.unitId, { tenantId }, { status: UNIT_STATUS.OCCUPIED });
    await tenantRepository.updateById(
      leaseData.tenantProfileId,
      { tenantId },
      { unitId: leaseData.unitId, leaseStart: leaseData.startDate, leaseEnd: leaseData.endDate }
    );

    // Generate initial rent payment record due on startDate
    await paymentRepository.create({
      tenantProfileId: leaseData.tenantProfileId,
      leaseId: lease._id,
      amount: leaseData.rentAmount,
      dueDate: leaseData.startDate,
      paymentStatus: PAYMENT_STATUS.PENDING,
      tenantId,
    });

    return lease;
  },

  getLeases: async (tenantFilter) => {
    return await leaseRepository.findAll(tenantFilter);
  },

  getLeaseById: async (id, tenantFilter) => {
    const lease = await leaseRepository.findById(id, tenantFilter);
    if (!lease) {
      throw new ApiError(404, 'Lease contract not found.');
    }
    return lease;
  },

  updateLease: async (id, tenantFilter, updateData) => {
    const lease = await leaseRepository.updateById(id, tenantFilter, updateData);
    if (!lease) {
      throw new ApiError(404, 'Lease not found or unauthorized.');
    }

    if (updateData.status === LEASE_STATUS.EXPIRED || updateData.status === LEASE_STATUS.TERMINATED) {
      await unitRepository.updateById(lease.unitId, tenantFilter, { status: UNIT_STATUS.VACANT });
    }

    return lease;
  },

  deleteLease: async (id, tenantFilter) => {
    const lease = await leaseRepository.findById(id, tenantFilter);
    if (!lease) {
      throw new ApiError(404, 'Lease not found or unauthorized.');
    }

    await leaseRepository.deleteById(id, tenantFilter);
    return true;
  },
};
