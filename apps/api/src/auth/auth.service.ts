import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { userToDto } from './auth.utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: registerDto.phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Check if society exists
    const society = await this.prisma.society.findUnique({
      where: { id: registerDto.societyId },
    });

    if (!society) {
      throw new BadRequestException('Society not found');
    }

    // If flatId provided, verify it exists and belongs to society
    if (registerDto.flatId) {
      const flat = await this.prisma.flat.findFirst({
        where: {
          id: registerDto.flatId,
          societyId: registerDto.societyId,
        },
      });

      if (!flat) {
        throw new BadRequestException('Flat not found or does not belong to this society');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        phone: registerDto.phone,
        name: registerDto.name,
        email: registerDto.email,
        passwordHash: hashedPassword,
        role: registerDto.role,
        societyId: registerDto.societyId,
        flatId: registerDto.flatId,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.role);

    return {
      accessToken: token,
      user: userToDto(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Find user by phone
    const user = await this.prisma.user.findUnique({
      where: { phone: loginDto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password - handle null passwordHash
    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.role);

    return {
      accessToken: token,
      user: userToDto(user),
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  private generateToken(userId: string, role: string): string {
    const payload = { sub: userId, role };
    return this.jwtService.sign(payload);
  }
}