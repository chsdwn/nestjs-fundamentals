import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) // not need with transformOptions.enableImplicitConversion
  limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  offset: number;
}
