import {
  PrismaClient,
  UserRole,
  BillingType,
  PaymentMethodType,
  PaymentStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Crear usuario admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@valetparking.com" },
    update: {},
    create: {
      email: "admin@valetparking.com",
      password: adminPassword,
      name: "Admin User",
      role: UserRole.ADMIN,
      idNumber: "V-00000001",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Crear usuario attendant
  const attendantPassword = await bcrypt.hash("attendant123", 10);
  const attendant = await prisma.user.upsert({
    where: { email: "attendant@valetparking.com" },
    update: {},
    create: {
      email: "attendant@valetparking.com",
      password: attendantPassword,
      name: "Attendant User",
      role: UserRole.ATTENDANT,
      idNumber: "V-98765432",
    },
  });

  console.log("✅ Attendant user created:", attendant.email);

  // Crear usuario client
  const clientPassword = await bcrypt.hash("client123", 10);
  const client = await prisma.user.upsert({
    where: { email: "client@valetparking.com" },
    update: {},
    create: {
      email: "client@valetparking.com",
      password: clientPassword,
      name: "Juan Pérez",
      role: UserRole.CLIENT,
      phone: "+1234567890",
      idNumber: "V-12345678",
    },
  });

  console.log("✅ Client user created:", client.email);

  // Crear segundo client
  const client2Password = await bcrypt.hash("client456", 10);
  const client2 = await prisma.user.upsert({
    where: { email: "maria@valetparking.com" },
    update: {},
    create: {
      email: "maria@valetparking.com",
      password: client2Password,
      name: "María García",
      role: UserRole.CLIENT,
      phone: "+1234567891",
      idNumber: "V-87654321",
    },
  });

  console.log("✅ Client 2 created:", client2.email);

  // Crear vehículos
  const vehicle1 = await prisma.vehicle.upsert({
    where: { plate: "ABC123" },
    update: {},
    create: {
      plate: "ABC123",
      brand: "Toyota",
      model: "Corolla",
      color: "Blanco",
      ownerId: client.id,
    },
  });

  const vehicle2 = await prisma.vehicle.upsert({
    where: { plate: "XYZ789" },
    update: {},
    create: {
      plate: "XYZ789",
      brand: "Honda",
      model: "Civic",
      color: "Negro",
      ownerId: client.id,
    },
  });

  const vehicle3 = await prisma.vehicle.upsert({
    where: { plate: "DEF456" },
    update: {},
    create: {
      plate: "DEF456",
      brand: "Ford",
      model: "Explorer",
      color: "Azul",
      ownerId: client2.id,
    },
  });

  const vehicle4 = await prisma.vehicle.upsert({
    where: { plate: "GHI321" },
    update: {},
    create: {
      plate: "GHI321",
      brand: "Chevrolet",
      model: "Spark",
      color: "Rojo",
      ownerId: client2.id,
    },
  });

  console.log(
    "✅ Vehicles created:",
    [vehicle1.plate, vehicle2.plate, vehicle3.plate, vehicle4.plate].join(", "),
  );

  // Crear company
  const company = await prisma.company.upsert({
    where: { id: "default-company" },
    update: {},
    create: {
      id: "default-company",
      name: "Valet Parking Corp",
    },
  });

  console.log("✅ Company created:", company.name);

  // Crear valets
  const valet1 = await prisma.valet.upsert({
    where: { id: "valet-carlos" },
    update: {},
    create: {
      id: "valet-carlos",
      name: "Carlos Rodríguez",
      idNumber: "V-11223344",
      companyId: company.id,
    },
  });

  const valet2 = await prisma.valet.upsert({
    where: { id: "valet-pedro" },
    update: {},
    create: {
      id: "valet-pedro",
      name: "Pedro Martínez",
      idNumber: "V-55667788",
      companyId: company.id,
    },
  });

  const valet3 = await prisma.valet.upsert({
    where: { id: "valet-luis" },
    update: {},
    create: {
      id: "valet-luis",
      name: "Luis Hernández",
      idNumber: "V-99001122",
      companyId: company.id,
    },
  });

  console.log(
    "✅ Valets created:",
    [valet1.name, valet2.name, valet3.name].join(", "),
  );

  // Crear métodos de pago
  const paymentMethods = [
    { id: "pm-cash", form: "Efectivo USD", type: PaymentMethodType.CASH },
    { id: "pm-zelle", form: "Zelle", type: PaymentMethodType.ZELLE },
    {
      id: "pm-mobile",
      form: "Pago Móvil",
      type: PaymentMethodType.MOBILE_PAYMENT,
    },
    { id: "pm-binance", form: "Binance Pay", type: PaymentMethodType.BINANCE },
    {
      id: "pm-card",
      form: "Tarjeta de Débito/Crédito",
      type: PaymentMethodType.CARD,
    },
  ];

  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { id: pm.id },
      update: {},
      create: {
        id: pm.id,
        name: pm.form,
        form: pm.form,
        type: pm.type,
        companyId: company.id,
      },
    });
  }

  console.log("✅ Payment methods created:", paymentMethods.length);

  // Crear settings iniciales
  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      billingType: BillingType.HOURLY,
      rate: 3.0,
      tipEnabled: true,
    },
  });

  console.log("✅ Settings created:", settings);

  // Crear parking records de ejemplo
  const now = new Date();

  // Parking record 1: Activo (sin checkout), registrado por admin, valet entrada Carlos
  const pr1 = await prisma.parkingRecord.create({
    data: {
      plate: vehicle1.plate,
      brand: vehicle1.brand,
      model: vehicle1.model,
      color: vehicle1.color,
      ownerId: client.id,
      registerRecordId: admin.id,
      checkInValetId: valet1.id,
      checkInAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // hace 2 horas
    },
  });

  // Parking record 2: Activo, registrado por attendant, valet entrada Pedro
  const pr2 = await prisma.parkingRecord.create({
    data: {
      plate: vehicle3.plate,
      brand: vehicle3.brand,
      model: vehicle3.model,
      color: vehicle3.color,
      ownerId: client2.id,
      registerRecordId: attendant.id,
      checkInValetId: valet2.id,
      checkInAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // hace 1 hora
    },
  });

  // Parking record 3: Completado (con checkout), registrado por admin, valet entrada Luis, valet salida Carlos
  const pr3 = await prisma.parkingRecord.create({
    data: {
      plate: vehicle4.plate,
      brand: vehicle4.brand,
      model: vehicle4.model,
      color: vehicle4.color,
      ownerId: client2.id,
      registerRecordId: admin.id,
      checkInValetId: valet3.id,
      checkOutValetId: valet1.id,
      checkInAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // hace 5 horas
      checkOutAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // salió hace 3 horas
    },
  });

  // Parking record 4: Completado con pago, registrado por attendant, valet entrada Pedro, valet salida Luis
  const pr4 = await prisma.parkingRecord.create({
    data: {
      plate: "JKL654",
      brand: "Hyundai",
      model: "Tucson",
      color: "Gris",
      registerRecordId: attendant.id,
      checkInValetId: valet2.id,
      checkOutValetId: valet3.id,
      checkInAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      checkOutAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
  });

  // Crear pago para pr3
  await prisma.payment.create({
    data: {
      parkingRecordId: pr3.id,
      amountUSD: 9.0,
      tip: 1.0,
      status: PaymentStatus.RECEIVED,
      fee: "3.00/hr",
      validation: "MANUAL",
      paymentMethodId: "pm-zelle",
      processedById: admin.id,
    },
  });

  // Crear pago para pr4
  await prisma.payment.create({
    data: {
      parkingRecordId: pr4.id,
      amountUSD: 6.0,
      tip: 0,
      status: PaymentStatus.RECEIVED,
      fee: "3.00/hr",
      validation: "MANUAL",
      paymentMethodId: "pm-cash",
      processedById: attendant.id,
    },
  });

  // Parking record 5: Activo, sin valet asignado (registro directo por admin)
  await prisma.parkingRecord.create({
    data: {
      plate: vehicle2.plate,
      brand: vehicle2.brand,
      model: vehicle2.model,
      color: vehicle2.color,
      ownerId: client.id,
      registerRecordId: admin.id,
      checkInValetId: valet1.id,
      checkInAt: new Date(now.getTime() - 30 * 60 * 1000), // hace 30 min
    },
  });

  console.log(
    "✅ Parking records created:",
    [pr1.id, pr2.id, pr3.id, pr4.id].map((id) => id.slice(-7)).join(", "),
  );

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
