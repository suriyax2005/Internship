import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Property } from './models/Property.js';
import { Unit } from './models/Unit.js';
import { TenantProfile } from './models/TenantProfile.js';
import { Lease } from './models/Lease.js';
import { Payment } from './models/Payment.js';
import { MaintenanceTicket } from './models/MaintenanceTicket.js';
import { Document } from './models/Document.js';
import { ROLES, UNIT_STATUS, LEASE_STATUS, PAYMENT_STATUS, TICKET_PRIORITY, TICKET_STATUS, DOCUMENT_TYPE } from './constants/roles.js';
import { logger } from './config/logger.js';

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_rental_saas';
    logger.info(`Connecting to MongoDB at ${connStr} for seeding...`);
    await mongoose.connect(connStr);

    logger.info('Clearing existing database collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Unit.deleteMany({});
    await TenantProfile.deleteMany({});
    await Lease.deleteMany({});
    await Payment.deleteMany({});
    await MaintenanceTicket.deleteMany({});
    await Document.deleteMany({});

    logger.info('Seeding users...');
    // 1. Super Admin
    const superAdmin = await User.create({
      fullName: 'Super System Administrator',
      email: 'admin@smartrental.com',
      password: 'Password123!',
      phone: '+1 (555) 000-1111',
      role: ROLES.SUPER_ADMIN,
    });

    // 2. Landlord 1
    const landlord1 = await User.create({
      fullName: 'Alexander Wright (Landlord)',
      email: 'landlord@example.com',
      password: 'Password123!',
      phone: '+1 (555) 234-5678',
      role: ROLES.LANDLORD,
    });
    landlord1.tenantId = landlord1._id;
    await landlord1.save();

    // 3. Landlord 2
    const landlord2 = await User.create({
      fullName: 'Sophia Sterling (Landlord 2)',
      email: 'landlord2@example.com',
      password: 'Password123!',
      phone: '+1 (555) 987-6543',
      role: ROLES.LANDLORD,
    });
    landlord2.tenantId = landlord2._id;
    await landlord2.save();

    // 4. Tenant Users
    const tenantUser1 = await User.create({
      fullName: 'Michael Jordan',
      email: 'tenant@example.com',
      password: 'Password123!',
      phone: '+1 (555) 111-2222',
      role: ROLES.TENANT,
      tenantId: landlord1._id,
    });

    const tenantUser2 = await User.create({
      fullName: 'Emily Blunt',
      email: 'tenant2@example.com',
      password: 'Password123!',
      phone: '+1 (555) 333-4444',
      role: ROLES.TENANT,
      tenantId: landlord1._id,
    });

    logger.info('Seeding properties...');
    const prop1 = await Property.create({
      propertyName: 'Grand Heights Luxury Apartments',
      propertyType: 'Apartment',
      description: 'Modern high-rise luxury apartment complex in downtown with full amenities.',
      address: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      zipCode: '98101',
      totalUnits: 4,
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
      ownerId: landlord1._id,
      tenantId: landlord1._id,
    });

    const prop2 = await Property.create({
      propertyName: 'Sunset Commercial Plaza',
      propertyType: 'Commercial',
      description: 'Prime retail and office suites with heavy foot traffic.',
      address: '1200 Market Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      zipCode: '94103',
      totalUnits: 2,
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
      ownerId: landlord1._id,
      tenantId: landlord1._id,
    });

    logger.info('Seeding units...');
    const unit101 = await Unit.create({
      propertyId: prop1._id,
      unitNumber: 'Suite 101',
      floor: 1,
      rentAmount: 2400,
      depositAmount: 2400,
      status: UNIT_STATUS.OCCUPIED,
      tenantId: landlord1._id,
    });

    const unit102 = await Unit.create({
      propertyId: prop1._id,
      unitNumber: 'Suite 102',
      floor: 1,
      rentAmount: 2600,
      depositAmount: 2600,
      status: UNIT_STATUS.OCCUPIED,
      tenantId: landlord1._id,
    });

    const unit201 = await Unit.create({
      propertyId: prop1._id,
      unitNumber: 'Suite 201',
      floor: 2,
      rentAmount: 2800,
      depositAmount: 2800,
      status: UNIT_STATUS.VACANT,
      tenantId: landlord1._id,
    });

    const unit202 = await Unit.create({
      propertyId: prop1._id,
      unitNumber: 'Suite 202',
      floor: 2,
      rentAmount: 2900,
      depositAmount: 2900,
      status: UNIT_STATUS.MAINTENANCE,
      tenantId: landlord1._id,
    });

    logger.info('Seeding tenant profiles...');
    const tenantProfile1 = await TenantProfile.create({
      userId: tenantUser1._id,
      fullName: tenantUser1.fullName,
      email: tenantUser1.email,
      phone: tenantUser1.phone,
      emergencyContact: 'Sarah Jordan (+1 555-999-8888)',
      governmentId: 'US-PASS-98765432',
      unitId: unit101._id,
      leaseStart: new Date(2026, 0, 1),
      leaseEnd: new Date(2026, 11, 31),
      tenantId: landlord1._id,
    });

    const tenantProfile2 = await TenantProfile.create({
      userId: tenantUser2._id,
      fullName: tenantUser2.fullName,
      email: tenantUser2.email,
      phone: tenantUser2.phone,
      emergencyContact: 'John Blunt (+1 555-777-6666)',
      governmentId: 'US-PASS-12345678',
      unitId: unit102._id,
      leaseStart: new Date(2026, 1, 1),
      leaseEnd: new Date(2027, 0, 31),
      tenantId: landlord1._id,
    });

    logger.info('Seeding leases...');
    const lease1 = await Lease.create({
      tenantProfileId: tenantProfile1._id,
      unitId: unit101._id,
      rentAmount: 2400,
      securityDeposit: 2400,
      startDate: new Date(2026, 0, 1),
      endDate: new Date(2026, 11, 31),
      status: LEASE_STATUS.ACTIVE,
      tenantId: landlord1._id,
    });

    const lease2 = await Lease.create({
      tenantProfileId: tenantProfile2._id,
      unitId: unit102._id,
      rentAmount: 2600,
      securityDeposit: 2600,
      startDate: new Date(2026, 1, 1),
      endDate: new Date(2027, 0, 31),
      status: LEASE_STATUS.ACTIVE,
      tenantId: landlord1._id,
    });

    logger.info('Seeding payments...');
    await Payment.create({
      tenantProfileId: tenantProfile1._id,
      leaseId: lease1._id,
      amount: 2400,
      dueDate: new Date(2026, 0, 1),
      paidDate: new Date(2026, 0, 2),
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: PAYMENT_STATUS.PAID,
      receiptUrl: '/uploads/sample_receipt_jan.pdf',
      tenantId: landlord1._id,
    });

    await Payment.create({
      tenantProfileId: tenantProfile1._id,
      leaseId: lease1._id,
      amount: 2400,
      dueDate: new Date(2026, 1, 1),
      paidDate: new Date(2026, 1, 1),
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: PAYMENT_STATUS.PAID,
      receiptUrl: '/uploads/sample_receipt_feb.pdf',
      tenantId: landlord1._id,
    });

    await Payment.create({
      tenantProfileId: tenantProfile1._id,
      leaseId: lease1._id,
      amount: 2400,
      dueDate: new Date(2026, 2, 1),
      paymentStatus: PAYMENT_STATUS.PENDING,
      tenantId: landlord1._id,
    });

    await Payment.create({
      tenantProfileId: tenantProfile2._id,
      leaseId: lease2._id,
      amount: 2600,
      dueDate: new Date(2026, 1, 1),
      paidDate: new Date(2026, 1, 3),
      paymentMethod: 'ONLINE',
      paymentStatus: PAYMENT_STATUS.PAID,
      tenantId: landlord1._id,
    });

    await Payment.create({
      tenantProfileId: tenantProfile2._id,
      leaseId: lease2._id,
      amount: 2600,
      dueDate: new Date(2026, 2, 1),
      paymentStatus: PAYMENT_STATUS.OVERDUE,
      tenantId: landlord1._id,
    });

    logger.info('Seeding maintenance tickets...');
    await MaintenanceTicket.create({
      tenantProfileId: tenantProfile1._id,
      propertyId: prop1._id,
      unitId: unit101._id,
      title: 'Kitchen Sink Leaking Water',
      description: 'The kitchen sink pipe underneath is leaking whenever water is run.',
      priority: TICKET_PRIORITY.HIGH,
      status: TICKET_STATUS.IN_PROGRESS,
      tenantId: landlord1._id,
    });

    await MaintenanceTicket.create({
      tenantProfileId: tenantProfile2._id,
      propertyId: prop1._id,
      unitId: unit102._id,
      title: 'HVAC Air Conditioning Filter Replacement',
      description: 'Air conditioning unit is making a rattling noise when turned on.',
      priority: TICKET_PRIORITY.MEDIUM,
      status: TICKET_STATUS.OPEN,
      tenantId: landlord1._id,
    });

    logger.info('Seeding documents...');
    await Document.create({
      title: 'Grand Heights Suite 101 Signed Lease Agreement',
      documentType: DOCUMENT_TYPE.LEASE,
      fileUrl: '/uploads/lease_101.pdf',
      fileType: 'pdf',
      relatedId: lease1._id,
      uploadedBy: landlord1._id,
      tenantId: landlord1._id,
    });

    await Document.create({
      title: 'Property Rules and Tenant Guidelines 2026',
      documentType: DOCUMENT_TYPE.PROPERTY,
      fileUrl: '/uploads/guidelines.pdf',
      fileType: 'pdf',
      relatedId: prop1._id,
      uploadedBy: landlord1._id,
      tenantId: landlord1._id,
    });

    logger.info('===========================================================');
    logger.info('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    logger.info('===========================================================');
    logger.info('Demo Credentials:');
    logger.info('  1) Super Admin: admin@smartrental.com / Password123!');
    logger.info('  2) Landlord:    landlord@example.com / Password123!');
    logger.info('  3) Tenant:      tenant@example.com   / Password123!');
    logger.info('===========================================================');

    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
