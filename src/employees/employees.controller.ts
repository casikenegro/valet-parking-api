import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";

@Controller("employees")
@UseGuards(RolesGuard)
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateEmployeeDto, @CurrentUser() user: any) {
    return this.employeesService.create(dto, user.companyId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  getAll(@CurrentUser() user: any) {
    console.log('🔍 [EmployeesController.getAll] user:', { id: user?.id, companyId: user?.companyId });
    return this.employeesService.getAll(user?.companyId);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  delete(@Param("id") id: string, @Query("type") type: "VALET" | "ATTENDANT") {
    return this.employeesService.delete(id, type);
  }
}
