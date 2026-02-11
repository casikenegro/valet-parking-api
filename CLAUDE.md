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
- ✅ 26+ endpoints REST funcionales
- ✅ Validación automática con class-validator
- ✅ Manejo de errores global
- ✅ CORS configurado para Next.js
- ✅ Seed de datos iniciales
- ✅ Documentación completa en README.md

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

## 🚀 Próximos Pasos

1. Configurar PostgreSQL: `createdb valet_parking`
2. Editar `.env` con credenciales de BD
3. Ejecutar migraciones: `npm run prisma:migrate`
4. Seed de datos: `npm run prisma:seed`
5. Iniciar servidor: `npm run start:dev`

Ver [README.md](./README.md) para instrucciones completas.
