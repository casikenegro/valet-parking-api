# Valet Parking API

API backend completa en NestJS con Prisma y PostgreSQL para el sistema de valet parking.

## 🚀 Características

- ✅ Autenticación JWT con roles (Admin, Attendant)
- ✅ Gestión de empleados
- ✅ Registro de vehículos (manual y por QR)
- ✅ Sistema de pagos con múltiples métodos
- ✅ Reportes y analytics
- ✅ Configuración de facturación
- ✅ Guards y decorators personalizados
- ✅ Validación automática con class-validator
- ✅ CORS configurado para Next.js frontend

## 📋 Pre-requisitos

- Node.js 18.x o superior
- PostgreSQL 14+ corriendo
- npm o pnpm

## 🔧 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/valet_parking?schema=public"
JWT_SECRET="1ca31609cc4c5a314c17e83a1e9cc5a7164dcbbc5d36b89f1332dd1ab244bf9b"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

3. **Crear base de datos:**
```bash
createdb valet_parking
```

4. **Generar Prisma Client:**
```bash
npm run prisma:generate
```

5. **Ejecutar migraciones:**
```bash
npm run prisma:migrate
```

6. **Seed de datos iniciales:**
```bash
npm run prisma:seed
```

Esto creará tres usuarios de prueba:
- **Admin**: `admin@valetparking.com` / `admin123`
- **Attendant**: `attendant@valetparking.com` / `attendant123`
- **Client**: `client@valetparking.com` / `client123`

## 🏃 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Prisma Studio (UI visual de BD)
```bash
npm run prisma:studio
```

La API estará disponible en: `http://localhost:3001/api`

## 📚 Endpoints

### Autenticación
- `POST /api/auth/login` - Login (público)
- `POST /api/auth/register` - Registro (público)
- `GET /api/auth/me` - Perfil del usuario autenticado

### Vehículos
- `POST /api/vehicles/register` - Registro manual (Admin, Attendant)
- `POST /api/vehicles/register/qr` - Registro por QR (Admin, Attendant)
- `PATCH /api/vehicles/:id/checkout` - Marcar salida (Admin, Attendant)
- `GET /api/vehicles/search?idNumber={cedula}` - Buscar por empleado (Admin, Attendant)
- `GET /api/vehicles/active` - Vehículos activos (Admin, Attendant)
- `GET /api/vehicles/:id` - Obtener vehículo (Admin, Attendant)
- `GET /api/vehicles` - Listar todos (Admin, paginado)

### Empleados
- `POST /api/employees` - Crear empleado (Admin)
- `GET /api/employees` - Listar empleados (Admin, Attendant)
- `GET /api/employees/:id` - Obtener empleado (Admin)
- `PATCH /api/employees/:id` - Actualizar empleado (Admin)
- `DELETE /api/employees/:id` - Eliminar empleado (Admin, soft delete)

### Pagos
- `POST /api/payments` - Registrar pago (Admin, Attendant)
- `GET /api/payments` - Listar pagos (Admin)
- `PATCH /api/payments/:id/status` - Actualizar estado (Admin)
- `POST /api/payments/methods` - Crear método de pago (Admin)
- `GET /api/payments/methods` - Listar métodos (Admin, Attendant)

### Configuración
- `GET /api/settings` - Obtener configuración (Admin, Attendant)
- `PATCH /api/settings/billing` - Actualizar facturación (Admin)
- `PATCH /api/settings/tip` - Habilitar/deshabilitar propinas (Admin)

### Reportes
- `GET /api/reports/revenue?period=week` - Reporte de ingresos (Admin)
- `GET /api/reports/vehicles` - Reporte de vehículos (Admin)
- `GET /api/reports/summary` - Dashboard summary (Admin)

## 🧪 Pruebas

### Login como Admin
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@valetparking.com","password":"admin123"}'
```

### Registrar vehículo
```bash
curl -X POST http://localhost:3001/api/vehicles/register \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "plate": "ABC-123",
    "name": "Juan Pérez",
    "brand": "Toyota",
    "model": "Corolla",
    "color": "Blue"
  }'
```

### Ver vehículos activos
```bash
curl http://localhost:3001/api/vehicles/active \
  -H "Authorization: Bearer {TOKEN}"
```

## 🏗️ Arquitectura

```
src/
├── auth/               # Módulo de autenticación (JWT)
├── common/             # Guards, decorators, filters, interceptors
├── config/             # Configuración de la app
├── employees/          # Gestión de empleados
├── payments/           # Pagos y métodos de pago
├── prisma/             # Servicio de Prisma
├── reports/            # Reportes y analytics
├── settings/           # Configuración del sistema
├── vehicles/           # Gestión de vehículos
├── app.module.ts       # Módulo raíz
└── main.ts             # Bootstrap de la aplicación
```

## 🔐 Sistema de Roles

### ADMIN
- Acceso completo a todos los endpoints
- Gestión de usuarios y empleados
- Configuración del sistema
- Reportes y analytics

### ATTENDANT
- Registro de vehículos (manual y QR)
- Checkout de vehículos
- Vista de vehículos activos
- Registro de pagos
- Listado de métodos de pago (solo lectura)

## 🗄️ Modelos de Base de Datos

- **User**: Usuarios con autenticación
- **Employee**: Empleados/asistentes de estacionamiento
- **Vehicle**: Vehículos registrados
- **PaymentMethod**: Métodos de pago configurables
- **Payment**: Registros de transacciones
- **Settings**: Configuración del sistema

## 📝 Scripts Disponibles

```bash
npm run build          # Compilar proyecto
npm run start          # Iniciar en modo producción
npm run start:dev      # Iniciar en modo desarrollo (watch)
npm run start:debug    # Iniciar en modo debug
npm run prisma:generate # Generar Prisma Client
npm run prisma:migrate  # Ejecutar migraciones
npm run prisma:studio   # Abrir Prisma Studio
npm run prisma:seed     # Seed de datos iniciales
```

## 🔗 Integración con Frontend

El frontend Next.js debe:

1. Usar `http://localhost:3001/api` como base URL
2. Implementar interceptor de axios con token JWT
3. Guardar el token en memoria o httpOnly cookie
4. Incluir header: `Authorization: Bearer {token}` en todas las requests

## 📦 Dependencias Principales

- **@nestjs/core**: Framework principal
- **@nestjs/jwt**: Autenticación JWT
- **@prisma/client**: ORM para PostgreSQL
- **bcrypt**: Hashing de contraseñas
- **class-validator**: Validación de DTOs
- **passport-jwt**: Estrategia JWT para Passport

## 🛠️ Troubleshooting

### Error de conexión a PostgreSQL
Verificar que PostgreSQL esté corriendo:
```bash
pg_isready
```

### Error en migraciones
Resetear la base de datos:
```bash
npx prisma migrate reset
```

### Error "Prisma Client not found"
Regenerar el cliente:
```bash
npm run prisma:generate
```

## 📄 Licencia

ISC

## 👨‍💻 Desarrollado con

- NestJS 10.x
- Prisma 7.x
- PostgreSQL 14+
- TypeScript 5.x
