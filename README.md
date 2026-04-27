# Traffic-Simulator-Backend

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ARSW2026-JDC_Traffic-Simulator-Backend&metric=coverage)](https://sonarcloud.io/dashboard?id=ARSW2026-JDC_Traffic-Simulator-Backend)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ARSW2026-JDC_Traffic-Simulator-Backend&metric=alert_status)](https://sonarcloud.io/dashboard?id=ARSW2026-JDC_Traffic-Simulator-Backend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ARSW2026-JDC_Traffic-Simulator-Backend&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=ARSW2026-JDC_Traffic-Simulator-Backend)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ARSW2026-JDC_Traffic-Simulator-Backend&metric=security_rating)](https://sonarcloud.io/dashboard?id=ARSW2026-JDC_Traffic-Simulator-Backend)

Backend principal de la aplicación CUTS. Proporciona API REST para usuarios, autenticación Firebase, chat en tiempo real, gestión de historial y conexión a Redis.

## Tecnologías

- **[NestJS](https://nestjs.com/)** v11.0.0 - Framework backend
- **[TypeScript](https://www.typescriptlang.org/)** v5.3.3 - Tipado
- **[Prisma](https://www.prisma.io/)** v7.5.0 - ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos
- **[Redis](https://redis.io/)** v5.3.2 - Cache y sesiones
- **[Socket.io](https://socket.io/)** v4.6.1 - WebSocket
- **[firebase-admin](https://firebase.google.com/docs/admin)** v12.0.0 - Autenticación
- **[Joi](https://joi.dev/)** v18.0.2 - Validación de env vars

## Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x
- Redis (opcional)

## Instalación

```bash
npm install
npm run prisma:generate  # Generar cliente Prisma
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build && npm run start:prod
```

## Tests

```bash
npm run test           # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov       # Coverage
```

## Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `PORT` | Puerto del servidor | ✅ |
| `DATABASE_URL` | URL PostgreSQL | ✅ |
| `DIRECT_URL` | URL directa PostgreSQL | ✅ |
| `REDIS_HOST` | Host Redis | ✅ |
| `REDIS_PORT` | Puerto Redis | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ |
| `VITE_FIREBASE_PRIVATE_KEY` | Firebase Private Key | ✅ |
| `VITE_FIREBASE_CLIENT_EMAIL` | Firebase Client Email | ✅ |

## Estructura

```
src/
├── auth/           # Autenticación Firebase
├── chat/          # Chat WebSocket
├── config/         # Variables de entorno
├── history/       # Historial de mensajes
├── prisma/         # Cliente Prisma
├── redis/         # Cache Redis
└── users/         # Gestión de usuarios
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Compila el proyecto |
| `npm run start` | Inicia en producción |
| `npm run start:dev` | Desarrollo con hot-reload |
| `npm run start:debug` | Modo debug |
| `npm run lint` | ESLint con auto-fix |
| `npm run format` | Prettier |
| `npm run prisma:generate` | Genera cliente Prisma |
| `npm run prisma:migrate` | Migra la base de datos |