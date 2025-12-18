#!/bin/bash
# Script para subir el proyecto a GitHub
# Ejecutar desde el directorio del proyecto

echo "🚀 Preparando proyecto para GitHub y Vercel..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py no encontrado. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

echo "✅ Proyecto verificado"
echo ""

# Mostrar estado actual
echo "📊 Estado actual del repositorio:"
git status
echo ""

# Instrucciones para subir a GitHub
echo "=========================================="
echo "📤 PRÓXIMOS PASOS PARA SUBIR A GITHUB"
echo "=========================================="
echo ""
echo "1. Crear repositorio en GitHub:"
echo "   - Ve a https://github.com/new"
echo "   - Nombre: ternarios"
echo "   - Descripción: Herramienta interactiva para diagramas ternarios"
echo "   - NO inicialices con README"
echo "   - Haz clic en 'Create repository'"
echo ""

echo "2. Ejecuta estos comandos:"
echo "   git remote add origin https://github.com/charls767/ternarios.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "=========================================="
echo "🚀 PASOS PARA DESPLEGAR EN VERCEL"
echo "=========================================="
echo ""
echo "1. Accede a https://vercel.com"
echo "2. Inicia sesión con GitHub"
echo "3. Haz clic en 'New Project'"
echo "4. Selecciona el repositorio 'ternarios'"
echo "5. Haz clic en 'Import'"
echo "6. Mantén la configuración por defecto"
echo "7. Haz clic en 'Deploy'"
echo ""
echo "¡Tu aplicación estará disponible en poco tiempo! 🎉"
