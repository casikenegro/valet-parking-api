import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MinLength,
} from "class-validator";
import { UserRole } from "@prisma/client";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum([UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT])
  role: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsArray()
  @IsString({ each: true })
  companyIds: string[];
}
