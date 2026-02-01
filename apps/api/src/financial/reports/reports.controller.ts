import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@repo/database';

@Controller('financial/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('society/:societyId/summary')
  getFinancialSummary(
    @Param('societyId') societyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.getFinancialSummary(societyId, startDate, endDate, user);
  }

  @Get('society/:societyId/monthly')
  getMonthlyReport(
    @Param('societyId') societyId: string,
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.getMonthlyReport(societyId, parseInt(month), parseInt(year), user);
  }

  @Get('society/:societyId/ytd')
  getYearToDate(
    @Param('societyId') societyId: string,
    @Query('year') year: string,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.getYearToDateSummary(societyId, parseInt(year), user);
  }

  @Get('society/:societyId/trends')
  getCollectionTrends(@Param('societyId') societyId: string, @CurrentUser() user: User) {
    return this.reportsService.getCollectionTrends(societyId, user);
  }
}