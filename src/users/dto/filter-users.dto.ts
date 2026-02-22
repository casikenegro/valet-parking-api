import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean } from "class-validator";
import { Type, Transform } from "class-transformer";
import { UserRole } from "@prisma/client";

export class FilterUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;
}
