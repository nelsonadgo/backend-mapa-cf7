# 🗺️ Backend Mapa CF7
Este proyecto es la API del servidor para el mapa de accesibilidad **CF7**. Está desarrollado en **Node.js** con **Express**, utilizando **Supabase** (PostgreSQL) como base de datos en la nube y **Cloudinary** para la gestión de imágenes.

## 🚀 Características
- **🔑 Autenticación y Autorización**: Registro y login con contraseñas encriptadas (`bcryptjs`) y generación de tokens `JWT`. Admite roles como `visitante`, `personal` y `admin`.
- **📍 Gestión de Espacios**: Endpoints para crear, actualizar, detallar, listar y eliminar espacios físicos. Permite filtrar por accesibilidad, categorías y pisos. Carga de imágenes integrada con Cloudinary.
- **🛣️ Gestión de Recorridos**: Trazado de rutas, nodos y aristas para guiar a los usuarios de forma accesible por el mapa.
- **⚠️ Gestión de Reportes**: Registro de reportes y barreras de accesibilidad informados por los usuarios.
- **☁️ Integración Cloudinary**: Almacenamiento seguro y procesamiento en la nube para fotos de los espacios físicos.
- **⚡ Base de Datos Supabase**: Integración robusta utilizando PostgreSQL con soporte para tipos espaciales y relaciones estructuradas.

---

## 🛠️ Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (Versión 16 o superior recomendada)
- **NPM** (Incluido con la instalación de Node.js)
- Acceso a una base de datos en **Supabase** y una cuenta en **Cloudinary**

---

## ⚙️ Configuración del Entorno (`.env`)
Para ejecutar este servidor localmente, debes contar con un archivo `.env` en la raíz del proyecto. El archivo configurado actual contiene:
```env
PORT=3000
SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_KEY=tu_supabase_service_key
SUPABASE_ESPACIOS_TABLE=espacios
SUPABASE_RECORRIDOS_TABLE=recorridos
SUPABASE_PERFILES_TABLE=perfiles
JWT_SECRET=tu_jwt_secret

CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_api_secret
```

---

## 💾 Configuración de la Base de Datos (Supabase SQL)
En el directorio `supabasesql/` se encuentran los scripts ordenados lógicamente para inicializar la base de datos en Supabase:
1. `ExtensionesYTipos.sql`: Habilita la extensión `uuid-ossp` y define los enums requeridos (`rol_usuario`, `categoria_nodo`, `categoria_arista`, `categoria_barrera`, `estado_reporte`), además de crear las tablas `perfiles` y `preferencias_accesibilidad`.
2. `ModuloFisico.sql`: Crea las tablas principales para el plano físico: `edificios`, `pisos` y `categorias_espacio`.
3. `NodosAristasEspacios.sql`: Define las tablas para navegación y modelado de grafos, conectando nodos y aristas a los espacios físicos.
4. `RutasBarrerasReportes.sql`: Estructura para almacenar las rutas, barreras de accesibilidad y reportes de usuarios.
5. `AcoplamientoDelModuloTemporal.sql`: Extensiones y lógica complementaria del modelo de datos para manejo temporal o de estados adicionales.
6. `CargaDeDatosOperativos.sql`: Script opcional con datos iniciales para pruebas.

*Puedes ejecutar estos scripts directamente desde el Editor SQL de tu consola de Supabase.*

---

## 📦 Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo de desarrollo (usando nodemon)**:
   ```bash
   npm run dev
   ```

3. **Ejecutar en producción**:
   ```bash
   npm start
   ```

---

## 🔌 API Endpoints (Rutas)

### 🩺 Sistema & Diagnóstico
- `GET /api/health`: Comprobación rápida del estado de la API.
- `GET /api/test-db`: Prueba de conexión directa con la base de datos Supabase.

### 🔑 Autenticación (`/api/auth`)
- `POST /api/auth/register`: Registro de nuevos usuarios.
  - *Cuerpo (JSON):* `{ "legajo": "12345", "nombre": "Juan Pérez", "password": "mi_contraseña", "rol": "visitante" }`
- `POST /api/auth/login`: Autenticación y obtención de token JWT.
  - *Cuerpo (JSON):* `{ "legajo": "12345", "password": "mi_contraseña" }`

### 📍 Espacios (`/api/espacios`)
- `GET /api/espacios`: Listado de espacios físicos.
  - *Query Params:* `limit`, `offset`, `search`, `categoria_id`, `piso_id`, `accesible` (`true`/`false`).
- `GET /api/espacios/:id`: Obtener el detalle de un espacio específico.
- `POST /api/espacios`: Crear un nuevo espacio. *Soporta multipart/form-data con archivo adjunto en el campo `imagen`.*
- `PUT /api/espacios/:id`: Reemplazar todos los datos de un espacio.
- `PATCH /api/espacios/:id`: Modificación parcial de un espacio.
- `DELETE /api/espacios/:id`: Eliminar un espacio.

### 🛣️ Recorridos (`/api/recorridos`)
- `GET /api/recorridos`: Obtener listado de recorridos configurados.
- `GET /api/recorridos/:id`: Obtener un recorrido específico.
- `POST /api/recorridos`: Crear un nuevo recorrido/ruta.
- `PATCH /api/recorridos/:id`: Modificar un recorrido.
- `DELETE /api/recorridos/:id`: Eliminar un recorrido.

### ⚠️ Reportes (`/api/reportes`)
- `GET /api/reportes`: Listado de reportes de accesibilidad.
- `GET /api/reportes/:id`: Obtener detalles de un reporte.

---

## 📁 Estructura del Proyecto
```text
backend-mapa-cf7/
├── src/
│   ├── app.js               # Configuración Express, middlewares y ruteo central
│   ├── server.js            # Punto de entrada y arranque del servidor
│   ├── config/              # Configuración de servicios externos y variables de entorno
│   │   ├── env.js
│   │   ├── supabase.js
│   │   └── cloudinary.js
│   ├── middlewares/         # Middlewares globales y locales (ej: manejo de errores, subida de archivos)
│   │   ├── error.middleware.js
│   │   └── upload.js
│   ├── modules/             # Módulos encapsulados de negocio (Controladores, Repositorios, Rutas)
│   │   ├── auth/
│   │   ├── espacios/
│   │   ├── recorridos/
│   │   └── reportes/
│   └── utils/               # Utilidades generales y helpers
├── supabasesql/             # Scripts SQL de configuración de base de datos en Supabase
├── .env                     # Archivo de configuración local
└── package.json             # Dependencias y scripts del proyecto
```
