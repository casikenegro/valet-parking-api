import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('reports')
@UseGuards(RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('revenue')
  @Roles(UserRole.ADMIN)
  getRevenueReport(
    @Query('period') period?: 'day' | 'week' | 'month' | 'custom',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getRevenueReport({ period, startDate, endDate });
  }

  @Get('vehicles')
  @Roles(UserRole.ADMIN)
  getVehiclesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getVehiclesReport({ startDate, endDate });
  }

  @Get('summary')
  @Roles(UserRole.ADMIN)
  getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }
}
