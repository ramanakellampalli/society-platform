import { PartialType } from '@nestjs/mapped-types';
import { CreateFlatDto } from './create-flat.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateFlatDto extends PartialType(
  OmitType(CreateFlatDto, ['societyId'] as const)
) {}