import { Module } from "@nestjs/common";
import { VehiclesController } from "./vehicles.controller";
import { VehiclesService } from "./vehicles.service";
import { EmailService } from "src/email/email.service";

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, EmailService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
