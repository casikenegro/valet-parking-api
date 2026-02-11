import { IsString, IsEnum, IsOptional, IsEmail } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsString()
  idNumber: string;

  @IsEnum(['VALET', 'ATTENDANT'])
  type: 'VALET' | 'ATTENDANT';

  @IsOptional()
  @IsEmail()
  email?: string;
}
