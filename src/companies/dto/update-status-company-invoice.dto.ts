import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";
import { CreateCompanyInvoiceDto } from "./create-company-invoice.dto";
import { PaymentStatus } from "@prisma/client";

export class UpdateStatusCompanyInvoiceDto extends PartialType(
  CreateCompanyInvoiceDto,
) {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
