import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name;
  @IsOptional()
  @IsString()
  photoUrl;

  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
