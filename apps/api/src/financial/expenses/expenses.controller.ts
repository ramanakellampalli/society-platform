import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@repo/database';

@Controller('financial/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @CurrentUser() user: User) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Get('society/:societyId')
  findAll(
    @Param('societyId') societyId: string,
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.findAll(societyId, user, startDate, endDate);
  }

  @Get('society/:societyId/category/:categoryId')
  getByCategory(
    @Param('societyId') societyId: string,
    @Param('categoryId') categoryId: string,
    @CurrentUser() user: User,
  ) {
    return this.expensesService.getByCategory(societyId, categoryId, user);
  }

  @Get('society/:societyId/categories')
  getCategories(@Param('societyId') societyId: string, @CurrentUser() user: User) {
    return this.expensesService.ensureDefaultCategories(societyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expensesService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto, @CurrentUser() user: User) {
    return this.expensesService.update(id, updateExpenseDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expensesService.remove(id, user);
  }
}