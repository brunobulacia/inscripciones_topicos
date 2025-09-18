import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsOptional()
  data?: any;

  @IsObject()
  @IsOptional()
  opts?: any;
}