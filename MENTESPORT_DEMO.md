# MenteSport - Aplicación de Psicología Deportiva

## Descripción

MenteSport es una aplicación demo de psicología deportiva diseñada para jóvenes atletas (9-18 años) que incluye elementos de gamificación para hacer el entrenamiento mental más atractivo y efectivo.

## Características Principales

### 🎮 Gamificación
- **Sistema de Niveles**: Progresión a través de niveles desbloqueables
- **Sistema de XP**: Puntos de experiencia por completar actividades
- **Logros**: Sistema de achievements con diferentes niveles de rareza
- **Progreso Visual**: Barras de progreso y estadísticas detalladas

### 👨‍⚕️ Roles de Usuario
- **Estudiante/Deportista**: Acceso a contenido educativo y seguimiento de progreso
- **Padre/Madre**: Misma información que el estudiante para supervisión
- **Psicólogo**: Panel administrativo completo con herramientas de gestión

### 📚 Contenido Educativo
- **Videos**: Lecciones en video sobre técnicas de psicología deportiva
- **Artículos**: Contenido de lectura especializado
- **Ejercicios Prácticos**: Actividades interactivas
- **Quizzes**: Evaluaciones de conocimiento

### 🎯 Sistema de Niveles
1. **Fundamentos de la Confianza** - Conceptos básicos de autoconfianza
2. **Control de la Ansiedad Pre-Competencia** - Técnicas de manejo de nervios
3. **Concentración y Enfoque** - Desarrollo de atención plena
4. **Motivación y Metas** - Establecimiento de objetivos
5. **Manejo de la Presión Competitiva** - Técnicas avanzadas
6. **Liderazgo Deportivo** - Habilidades de liderazgo

### 📞 Videollamadas Mensuales
- Una sesión mensual de 45 minutos con el psicólogo
- Sistema de programación de citas
- Historial de sesiones pasadas
- Notas y seguimiento del progreso

## Tecnologías Utilizadas

- **Backend**: Laravel 11
- **Frontend**: React 18 + TypeScript
- **UI Framework**: Inertia.js
- **Componentes**: Shadcn UI + Radix UI
- **Estilos**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: Laravel Boost Wayfinder

## Estructura del Proyecto

### Páginas Principales (Estudiantes/Padres)
- `/dashboard` - Dashboard principal con resumen de progreso
- `/progreso` - Estadísticas detalladas y seguimiento
- `/niveles` - Vista de todos los niveles disponibles
- `/multimedia` - Biblioteca de contenido educativo
- `/videollamadas` - Gestión de sesiones con el psicólogo
- `/logros` - Galería de achievements desbloqueados
- `/suscripcion` - Gestión de planes y facturación

### Páginas Administrativas (Psicólogos)
- `/admin/usuarios` - Gestión de usuarios
- `/admin/estudiantes` - Panel de estudiantes
- `/admin/padres` - Panel de padres
- `/admin/programas` - Gestión de programas y planes
- `/admin/pagos` - Sistema de pagos y suscripciones
- `/admin/comunicacion` - Foros y chats
- `/admin/citas` - Calendario de citas

### Componentes Personalizados
- `GamificationCard` - Tarjetas de logros con sistema de rareza
- `LevelCard` - Tarjetas de nivel con progreso y contenido
- `AppSidebar` - Sidebar adaptativo con navegación contextual

## Funcionalidades de Gamificación

### Sistema de Logros
- **Común** (Gris): Logros básicos como "Primera Sesión"
- **Raro** (Azul): Logros de consistencia como "Racha de 7 días"
- **Épico** (Morado): Logros de maestría como "Maestro de la Concentración"
- **Legendario** (Naranja): Logros excepcionales como "Leyenda del Deporte Mental"

### Mecánicas de Progreso
- **XP por actividad**: 50-500 XP según la dificultad y rareza
- **Niveles con requisitos**: Cada nivel requiere completar el anterior
- **Contenido desbloqueables**: Videos, ejercicios y evaluaciones
- **Seguimiento de rachas**: Días consecutivos de actividad

## Configuración del Desarrollo

### Requisitos
- PHP 8.2+
- Node.js 18+
- Composer
- NPM/Yarn

### Instalación
```bash
# Instalar dependencias de PHP
composer install

# Instalar dependencias de Node.js
npm install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Compilar assets
npm run build

# Para desarrollo
npm run dev
```

### Comandos Útiles
```bash
# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Linting y formato
npm run lint
npm run format

# Tipos TypeScript
npm run types
```

## Navegación de la Demo

### Para Estudiantes/Deportistas
1. **Dashboard**: Vista general con progreso actual, próxima videollamada y acciones rápidas
2. **Mi Progreso**: Estadísticas detalladas, gráficos de progreso semanal y actividad reciente
3. **Niveles**: Ruta de aprendizaje completa con 6 niveles progresivos
4. **Multimedia**: Biblioteca de contenido organizada por tipo y estado de completitud
5. **Videollamadas**: Programación y historial de sesiones con el psicólogo
6. **Logros**: Galería de achievements con sistema de progreso y rareza

### Elementos de UX/UI Destacados
- **Diseño Responsivo**: Adaptado para móvil, tablet y desktop
- **Modo Oscuro**: Soporte completo para tema claro/oscuro
- **Microinteracciones**: Animaciones sutiles para mejorar la experiencia
- **Feedback Visual**: Indicadores claros de progreso y estado
- **Colores Semánticos**: Sistema de colores consistente para diferentes estados

## Datos de Demostración

La aplicación incluye datos mock realistas para simular:
- Un estudiante de nivel 3 con 65% de progreso al siguiente nivel
- 12 logros desbloqueados de diferentes raramente
- Historial de 3 videollamadas completadas
- 4 niveles de contenido con diferentes estados de progreso
- Estadísticas de uso realistas (24 sesiones, 12.5 horas de entrenamiento)

## Próximos Pasos para Implementación Real

1. **Base de Datos**: Diseñar esquema para usuarios, niveles, contenido y progreso
2. **Autenticación**: Implementar sistema de roles y permisos
3. **API**: Desarrollar endpoints para gestión de contenido y progreso
4. **Videollamadas**: Integrar servicio de videoconferencia (Zoom, Meet, etc.)
5. **Pagos**: Implementar gateway de pagos para suscripciones
6. **Notificaciones**: Sistema de recordatorios y alertas
7. **Analytics**: Tracking de uso y progreso para insights del psicólogo
8. **PWA**: Convertir en Progressive Web App para móviles

---

**Contacto**: Esta es una demo técnica que muestra las capacidades de desarrollo full-stack con tecnologías modernas.