# Panel de Control IKUSI

Sistema de visualización de datos empresariales desarrollado como prueba técnica frontend con React, TypeScript y Tailwind CSS.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Instrucciones para Correr el Proyecto](#-instrucciones-para-correr-el-proyecto)
- [Librerías Externas Utilizadas](#-librerías-externas-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)

---

## 🚀 Características Principales

- **Navegación jerárquica**: Global → Países → Ciudades → Centros
- **Gráficas dinámicas**: Chart.js con 4 tipos de visualizaciones
- **Autenticación simulada**: Token falso con localStorage
- **APIs simuladas**: Delays 300-1500ms, 5% errores
- **Filtros reactivos**: Datos y gráficas actualizadas en tiempo real
- **Responsive design**: Mobile-first con Tailwind CSS

---

## 🏃 Instrucciones para Correr el Proyecto

### Prerrequisitos

- **Node.js**: Versión 18 o superior
- **npm**: Versión 9 o superior (incluido con Node.js)

### Instalación desde Cero

1. **Clonar el repositorio** (o descargar el ZIP):

```bash
git clone https://github.com/felipeacx/testfrontend.git
cd testfrontend
```

2. **Instalar dependencias**:

```bash
npm install
```

3. **Iniciar el servidor de desarrollo**:

```bash
npm run dev
```

4. **Abrir en el navegador**:

El proyecto estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

### Comandos Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run preview  # Vista previa de la build de producción
npm run lint     # Ejecuta ESLint para validar el código
npm run test     # Ejecuta las pruebas unitarias
npm run test:coverage     # Ejecuta las pruebas unitarias con cobertura
```

### Credenciales de Prueba

- **Email**: `admin@ikusi.com`
- **Contraseña**: Cualquier texto (ej: `password123`)

> **Nota**: La autenticación es simulada. Cualquier email válido será aceptado.

---

## 📦 Librerías Externas Utilizadas

### Dependencias de Producción

| Librería           | Versión | Propósito                             |
| ------------------ | ------- | ------------------------------------- |
| `react`            | ^19.1.1 | Framework principal de UI             |
| `react-dom`        | ^19.1.1 | Renderizado de React en el DOM        |
| `react-router-dom` | ^7.9.3  | Navegación y routing (SPA)            |
| `chart.js`         | ^4.5.0  | Librería para gráficas dinámicas      |
| `react-chartjs-2`  | ^5.3.0  | Wrapper de Chart.js para React        |
| `react-icons`      | ^5.5.0  | Iconos (FaUser, FaLock, FaHome, etc.) |

### Dependencias de Desarrollo

| Librería                    | Versión  | Propósito                            |
| --------------------------- | -------- | ------------------------------------ |
| `vite`                      | ^7.1.7   | Build tool y dev server ultrarrápido |
| `typescript`                | ~5.8.3   | Tipado estático de JavaScript        |
| `tailwindcss`               | ^4.1.14  | Framework de CSS utility-first       |
| `@vitejs/plugin-react`      | ^5.0.3   | Plugin de Vite para React            |
| `eslint`                    | ^9.36.0  | Linter de código                     |
| `eslint-plugin-react-hooks` | ^5.2.0   | Reglas de linting para React Hooks   |
| `@types/react`              | ^19.1.13 | Definiciones de tipos para React     |
| `@types/react-dom`          | ^19.1.9  | Definiciones de tipos para React DOM |
| `autoprefixer`              | ^10.4.21 | PostCSS plugin para vendor prefixes  |
| `postcss`                   | ^8.5.6   | Procesador de CSS                    |

---

### Descripción de Capas

#### **Capa de Presentación (Views + Components)**

- **`views/`**: Páginas principales con lógica de navegación y estado
- **`components/`**: Componentes reutilizables y presentacionales

#### **Capa de Lógica (Hooks + Contexts)**

- **`hooks/`**: Custom hooks para lógica reutilizable
- **`contexts/`**: Context API para estado global (autenticación)

#### **Capa de Datos (Services + Constants)**

- **`services/`**: Lógica de acceso a datos (APIs simuladas)
- **`constants/`**: Datos mock y configuraciones estáticas

#### **Capa de Tipos (Types)**

- **`types/`**: Definiciones TypeScript para type safety

#### **Capa de Pruebas (Tests)**

- **`tests/`**: Pruebas automatizadas unitarias

---

## ✨ Funcionalidades Implementadas

### 1. Pantalla de Login

- Validación de email y contraseña
- Token falso con localStorage
- Toggle de visibilidad de contraseña
- Feedback visual de errores y loading

### 2. Dashboard

#### Visualización Jerárquica

- Estructura: Global → Países → Ciudades → Centros
- Navegación con breadcrumbs
- 8 países, 12 ciudades, 10 centros operativos
- Métricas por nivel (empleados, ingresos, proyectos)

#### Gráficas Dinámicas

- 4 tipos: Barras, Líneas (doble eje), Donut
- Métricas: Ingresos por servicio, proyectos por región, evolución anual, tecnologías por centro
- Reactivas a filtros de país/ciudad/centro

#### APIs Simuladas

- Delays 300-1500ms
- Simulación de errores 5%
- Estados de carga manejados
- Métodos: `getCountries`, `getCitiesByCountry`, `getCentersByCity`, `getMetrics`, `getGlobalSummary`

### 3. Interacción UI

- Actualización sin recargar (SPA)
- Hover effects y animaciones
- Loading spinners
- Toggle entre vista de datos y gráficas

---

## 🔒 Requisitos Técnicos

- **Responsive**: Mobile-first (320px+), breakpoints Tailwind
- **React Router**: Rutas protegidas con guards
- **Context API**: Estado global de autenticación
- **Tailwind CSS**: Utility classes
- **Estructura por capas**: Components, Views, Services, Contexts, Hooks, Types

---
