import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BulkPaymentDto } from './dto/bulk-payment.dto';
import type { User } from '@repo/database';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, user: User) {
    // Only COMMITTEE or TREASURER can record payments
    if (!['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only committee members can record payments');
    }

    // Get flat and verify access
    const flat = await this.prisma.flat.findUnique({
      where: { id: createPaymentDto.flatId },
      include: { society: true },
    });

    if (!flat) {
      throw new BadRequestException('Flat not found');
    }

    if (user.role !== 'ADMIN' && flat.societyId !== user.societyId) {
      throw new ForbiddenException('You can only record payments for your own society');
    }

    // Check if payment already exists for this flat/month/year
    const existingPayment = await this.prisma.maintenancePayment.findUnique({
      where: {
        flatId_month_year: {
          flatId: createPaymentDto.flatId,
          month: createPaymentDto.month,
          year: createPaymentDto.year,
        },
      },
    });

    if (existingPayment) {
      throw new ConflictException('Payment for this month already exists');
    }

    return this.prisma.maintenancePayment.create({
      data: {
        ...createPaymentDto,
        societyId: flat.societyId,
        recordedById: user.id,
        paymentDate: createPaymentDto.paymentDate ? new Date(createPaymentDto.paymentDate) : null,
      },
      include: {
        flat: true,
        recordedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(societyId: string, user: User, month?: number, year?: number, status?: string) {
    // Verify access
    if (user.role !== 'ADMIN' && societyId !== user.societyId) {
      throw new ForbiddenException('You can only view payments for your own society');
    }

    const where: any = { societyId };

    if (month) where.month = month;
    if (year) where.year = year;
    if (status) where.status = status;

    return this.prisma.maintenancePayment.findMany({
      where,
      include: {
        flat: {
          select: {
            flatNumber: true,
            block: true,
            ownerName: true,
          },
        },
        recordedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { flat: { flatNumber: 'asc' } }],
    });
  }

  async findOne(id: string, user: User) {
    const payment = await this.prisma.maintenancePayment.findUnique({
      where: { id },
      include: {
        flat: true,
        society: true,
        recordedBy: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify access
    if (user.role !== 'ADMIN' && payment.societyId !== user.societyId) {
      throw new ForbiddenException('You can only view payments for your own society');
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto, user: User) {
    // Only COMMITTEE or TREASURER can update payments
    if (!['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only committee members can update payments');
    }

    const payment = await this.prisma.maintenancePayment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify access
    if (user.role !== 'ADMIN' && payment.societyId !== user.societyId) {
      throw new ForbiddenException('You can only update payments for your own society');
    }

    return this.prisma.maintenancePayment.update({
      where: { id },
      data: {
        ...updatePaymentDto,
        paymentDate: updatePaymentDto.paymentDate ? new Date(updatePaymentDto.paymentDate) : undefined,
      },
      include: {
        flat: true,
        recordedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string, user: User) {
    // Only ADMIN or TREASURER can delete payments
    if (!['ADMIN', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only admins or treasurers can delete payments');
    }

    const payment = await this.prisma.maintenancePayment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify access
    if (user.role !== 'ADMIN' && payment.societyId !== user.societyId) {
      throw new ForbiddenException('You can only delete payments for your own society');
    }

    return this.prisma.maintenancePayment.delete({
      where: { id },
    });
  }

  // Get defaulters (pending/overdue payments)
  async getDefaulters(societyId: string, month: number, year: number, user: User) {
    if (user.role !== 'ADMIN' && societyId !== user.societyId) {
      throw new ForbiddenException('You can only view defaulters for your own society');
    }

    return this.prisma.maintenancePayment.findMany({
      where: {
        societyId,
        month,
        year,
        status: {
          in: ['PENDING', 'OVERDUE'],
        },
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            block: true,
            ownerName: true,
            ownerPhone: true,
          },
        },
      },
      orderBy: {
        flat: {
          flatNumber: 'asc',
        },
      },
    });
  }

  // Bulk create payments for all flats in a society for a given month
  async bulkCreate(societyId: string, bulkPaymentDto: BulkPaymentDto, user: User) {
    if (!['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only committee members can create bulk payments');
    }

    if (user.role !== 'ADMIN' && societyId !== user.societyId) {
      throw new ForbiddenException('You can only create payments for your own society');
    }

    const { month, year, payments } = bulkPaymentDto;

    // Create payments in transaction
    const createdPayments = await this.prisma.$transaction(
      payments.map(payment =>
        this.prisma.maintenancePayment.upsert({
          where: {
            flatId_month_year: {
              flatId: payment.flatId,
              month,
              year,
            },
          },
          update: {
            amount: payment.amount,
          },
          create: {
            flatId: payment.flatId,
            societyId,
            month,
            year,
            amount: payment.amount,
            status: 'PENDING',
            recordedById: user.id,
          },
        })
      )
    );

    return createdPayments;
  }
}