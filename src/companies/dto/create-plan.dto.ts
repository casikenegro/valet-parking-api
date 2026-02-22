import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from "class-validator";
import { PlanType, FeeType } from "@prisma/client";

export class CreatePlanDto {
  @IsNotEmpty()
  @IsEnum(PlanType)
  planType: PlanType;

  @IsOptional()
  @IsNumber()
  flatRate?: number;

  @IsOptional()
  @IsNumber()
  perVehicleRate?: number;

  @IsOptional()
  @IsEnum(FeeType)
  feeType?: FeeType;

  @IsOptional()
  @IsNumber()
  feeValue?: number;

  @IsOptional()
  @IsNumber()
  basePrice?: number;
}
