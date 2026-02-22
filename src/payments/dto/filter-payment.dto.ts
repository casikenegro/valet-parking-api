import { IsOptional, IsString, IsNumber, IsIn, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { PaymentStatus } from "@prisma/client";

export class FilterPaymentDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  @IsIn(["createdAt", "amountUSD", "paymentMethod"])
  sortBy?: "createdAt" | "amountUSD" | "paymentMethod";

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc";
}
