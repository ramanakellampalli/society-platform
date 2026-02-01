import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SocietiesService } from './societies.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@repo/database';

@Controller('societies')
@UseGuards(JwtAuthGuard)
export class SocietiesController {
  constructor(private readonly societiesService: SocietiesService) {}

  // ========== SOCIETIES ==========

  @Post()
  createSociety(@Body() createSocietyDto: CreateSocietyDto, @CurrentUser() user: User) {
    return this.societiesService.createSociety(createSocietyDto, user);
  }

  @Get()
  findAllSocieties(@CurrentUser() user: User) {
    return this.societiesService.findAllSocieties(user);
  }

  @Get(':id')
  findOneSociety(@Param('id') id: string, @CurrentUser() user: User) {
    return this.societiesService.findOneSociety(id, user);
  }

  @Patch(':id')
  updateSociety(
    @Param('id') id: string,
    @Body() updateSocietyDto: UpdateSocietyDto,
    @CurrentUser() user: User,
  ) {
    return this.societiesService.updateSociety(id, updateSocietyDto, user);
  }

  @Delete(':id')
  removeSociety(@Param('id') id: string, @CurrentUser() user: User) {
    return this.societiesService.removeSociety(id, user);
  }

  // ========== FLATS ==========

  @Post('flats')
  createFlat(@Body() createFlatDto: CreateFlatDto, @CurrentUser() user: User) {
    return this.societiesService.createFlat(createFlatDto, user);
  }

  @Get(':societyId/flats')
  findAllFlats(@Param('societyId') societyId: string, @CurrentUser() user: User) {
    return this.societiesService.findAllFlats(societyId, user);
  }

  @Get('flats/:id')
  findOneFlat(@Param('id') id: string, @CurrentUser() user: User) {
    return this.societiesService.findOneFlat(id, user);
  }

  @Patch('flats/:id')
  updateFlat(
    @Param('id') id: string,
    @Body() updateFlatDto: UpdateFlatDto,
    @CurrentUser() user: User,
  ) {
    return this.societiesService.updateFlat(id, updateFlatDto, user);
  }

  @Delete('flats/:id')
  removeFlat(@Param('id') id: string, @CurrentUser() user: User) {
    return this.societiesService.removeFlat(id, user);
  }
}