#  Wise Auth - Microservicio de Autenticación

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 📋 Descripción

**Wise Auth** es un microservicio de autenticación y autorización construido con NestJS que proporciona autenticación OAuth 2.0 con Google y gestión de usuarios basada en roles (RBAC). Este servicio forma parte de la arquitectura de microservicios del proyecto ECIWISE.

### Características principales:
- ✅ Autenticación OAuth 2.0 con Google
- ✅ Gestión de tokens JWT
- ✅ Sistema de roles (Estudiante, Tutor, Admin)
- ✅ Guards globales para protección de rutas
- ✅ Integración con PostgreSQL mediante Prisma ORM
- ✅ Validación automática de datos con class-validator
- ✅ Logging detallado de operaciones

---

## 🛠️ Tecnologías

### Core
- **[NestJS](https://nestjs.com/)** v11.0.1 - Framework backend progresivo para Node.js
- **[TypeScript](https://www.typescriptlang.org/)** v5.7.3 - Superset tipado de JavaScript
- **[Node.js](https://nodejs.org/)** - Entorno de ejecución

### Base de Datos
- **[PostgreSQL](https://www.postgresql.org/)** - Sistema de gestión de base de datos relacional
- **[Prisma ORM](https://www.prisma.io/)** v6.19.0 - ORM de última generación para Node.js y TypeScript

### Autenticación y Seguridad
- **[Passport](https://www.passportjs.org/)** v0.7.0 - Middleware de autenticación
- **[Passport-JWT](http://www.passportjs.org/packages/passport-jwt/)** v4.0.1 - Estrategia JWT para Passport
- **[Passport-Google-OAuth20](http://www.passportjs.org/packages/passport-google-oauth20/)** v2.0.0 - Estrategia Google OAuth 2.0
- **[@nestjs/jwt](https://docs.nestjs.com/security/authentication#jwt-functionality)** v11.0.1 - Módulo JWT para NestJS
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** v6.0.0 - Librería de hashing

### Validación
- **[class-validator](https://github.com/typestack/class-validator)** v0.14.2 - Validación basada en decoradores
- **[class-transformer](https://github.com/typestack/class-transformer)** v0.5.1 - Transformación de objetos
- **[joi](https://joi.dev/)** v18.0.1 - Validación de esquemas para variables de entorno

### Testing
- **[Jest](https://jestjs.io/)** v30.0.0 - Framework de testing
- **[Supertest](https://github.com/visionmedia/supertest)** v7.0.0 - Testing de APIs HTTP

### Desarrollo
- **[ESLint](https://eslint.org/)** v9.18.0 - Linter para código JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** v3.4.2 - Formateador de código
- **[ts-node](https://typestrong.org/ts-node/)** v10.9.2 - Ejecución de TypeScript en Node.js

### Documentación
- **[@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)** - Generación automática de documentación OpenAPI/Swagger

---

##  Instalación

### Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x
- Cuenta de Google Cloud Platform (para OAuth)

### 1. Clonar el repositorio
```bash
git clone https://github.com/DOSW2025/wise_auth.git
cd wise_auth
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto de la aplicación
PORT=3000

# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/wise_auth?schema=public"
DIRECT_URL="postgresql://usuario:password@localhost:5432/wise_auth?schema=public"

# JWT Configuration
JWT_SECRET="tu_secreto_super_seguro_aqui_cambiar_en_produccion"
JWT_EXPIRATION="7d"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

> **Nota:** Puedes copiar el archivo `.env.example` como plantilla.

### 4. Configurar Google OAuth 2.0

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Habilitar la API de Google+
4. Crear credenciales OAuth 2.0:
   - **Tipo:** ID de cliente de OAuth 2.0
   - **Tipo de aplicación:** Aplicación web
   - **Orígenes autorizados:** `http://localhost:3000`
   - **URI de redirección autorizados:** `http://localhost:3000/auth/google/callback`
5. Copiar el **Client ID** y **Client Secret** al archivo `.env`

### 5. Configurar la base de datos

```bash
# Crear la base de datos (si no existe)
psql -U postgres -c "CREATE DATABASE wise_auth;"

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Visualizar la base de datos con Prisma Studio
npx prisma studio
```

---

## 🚀 Ejecución

### Modo desarrollo (con hot-reload)
```bash
npm run start:dev
```
El servidor estará disponible en `http://localhost:3000`

### Modo producción
```bash
# 1. Compilar el proyecto
npm run build

# 2. Ejecutar en producción
npm run start:prod
```

### Modo debug
```bash
npm run start:debug
```
Permite conectar un debugger en el puerto 9229.

### Otros comandos útiles
```bash
# Ejecutar sin compilar (producción)
npm run start

# Formatear código
npm run format

# Verificar linting
npm run lint
```

---

## 🧪 Testing

### Ejecutar todos los tests unitarios
```bash
npm run test
```

### Tests en modo watch (desarrollo)
```bash
npm run test:watch
```
Los tests se ejecutarán automáticamente al detectar cambios.

### Tests end-to-end (e2e)
```bash
npm run test:e2e
```
Prueban el flujo completo de la aplicación.

### Generar reporte de cobertura
```bash
npm run test:cov
```
Los reportes se generan en la carpeta `coverage/`

### Modo debug para tests
```bash
npm run test:debug
```
Permite depurar tests con Node Inspector.

### Estructura de tests
```
test/
├── app.e2e-spec.ts        # Tests end-to-end
└── jest-e2e.json          # Configuración Jest E2E

src/
└── **/*.spec.ts           # Tests unitarios junto al código
```

---

## 📖 Documentación de API

### Swagger UI

Este microservicio incluye documentación interactiva de la API mediante **Swagger/OpenAPI**.

#### Acceder a Swagger UI

Con el servidor en ejecución, abre tu navegador en:

```
http://localhost:3000/api/docs
```

#### Características de Swagger:
- 📚 **Explorar endpoints**: Visualiza todos los endpoints disponibles con sus descripciones
- 🧪 **Probar API**: Ejecuta requests directamente desde el navegador
- 📋 **Esquemas de datos**: Ve la estructura de requests y responses con ejemplos
- 🔒 **Autenticación**: Prueba endpoints protegidos con JWT usando el botón "Authorize"
- 💡 **Ejemplos**: Cada endpoint incluye ejemplos de uso

#### Endpoints Documentados:

**Autenticación**
- `GET /auth/google` - Inicia el flujo OAuth 2.0 con Google
- `GET /auth/google/callback` - Callback de Google que retorna JWT

#### Usar JWT en Swagger:

1. Obtén un token mediante el flujo de autenticación
2. Click en el botón **"Authorize"** (🔓) en la parte superior
3. Ingresa: `Bearer <tu-token-jwt>`
4. Click en "Authorize"
5. Ahora puedes probar endpoints protegidos

> 📘 Para más detalles sobre Swagger, consulta: [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

## 📚 Arquitectura del Proyecto

```
src/
├── auth/                      # Módulo de autenticación
│   ├── decorators/            # Decoradores personalizados
│   │   ├── get-user.decorator.ts      # Extrae usuario del request
│   │   ├── public.decorator.ts        # Marca rutas públicas
│   │   └── roles.decorator.ts         # Define roles requeridos
│   ├── dto/                   # Data Transfer Objects
│   │   ├── auth-response.dto.ts       # Respuesta de autenticación
│   │   └── google-user.dto.ts         # Datos de usuario de Google
│   ├── enums/                 # Enumeraciones
│   │   └── role.enum.ts               # Roles y estados
│   ├── guards/                # Guards de protección
│   │   ├── google-auth.guard.ts       # Guard OAuth Google
│   │   ├── jwt-auth.guard.ts          # Guard JWT
│   │   └── roles.guard.ts             # Guard de roles
│   ├── strategies/            # Estrategias de Passport
│   │   ├── google.strategy.ts         # Estrategia OAuth Google
│   │   └── jwt.strategy.ts            # Estrategia JWT
│   ├── auth.controller.ts     # Controlador de rutas
│   ├── auth.module.ts         # Módulo de autenticación
│   ├── auth.service.ts        # Lógica de negocio
│   └── index.ts               # Exports públicos
├── config/                    # Configuración
│   ├── envs.ts                # Variables de entorno validadas
│   └── index.ts               # Exports de configuración
├── prisma/                    # Módulo Prisma
│   ├── prisma.module.ts       # Módulo Prisma
│   └── prisma.service.ts      # Servicio Prisma
├── app.module.ts              # Módulo raíz
└── main.ts                    # Entry point
```

---

## 🔒 Sistema de Roles

### Roles disponibles:
- **estudiante**: Usuario básico del sistema (rol por defecto)
- **tutor**: Usuario con permisos de tutoría
- **admin**: Administrador con permisos completos

### Uso de decoradores:

```typescript
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './auth/enums/role.enum';

// Solo admin puede acceder
@Roles(Role.ADMIN)
@Get('admin-only')
adminRoute() {
  return 'Solo admin';
}

// Admin o tutor pueden acceder
@Roles(Role.ADMIN, Role.TUTOR)
@Get('staff-only')
staffRoute() {
  return 'Admin o tutor';
}

// Ruta pública (sin JWT)
@Public()
@Get('public')
publicRoute() {
  return 'Acceso público';
}

// Extraer usuario del request
@Get('profile')
getProfile(@GetUser() user) {
  return user;
}
```

---

## 🗄️ Base de Datos

### Modelo de Usuario

```prisma
model Usuario {
  id                    String         @id @default(uuid())
  email                 String         @unique
  nombre                String
  apellido              String
  telefono              String?
  semestre              Int            @default(1)
  google_id             String?        @unique
  avatar_url            String?
  rol                   RolEnum        @default(estudiante)
  estado                EstadoUsuario  @default(activo)
  email_verificado      Boolean        @default(false)
  ultimo_login          DateTime?
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
}
```

### Comandos Prisma útiles

```bash
# Crear una nueva migración
npx prisma migrate dev --name nombre_de_la_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (solo desarrollo)
npx prisma migrate reset

# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Generar cliente después de cambios en schema
npx prisma generate
```

---

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo | Requerido |
|----------|-------------|---------|-----------|
| `PORT` | Puerto del servidor | `3000` | ✅ |
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/db` | ✅ |
| `DIRECT_URL` | URL directa para migraciones | `postgresql://user:pass@localhost:5432/db` | ✅ |
| `JWT_SECRET` | Secreto para firmar JWT | `supersecret123` | ✅ |
| `JWT_EXPIRATION` | Tiempo de expiración del JWT | `7d` o `3600` | ✅ |
| `GOOGLE_CLIENT_ID` | Client ID de Google OAuth | `123-abc.apps.googleusercontent.com` | ✅ |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google OAuth | `GOCSPX-abc123` | ✅ |
| `GOOGLE_CALLBACK_URL` | URL de callback de Google | `http://localhost:3000/auth/google/callback` | ✅ |

---

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Compila el proyecto TypeScript |
| `npm run start` | Inicia la aplicación en modo producción |
| `npm run start:dev` | Inicia con hot-reload para desarrollo |
| `npm run start:debug` | Inicia en modo debug |
| `npm run start:prod` | Inicia en modo producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Formatea código con Prettier |
| `npm run test` | Ejecuta tests unitarios |
| `npm run test:watch` | Ejecuta tests en modo watch |
| `npm run test:cov` | Genera reporte de cobertura |
| `npm run test:debug` | Ejecuta tests en modo debug |
| `npm run test:e2e` | Ejecuta tests end-to-end |

---

## 📝 Convenciones de Commits

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial claro y consistente.

### Formato Básico

```
<tipo>(<alcance>): <descripción>
```

### Tipos Principales

- `feat` - Nueva funcionalidad
- `fix` - Corrección de bug
- `docs` - Cambios en documentación
- `style` - Cambios de formato
- `refactor` - Refactorización de código
- `test` - Añadir o modificar tests
- `chore` - Tareas de mantenimiento

### Ejemplos

```bash
feat(auth): agregar autenticación con Facebook
fix(jwt): corregir validación de tokens expirados
docs(readme): actualizar instrucciones de instalación
test(auth): aumentar cobertura de Google OAuth
```

> 📘 **Documentación completa:** Ver [COMMITS.md](./COMMITS.md) para guía detallada de convenciones de commits

---

## 📄 Licencia

Este proyecto es privado y pertenece a DOSW2025.

---

## 👥 Equipo

**DOSW2025** - Desarrollo de Aplicaciones Web

---

## 📞 Soporte

Para preguntas o problemas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

---

## 🔗 Enlaces Útiles

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
