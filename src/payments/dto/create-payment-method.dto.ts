import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethodType } from "@prisma/client";

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  form: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;
}
