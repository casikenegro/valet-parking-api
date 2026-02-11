import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentStatusDto } from "./dto/update-payment-status.dto";

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
        status: dto.validation === 'MANUAL' ? 'RECEIVED' : 'PENDING',
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

  async getAllPayments() {
    return this.prisma.payment.findMany({
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
      orderBy: {
        date: "desc",
      },
    });
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
