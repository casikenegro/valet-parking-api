import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueReport(options: {
    period?: 'day' | 'week' | 'month' | 'custom';
    startDate?: string;
    endDate?: string;
  }) {
    const { period = 'week', startDate, endDate } = options;

    let start: Date;
    let end: Date = new Date();

    if (period === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else if (period === 'day') {
      start = new Date();
      start.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      start = new Date();
      start.setDate(start.getDate() - 7);
    } else if (period === 'month') {
      start = new Date();
      start.setDate(start.getDate() - 30);
    } else {
      start = new Date();
      start.setDate(start.getDate() - 7);
    }

    const payments = await this.prisma.payment.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        status: 'RECEIVED',
      },
      select: {
        amountUSD: true,
        tip: true,
        date: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const totalRevenue = payments.reduce(
      (sum, p) => sum + p.amountUSD + p.tip,
      0,
    );

    return {
      period,
      startDate: start,
      endDate: end,
      totalRevenue,
      totalPayments: payments.length,
      data: payments,
    };
  }

  async getVehiclesReport(options: { startDate?: string; endDate?: string }) {
    const { startDate, endDate } = options;

    let whereClause: any = {};

    if (startDate && endDate) {
      whereClause.checkInAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [totalRecords, activeRecords, checkedOutRecords] =
      await Promise.all([
        this.prisma.parkingRecord.count({ where: whereClause }),
        this.prisma.parkingRecord.count({
          where: { ...whereClause, checkOutAt: null },
        }),
        this.prisma.parkingRecord.count({
          where: { ...whereClause, checkOutAt: { not: null } },
        }),
      ]);

    return {
      totalVehicles: totalRecords,
      activeVehicles: activeRecords,
      checkedOutVehicles: checkedOutRecords,
    };
  }

  async getDashboardSummary() {
    const [
      activeVehicles,
      totalVehiclesToday,
      todayRevenue,
      totalEmployees,
    ] = await Promise.all([
      // Registros activos
      this.prisma.parkingRecord.count({
        where: { checkOutAt: null },
      }),

      // Registros creados hoy
      this.prisma.parkingRecord.count({
        where: {
          checkInAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Ingresos de hoy
      this.prisma.payment.aggregate({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          status: 'RECEIVED',
        },
        _sum: {
          amountUSD: true,
          tip: true,
        },
      }),

      // Total de attendants activos
      this.prisma.user.count({
        where: {
          role: 'ATTENDANT',
          isActive: true
        },
      }),
    ]);

    return {
      activeVehicles,
      totalVehiclesToday,
      todayRevenue:
        (todayRevenue._sum.amountUSD || 0) + (todayRevenue._sum.tip || 0),
      totalAttendants: totalEmployees,
    };
  }
}
