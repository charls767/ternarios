# 📊 Diagrama Ternario - Herramienta Interactiva

Una aplicación web moderna para crear, visualizar y analizar diagramas ternarios con soporte para múltiples series de datos.

![Diagrama Ternario](https://img.shields.io/badge/Flask-3.0-blue?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-orange?style=flat-square)

## ✨ Características

### 📈 Diagramas Ternarios
- Visualización interactiva de diagramas ternarios
- Grilla configurable con escala de porcentajes (0%-100%)
- Etiquetas personalizables en los ejes

### 🎯 Gestión de Puntos
- Agregar múltiples puntos con valores (A, B, C)
- Validación automática de valores (A + B + C = escala)
- Customización visual: color, tamaño y marcador
- Tabla interactiva de puntos con opción de eliminar

### 📑 Múltiples Series
- Crear series independientes de datos
- Cada serie tiene su propio color automático
- Conexión de puntos solo dentro de la misma serie
- Identificación clara en la tabla

### 🔗 Conexión de Puntos
- Opción para conectar puntos en líneas
- Control de estilos: continua, discontinua, punteada, guión-punto
- Colores y grosor personalizables
- Las líneas solo conectan puntos de la misma serie

### 💾 Exportación Múltiple
- **PNG**: Descarga sin pérdida de calidad
- **JPG**: Formato comprimido para compartir
- **PDF**: Documento profesional con metadatos
- Nombres de archivo automáticos con fecha

## 🚀 Inicio Rápido

### Requisitos Previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Git

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/ternarios.git
cd ternarios
```

2. **Crear un entorno virtual** (opcional pero recomendado)
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Ejecutar la aplicación**
```bash
python app.py
```

5. **Abrir en el navegador**
```
http://127.0.0.1:5000
```

## 📖 Guía de Uso

### Crear un Diagrama Básico

1. **Configurar Ejes**
   - Ve a la sección "General"
   - Ajusta la escala (por defecto 100)
   - Personaliza los nombres de los ejes (A, B, C)

2. **Agregar Puntos**
   - Selecciona una serie (o crea una nueva)
   - Ingresa valores A, B, C que sumen la escala
   - Selecciona color, tamaño y marcador
   - Haz clic en "Añadir punto"

3. **Conectar Puntos**
   - Marca "Conectar puntos" en la sección de Líneas
   - Solo se conectarán puntos de la misma serie
   - Personaliza color, grosor y estilo

4. **Exportar**
   - Elige formato: PNG, JPG o PDF
   - El archivo se descargará automáticamente

### Trabajar con Múltiples Series

1. **Crear Nueva Serie**
   - Escribe el nombre en "Nueva serie"
   - Haz clic en el botón "+"
   - La serie aparecerá en el dropdown

2. **Agregar Puntos a Diferentes Series**
   - Selecciona una serie del dropdown
   - Añade puntos (se asignarán automáticamente)
   - Cambia de serie y repite

3. **Visualización**
   - Cada serie tiene su propio color
   - Los puntos se conectan solo dentro de su serie
   - La tabla muestra la serie de cada punto

## 🏗️ Estructura del Proyecto

```
ternarios/
├── app.py                 # Backend Flask
├── requirements.txt       # Dependencias Python
├── vercel.json           # Configuración Vercel
├── .gitignore            # Archivos ignorados por Git
├── README.md             # Este archivo
├── static/
│   ├── scripts.js        # JavaScript frontend
│   └── style.css         # Estilos CSS
└── templates/
    └── index.html        # Página principal HTML
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Flask**: Framework web minimalista
- **Matplotlib**: Generación de gráficos
- **python-ternary**: Diagramas ternarios
- **Pillow**: Procesamiento de imágenes
- **ReportLab**: Generación de PDFs

### Frontend
- **HTML5**: Estructura
- **CSS3**: Estilos responsive
- **Vanilla JavaScript**: Interactividad sin dependencias

## 📦 Despliegue en Vercel

### Pasos para Desplegar

1. **Conectar GitHub a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta GitHub
   - Haz clic en "New Project"
   - Selecciona el repositorio `ternarios`

2. **Configurar Proyecto**
   - Framework: Otros
   - Root Directory: ./
   - Build Command: `pip install -r requirements.txt`
   - Output Directory: Dejar en blanco
   - Environment Variables: No necesarias

3. **Desplegar**
   - Haz clic en "Deploy"
   - Espera a que se complete el despliegue
   - Tu aplicación estará disponible en: `https://ternarios.vercel.app`

## 📝 Variables de Entorno

No se requieren variables de entorno para funcionar. Todos los valores son configurables desde la interfaz.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 👤 Autor

Creado con ❤️ para análisis de datos ternarios.

## 🐛 Reportar Bugs

¿Encontraste un bug? Por favor, crea un issue en el repositorio.

## 💡 Sugerencias de Mejora

¿Tienes una idea para mejorar la aplicación? Abre un issue con la etiqueta `enhancement`.

## 📞 Contacto

Para preguntas o comentarios, abre un issue o contáctame directamente.

---

**Hecho con 🎨 y 📊**
