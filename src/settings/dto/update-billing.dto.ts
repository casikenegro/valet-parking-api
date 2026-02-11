import { IsEnum, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { BillingType } from '@prisma/client';

export class UpdateBillingDto {
  @IsOptional()
  @IsEnum(BillingType)
  billingType?: BillingType;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsBoolean()
  tipEnabled?: boolean;
}
