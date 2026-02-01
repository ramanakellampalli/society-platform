import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import type { User } from '@repo/database';

@Injectable()
export class SocietiesService {
  constructor(private prisma: PrismaService) {}

  // ========== SOCIETIES ==========

  async createSociety(createSocietyDto: CreateSocietyDto, user: User) {
    // Only ADMIN can create societies
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create societies');
    }

    return this.prisma.society.create({
      data: createSocietyDto,
    });
  }

  async findAllSocieties(user: User) {
    // ADMIN can see all societies
    if (user.role === 'ADMIN') {
      return this.prisma.society.findMany({
        include: {
          _count: {
            select: {
              flats: true,
              users: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Others can only see their own society
    return this.prisma.society.findMany({
      where: { id: user.societyId },
      include: {
        _count: {
          select: {
            flats: true,
            users: true,
          },
        },
      },
    });
  }

  async findOneSociety(id: string, user: User) {
    const society = await this.prisma.society.findUnique({
      where: { id },
      include: {
        flats: {
          orderBy: { flatNumber: 'asc' },
        },
        _count: {
          select: {
            users: true,
            expenses: true,
            maintenancePayments: true,
          },
        },
      },
    });

    if (!society) {
      throw new NotFoundException('Society not found');
    }

    // Users can only view their own society (unless ADMIN)
    if (user.role !== 'ADMIN' && society.id !== user.societyId) {
      throw new ForbiddenException('You can only view your own society');
    }

    return society;
  }

  async updateSociety(id: string, updateSocietyDto: UpdateSocietyDto, user: User) {
    // Only ADMIN or COMMITTEE can update
    if (user.role !== 'ADMIN' && user.role !== 'COMMITTEE' && user.role !== 'TREASURER') {
      throw new ForbiddenException('Only admins or committee members can update society');
    }

    const society = await this.prisma.society.findUnique({ where: { id } });

    if (!society) {
      throw new NotFoundException('Society not found');
    }

    // Non-admins can only update their own society
    if (user.role !== 'ADMIN' && society.id !== user.societyId) {
      throw new ForbiddenException('You can only update your own society');
    }

    return this.prisma.society.update({
      where: { id },
      data: updateSocietyDto,
    });
  }

  async removeSociety(id: string, user: User) {
    // Only ADMIN can delete societies
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete societies');
    }

    const society = await this.prisma.society.findUnique({ where: { id } });

    if (!society) {
      throw new NotFoundException('Society not found');
    }

    return this.prisma.society.delete({ where: { id } });
  }

  // ========== FLATS ==========

  async createFlat(createFlatDto: CreateFlatDto, user: User) {
    // Only ADMIN, COMMITTEE, or TREASURER can create flats
    if (!['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only admins or committee members can create flats');
    }

    // Verify society exists
    const society = await this.prisma.society.findUnique({
      where: { id: createFlatDto.societyId },
    });

    if (!society) {
      throw new BadRequestException('Society not found');
    }

    // Non-admins can only create flats in their own society
    if (user.role !== 'ADMIN' && createFlatDto.societyId !== user.societyId) {
      throw new ForbiddenException('You can only create flats in your own society');
    }

    // Check if flat already exists
    const existingFlat = await this.prisma.flat.findFirst({
      where: {
        societyId: createFlatDto.societyId,
        flatNumber: createFlatDto.flatNumber,
        block: createFlatDto.block || null,
      },
    });

    if (existingFlat) {
      throw new BadRequestException('Flat with this number already exists in this block');
    }

    return this.prisma.flat.create({
      data: createFlatDto,
      include: {
        society: true,
      },
    });
  }

  async findAllFlats(societyId: string, user: User) {
    // Verify society exists
    const society = await this.prisma.society.findUnique({ where: { id: societyId } });

    if (!society) {
      throw new NotFoundException('Society not found');
    }

    // Non-admins can only view flats in their own society
    if (user.role !== 'ADMIN' && societyId !== user.societyId) {
      throw new ForbiddenException('You can only view flats in your own society');
    }

    return this.prisma.flat.findMany({
      where: { societyId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
        _count: {
          select: {
            maintenancePayments: true,
          },
        },
      },
      orderBy: [{ block: 'asc' }, { flatNumber: 'asc' }],
    });
  }

  async findOneFlat(id: string, user: User) {
    const flat = await this.prisma.flat.findUnique({
      where: { id },
      include: {
        society: true,
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
          },
        },
        maintenancePayments: {
          orderBy: { year: 'desc' },
          take: 12, // Last 12 months
        },
      },
    });

    if (!flat) {
      throw new NotFoundException('Flat not found');
    }

    // Non-admins can only view flats in their own society
    if (user.role !== 'ADMIN' && flat.societyId !== user.societyId) {
      throw new ForbiddenException('You can only view flats in your own society');
    }

    return flat;
  }

  async updateFlat(id: string, updateFlatDto: UpdateFlatDto, user: User) {
    // Only ADMIN, COMMITTEE, or TREASURER can update flats
    if (!['ADMIN', 'COMMITTEE', 'TREASURER'].includes(user.role)) {
      throw new ForbiddenException('Only admins or committee members can update flats');
    }

    const flat = await this.prisma.flat.findUnique({ where: { id } });

    if (!flat) {
      throw new NotFoundException('Flat not found');
    }

    // Non-admins can only update flats in their own society
    if (user.role !== 'ADMIN' && flat.societyId !== user.societyId) {
      throw new ForbiddenException('You can only update flats in your own society');
    }

    return this.prisma.flat.update({
      where: { id },
      data: updateFlatDto,
      include: {
        society: true,
      },
    });
  }

  async removeFlat(id: string, user: User) {
    // Only ADMIN or COMMITTEE can delete flats
    if (!['ADMIN', 'COMMITTEE'].includes(user.role)) {
      throw new ForbiddenException('Only admins or committee members can delete flats');
    }

    const flat = await this.prisma.flat.findUnique({ where: { id } });

    if (!flat) {
      throw new NotFoundException('Flat not found');
    }

    // Non-admins can only delete flats in their own society
    if (user.role !== 'ADMIN' && flat.societyId !== user.societyId) {
      throw new ForbiddenException('You can only delete flats in your own society');
    }

    return this.prisma.flat.delete({ where: { id } });
  }
}