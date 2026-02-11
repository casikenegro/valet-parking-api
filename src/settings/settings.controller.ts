import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('settings')
@UseGuards(RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ATTENDANT)
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch('billing')
  @Roles(UserRole.ADMIN)
  updateBilling(@Body() dto: UpdateBillingDto) {
    return this.settingsService.updateBilling(dto);
  }

  @Patch('tip')
  @Roles(UserRole.ADMIN)
  updateTipEnabled(@Body('enabled') enabled: boolean) {
    return this.settingsService.updateTipEnabled(enabled);
  }
}
