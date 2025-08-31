import { IsOptional, IsNumberString, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 0;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;
}
