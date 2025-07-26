# 🔧 Analizador de Cotizaciones

Sistema profesional de análisis y gestión de cotizaciones desarrollado con React y TypeScript.

## 🚀 Características

- **📊 Análisis completo**: Estadísticas detalladas y visualización de datos
- **🔍 Filtros avanzados**: Búsqueda por proveedor, marca, tipo, modelo y más
- **📱 Diseño responsivo**: Optimizado para desktop y móvil
- **🌙 Modo oscuro**: Interfaz adaptable para mejor experiencia
- **📋 Vista dual**: Tabla detallada y tarjetas visuales
- **🔗 Integración Google Sheets**: Datos en tiempo real

## 🌐 Embedding / Iframe

La aplicación está configurada para ser embebida en otras páginas web usando iframe.

### 📋 Código básico:

```html
<iframe 
    src="https://frolicking-fox-f0ca05.netlify.app"
    width="100%" 
    height="800"
    frameborder="0"
    title="Analizador de Cotizaciones">
</iframe>
```

### 🎯 Ejemplo completo:

Visita `/embed-example.html` para ver un ejemplo completo de integración.

### 📐 Tamaños recomendados:

- **Mínimo**: 800x600px
- **Recomendado**: 100% x 800px
- **Completo**: 100% x 1000px

### ⚙️ Configuración de seguridad:

La aplicación incluye las siguientes configuraciones para embedding:

- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors 'self' *;`

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📦 Despliegue

La aplicación está configurada para Netlify con:

- Funciones serverless para Google Sheets
- Configuración automática de headers de seguridad
- Soporte completo para embedding

## 🔗 Enlaces

- **Aplicación**: https://frolicking-fox-f0ca05.netlify.app
- **Ejemplo de Embedding**: https://frolicking-fox-f0ca05.netlify.app/embed-example.html

## 📄 Licencia

MIT License - Desarrollado con ❤️ usando React y TypeScript