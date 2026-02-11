import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.settings.findUnique({
      where: { id: 'default' },
    });

    // Si no existe, crear settings por defecto
    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {
          id: 'default',
        },
      });
    }

    return settings;
  }

  async updateBilling(dto: UpdateBillingDto) {
    return this.prisma.settings.upsert({
      where: { id: 'default' },
      update: dto,
      create: {
        id: 'default',
        ...dto,
      },
    });
  }

  async updateTipEnabled(enabled: boolean) {
    return this.prisma.settings.upsert({
      where: { id: 'default' },
      update: { tipEnabled: enabled },
      create: {
        id: 'default',
        tipEnabled: enabled,
      },
    });
  }
}
