import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentStatusDto } from "./dto/update-payment-status.dto";
import { FilterPaymentDto } from "./dto/filter-payment.dto";
import { PaymentStatus, Prisma } from "@prisma/client";

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(dto: CreatePaymentDto, userId: string) {
    const payment = await this.prisma.payment.create({
      data: {
        parkingRecordId: dto.parkingRecordId,
        paymentMethodId: dto.paymentMethodId,
        amountUSD: dto.amountUSD,
        tip: dto.tip || 0,
        fee: dto.fee,
        validation: dto.validation,
        status: dto.validation === "MANUAL" ? "RECEIVED" : "PENDING",
        reference: dto.reference,
        note: dto.note,
        processedById: userId,
      },
      include: {
        parkingRecord: true,
        paymentMethod: true,
        processedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return payment;
  }

  async getAllPayments(options: FilterPaymentDto, companyIds: string[] = []) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {};

    if (options.companyId != null) {
      where.parkingRecord = {
        companyId: options.companyId,
      };
    } else {
      where.parkingRecord = {
        companyId: { in: companyIds },
      };
    }

    if (options.status != null) {
      where.status = options.status;
    }
    if (options.paymentMethodId != null) {
      where.paymentMethodId = options.paymentMethodId;
    }
    if (options.reference) {
      where.reference = { contains: options.reference, mode: "insensitive" };
    }
    // Date range filter on checkInAt
    if (options.dateFrom || options.dateTo) {
      where.createdAt = {};
      if (options.dateFrom) {
        (where.createdAt as Prisma.DateTimeFilter).gte = new Date(
          options.dateFrom,
        );
      }
      if (options.dateTo) {
        const endDate = new Date(options.dateTo);
        endDate.setHours(23, 59, 59, 999);
        (where.createdAt as Prisma.DateTimeFilter).lte = endDate;
      }
    }

    // Global search across plate, brand, model
    if (options.search) {
      where.OR = [
        { reference: { contains: options.search, mode: "insensitive" } },
      ];
    }

    // Build dynamic orderBy
    const sortOrder = options.sortOrder || "desc";
    let orderBy: Prisma.PaymentOrderByWithRelationInput;
    if (options.sortBy === "amountUSD") {
      orderBy = { amountUSD: sortOrder };
    } else if (options.sortBy === "paymentMethod") {
      orderBy = { paymentMethod: { name: sortOrder } };
    } else {
      orderBy = { createdAt: sortOrder };
    }

    const [
      paymentRecords,
      cancelledCount,
      pendingCount,
      completedCount,
      total,
    ] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          parkingRecord: true,
          paymentMethod: true,
        },
        orderBy,
      }),
      this.prisma.payment.aggregate({
        where: {
          ...where,
          status: PaymentStatus.CANCELLED,
        },
        _count: { id: true },
        _sum: { amountUSD: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          ...where,
          status: PaymentStatus.PENDING,
        },
        _count: { id: true },
        _sum: { amountUSD: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          ...where,
          status: PaymentStatus.RECEIVED,
        },
        _count: { id: true },
        _sum: { amountUSD: true },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: paymentRecords,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        cancelled: cancelledCount._count.id,
        cancelledAmountUSD: cancelledCount._sum.amountUSD ?? 0,
        pending: pendingCount._count.id,
        pendingAmountUSD: pendingCount._sum.amountUSD ?? 0,
        completed: completedCount._count.id,
        completedAmountUSD: completedCount._sum.amountUSD ?? 0,
        all: total,
      },
    };
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    return this.prisma.payment.update({
      where: { id },
      data: { status: dto.status },
      include: {
        parkingRecord: true,
        paymentMethod: true,
      },
    });
  }

  async createPaymentMethod(dto: CreatePaymentMethodDto) {
    return this.prisma.paymentMethod.create({
      data: {
        name: dto.name,
        form: dto.form,
        type: dto.type,
      },
    });
  }

  async getPaymentMethods() {
    return this.prisma.paymentMethod.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
