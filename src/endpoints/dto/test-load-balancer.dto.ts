import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class TestLoadBalancerDto {
  @IsString()
  @IsNotEmpty()
  ruta: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  metodo: string;

  @IsString()
  @IsOptional()
  @IsIn(['least-loaded', 'round-robin'])
  strategy?: 'least-loaded' | 'round-robin' = 'least-loaded';
}
