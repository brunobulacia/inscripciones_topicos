import { PartialType } from '@nestjs/mapped-types';
import { CreateEndpointDto } from './create-endpoint.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEndpointDto extends PartialType(CreateEndpointDto) {
  @IsBoolean()
  @IsOptional()
  estaActivo?: boolean;
}