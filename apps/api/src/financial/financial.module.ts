import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses/expenses.controller';
import { ExpensesService } from './expenses/expenses.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';

@Module({
  controllers: [ExpensesController, PaymentsController, ReportsController],
  providers: [ExpensesService, PaymentsService, ReportsService],
  exports: [ExpensesService, PaymentsService, ReportsService],
})
export class FinancialModule {}