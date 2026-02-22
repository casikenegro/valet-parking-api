import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterCompaniesDto } from "./dto/filter-companies.dto";
import { Prisma } from "@prisma/client";
import { UpdateStatusCompanyInvoiceDto } from "./dto/update-status-company-invoice.dto";

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}
  create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: createCompanyDto.name,
        photoUrl: createCompanyDto.photoUrl,

        companyUsers: {
          create: createCompanyDto.userIds.map((id) => ({
            user: {
              connect: { id },
            },
          })),
        },
      },
      include: {
        companyUsers: true,
      },
    });
  }

  async getAll(options: FilterCompaniesDto, companyIds: string[] = []) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = {
      deletedAt: null,
    };
    if (companyIds.length > 0) {
      where.id = { in: companyIds };
    }
    if (options.name) {
      where.name = { contains: options.name, mode: "insensitive" };
    }
    if (options.isActive) {
      where.isActive = options.isActive;
    }

    if (options.search) {
      where.OR = [{ name: { contains: options.search, mode: "insensitive" } }];
    }

    const [companyRecords, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          plans: {
            include: {
              companyInvoices: true,
            },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data: companyRecords,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prisma.company.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        plans: {
          include: {
            companyInvoices: true,
          },
        },
        companyUsers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    const { userIds, ...rest } = updateCompanyDto;

    return this.prisma.company.update({
      where: { id },
      data: {
        ...rest,
        ...(userIds
          ? {
              companyUsers: {
                deleteMany: {},
                create: userIds.map((userId) => ({
                  user: { connect: { id: userId } },
                })),
              },
            }
          : {}),
      },
      include: {
        companyUsers: {
          include: { user: true },
        },
        plans: {
          include: {
            companyInvoices: true,
          },
        },
      },
    });
  }

  async createPlan(companyId: string, dto: CreatePlanDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException("Company not found");

    // Deactivate current active plan
    await this.prisma.companyPlan.updateMany({
      where: { companyId, isActive: true },
      data: { isActive: false },
    });

    return this.prisma.companyPlan.create({
      data: {
        companyId,
        planType: dto.planType,
        flatRate: dto.flatRate,
        perVehicleRate: dto.perVehicleRate,
        feeType: dto.feeType,
        feeValue: dto.feeValue,
        basePrice: dto.basePrice,
      },
    });
  }

  async updatePlan(companyId: string, planId: string, dto: UpdatePlanDto) {
    const plan = await this.prisma.companyPlan.findFirst({
      where: { id: planId, companyId },
    });
    if (!plan) throw new NotFoundException("Plan not found");

    return this.prisma.companyPlan.update({
      where: { id: planId },
      data: dto,
    });
  }

  async updateStatusInvoice(
    planId: string,
    invoiceId: string,
    dto: UpdateStatusCompanyInvoiceDto,
  ) {
    const plan = await this.prisma.companyInvoice.findFirst({
      where: { id: invoiceId, companyPlanId: planId },
    });
    if (!plan) throw new NotFoundException("Plan not found");

    return this.prisma.companyInvoice.update({
      where: { id: invoiceId },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.company.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }
}
