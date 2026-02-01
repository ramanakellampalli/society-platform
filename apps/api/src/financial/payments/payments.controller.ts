import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BulkPaymentDto } from './dto/bulk-payment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@repo/database';

@Controller('financial/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @CurrentUser() user: User) {
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Post('society/:societyId/bulk')
  bulkCreate(
    @Param('societyId') societyId: string,
    @Body() bulkPaymentDto: BulkPaymentDto,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.bulkCreate(societyId, bulkPaymentDto, user);
  }

  @Get('society/:societyId')
  findAll(
    @Param('societyId') societyId: string,
    @CurrentUser() user: User,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.findAll(
      societyId,
      user,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
      status,
    );
  }

  @Get('society/:societyId/defaulters')
  getDefaulters(
    @Param('societyId') societyId: string,
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.getDefaulters(societyId, parseInt(month), parseInt(year), user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.paymentsService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto, @CurrentUser() user: User) {
    return this.paymentsService.update(id, updatePaymentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.paymentsService.remove(id, user);
  }
}