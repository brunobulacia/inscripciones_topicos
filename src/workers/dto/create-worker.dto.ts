import { IsString, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @Min(1)
  concurrencia: number;

  @IsUUID()
  @IsNotEmpty()
  colaId: string;
}