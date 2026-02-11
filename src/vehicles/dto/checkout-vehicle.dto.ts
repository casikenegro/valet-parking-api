import { IsOptional, IsString } from "class-validator";

export class CheckoutVehicleDto {
  @IsOptional()
  checkOutAt?: Date;

  @IsString()
  checkOutValet: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
