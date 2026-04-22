# Our Distance - Frontend

Interfaz web de **Our Distance**, construida con Angular.

Este frontend consume la API del proyecto `our-distance` y cubre:

- registro e inicio de sesion
- refresh automatico de sesion con `refresh_token`
- recuperacion y reseteo de contrasena
- cambio de contrasena para usuarios autenticados
- gestion de metas privadas, compartidas y de pareja
- conexion y desconexion de pareja
- perfil de usuario

## Stack

- **Angular**
- **TypeScript**
- **CSS**
- **RxJS**

## Requisitos

- Node.js 18+
- Angular CLI

## Instalacion

```bash
git clone https://github.com/Mayel-dev/our-distance-app.git
cd our-distance-app
npm install
```

## Configuracion de entorno

El frontend usa estos archivos:

- `src/environments/environment.ts` para desarrollo
- `src/environments/environment.prod.ts` para produccion

Valores actuales:

- desarrollo: `http://localhost:3000`
- produccion: `https://our-distance-production-35d4.up.railway.app`

Para desarrollo local, el backend debe estar corriendo en `http://localhost:3000`.

## Ejecutar en desarrollo

```bash
npm start
```

La app queda disponible en:

```txt
http://localhost:4200
```

## Build

```bash
npm run build
```

## Paginas actuales

- `Welcome`
- `Register`
- `Login`
- `Forgot Password`
- `Reset Password`
- `Home`
- `Goals`
- `Pairing`
- `Profile`

## Autenticacion

### Tokens y sesion

- El login y el registro guardan `access_token` y `refresh_token`.
- Las requests autenticadas usan un interceptor HTTP.
- Si una request protegida responde `401`, el frontend intenta refrescar la sesion con `POST /auth/refresh`.
- Si el refresh falla o ya no existe `refresh_token`, la sesion local se limpia y el usuario vuelve a `/login`.

### Recuperacion de contrasena

Flujo soportado por el frontend:

1. `POST /users/forgot-password`
2. `POST /users/reset-password`

La UI publica para este flujo vive en:

- `src/app/pages/forgot-password`
- `src/app/pages/reset-password`

### Cambio de contrasena con sesion iniciada

Cuando el usuario ya esta autenticado, el frontend usa:

```txt
PATCH /users/me/password
```

El username se actualiza por separado usando:

```txt
PATCH /users/me
```

## Estructura relevante

```txt
src/
  app/
    guards/
    interceptors/
    pages/
    services/
  environments/
```

Archivos importantes:

- `src/app/services/auth.service.ts`
- `src/app/interceptors/auth.interceptor.ts`
- `src/app/services/goals.service.ts`
- `src/app/app.routes.ts`
- `src/app/app.config.ts`

## Verificacion recomendada

Antes de cerrar cambios de auth, validar:

1. login y registro
2. refresh automatico despues de invalidar el `access_token`
3. redireccion a login si no hay `refresh_token`
4. forgot password
5. reset password
6. cambio de contrasena autenticado

## Backend relacionado

Repositorio backend:

https://github.com/Mayel-dev/our-distance
