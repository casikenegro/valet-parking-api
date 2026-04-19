# Valet Parking API - Documentación del Proyecto

## 📋 Descripción General

API backend completa en NestJS con Prisma y PostgreSQL que proporciona todos los servicios necesarios para el sistema de valet parking [valet-parking-system](../valet-parking-system).

## 🎯 Objetivo

Reemplazar el sistema inseguro de localStorage del frontend Next.js con una API robusta que centraliza la lógica de negocio, implementa autenticación real con JWT, y permite operación multi-usuario.

## ✅ Estado del Proyecto

### Completado

- ✅ Setup completo de NestJS con TypeScript
- ✅ Configuración de Prisma con PostgreSQL
- ✅ Schema de base de datos con 6 modelos principales
- ✅ Sistema de autenticación JWT con Passport
- ✅ Sistema de roles (RBAC) con guards y decorators
- ✅ 6 módulos de dominio completamente implementados
- ✅ 27+ endpoints REST funcionales
- ✅ Validación automática con class-validator
- ✅ Manejo de errores global
- ✅ CORS configurado para Next.js
- ✅ Seed de datos iniciales
- ✅ Documentación completa en README.md
- ✅ Integración de OneSignal para push notifications

## 🏗️ Arquitectura

### Módulos Principales

1. **AuthModule** - Autenticación y autorización
2. **EmployeesModule** - Gestión de empleados/asistentes
3. **VehiclesModule** - Gestión de vehículos (módulo crítico)
4. **PaymentsModule** - Sistema de pagos
5. **SettingsModule** - Configuración del sistema
6. **ReportsModule** - Reportes y analytics

### Stack Tecnológico

- **Framework**: NestJS 10.x
- **ORM**: Prisma 7.x
- **Base de datos**: PostgreSQL 14+
- **Autenticación**: JWT con Passport
- **Validación**: class-validator
- **TypeScript**: 5.x
- **Push Notifications**: OneSignal (onesignal-node 3.4.0)

## 📲 Integración OneSignal

### Configuración

Añadir a `.env`:
```
ONESIGNAL_APP_ID="tu-app-id"
ONESIGNAL_API_KEY="tu-api-key"
```

### Utilidades

**Archivo**: `src/utils/onesignal.ts`

Función principal para enviar notificaciones:
```ts
export async function sendPushNotificationToDevices(
  playerIds: string[],
  title: string,
  message: string,
  data: any,
): Promise<void>
```

Uso:
```ts
import { sendPushNotificationToDevices } from '../utils/onesignal';

await sendPushNotificationToDevices(
  ['device-id-1', 'device-id-2'],
  'Título',
  'Mensaje',
  { customKey: 'valor' }
);
```

### Endpoints de Notificaciones

#### `PUT /users/update-notification-id`
**Descripción**: Actualiza el ID de notificación push del usuario autenticado (OneSignal subscription ID)

**Autenticación**: JWT (cualquier usuario autenticado)

**Request Body**:
```ts
{
  notificationID: string  // ID de suscripción de OneSignal
}
```

**Response**:
```ts
{
  id: string;
  email: string;
  name?: string;
  notificationId?: string;
  // ... otros campos del usuario
}
```

**Códigos de respuesta**:
- `200 OK`: ID actualizado correctamente
- `400 Bad Request`: ID de notificación inválido o vacío
- `401 Unauthorized`: Token JWT no válido o expirado
- `404 Not Found`: Usuario no encontrado

### Schema Prisma

Campo agregado al modelo `User`:
```prisma
notificationId    String?   @map("notification_id")
```

### Implementación en Servicios

Para enviar notificaciones desde cualquier servicio:

1. Inyectar `PrismaService`
2. Obtener `notificationId` del usuario
3. Llamar a `sendPushNotificationToDevices()`

**Ejemplo**:
```ts
const user = await this.prisma.user.findUnique({
  where: { id: userId },
  select: { notificationId: true }
});

if (user?.notificationId) {
  await sendPushNotificationToDevices(
    [user.notificationId],
    'Título',
    'Mensaje',
    {}
  );
}
```

## 🚀 Próximos Pasos

1. Configurar PostgreSQL: `createdb valet_parking`
2. Editar `.env` con credenciales de BD
3. Ejecutar migraciones: `npm run prisma:migrate`
4. Seed de datos: `npm run prisma:seed`
5. Iniciar servidor: `npm run start:dev`

Ver [README.md](./README.md) para instrucciones completas.
