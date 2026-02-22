import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus, PlanType, ValidationType } from '@prisma/client';

export class CreateCompanyInvoiceDto {
  @IsNotEmpty()
  @IsString()
  companyPlanId: string;

  @IsNotEmpty()
  @IsNumber()
  amountUSD: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsEnum(ValidationType)
  validation: ValidationType;

  @IsNotEmpty()
  @IsEnum(PlanType)
  planType: PlanType;

  @IsOptional()
  @IsNumber()
  vehicleCount?: number;

  @IsOptional()
  @IsNumber()
  baseAmount?: number;

  @IsOptional()
  @IsNumber()
  vehicleAmount?: number;

  @IsOptional()
  @IsNumber()
  feeAmount?: number;

  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}