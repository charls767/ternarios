## 📋 INSTRUCCIONES PARA SUBIR A GITHUB Y VERCEL

Tu proyecto local ya está configurado con Git. Sigue estos pasos:

### ✅ Lo que ya hemos hecho:
- ✓ Inicializado repositorio Git local
- ✓ Creado archivo `.gitignore`
- ✓ Creado `requirements.txt` con todas las dependencias
- ✓ Configurado `vercel.json` para despliegue
- ✓ Primer commit realizado

### 📤 PASO 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Inicia sesión si es necesario
3. Completa el formulario:
   - **Repository name**: `ternarios`
   - **Description**: `Herramienta interactiva para crear diagramas ternarios`
   - **Public** o **Private**: Tu preferencia
   - **NO** inicialices con README, .gitignore o LICENSE
4. Haz clic en "Create repository"

### 🔗 PASO 2: Conectar Repositorio Local a GitHub

Copia y ejecuta en PowerShell (en el directorio del proyecto):

```powershell
cd C:\Users\USER\Desktop\Ternarios

git remote add origin https://github.com/charls767/ternarios.git
git branch -M main
git push -u origin main
```

**Nota**: Si te pide autenticación:
- Opción 1: Usa GitHub CLI (`gh auth login`)
- Opción 2: Crea un Personal Access Token en GitHub Settings
- Opción 3: Usa GitHub Desktop

### 🚀 PASO 3: Desplegar en Vercel

1. Accede a https://vercel.com
2. Si no tienes cuenta, crea una (puedes usar GitHub para SSO)
3. Haz clic en "New Project"
4. Selecciona "Import Git Repository"
5. Busca y selecciona tu repositorio `ternarios`
6. Haz clic en "Import"
7. En la configuración:
   - Framework: Mantén los valores por defecto
   - Build Command: Se tomará de `vercel.json`
   - Output Directory: Dejar en blanco
8. Haz clic en "Deploy"
9. ¡Espera a que se complete el despliegue! (2-5 minutos)

### ✨ ¡LISTO!

Tu aplicación estará disponible en:
- **GitHub**: https://github.com/charls767/ternarios
- **Vercel**: https://ternarios.vercel.app (o la URL que Vercel asigne)

### 🔄 Actualizaciones Futuras

Cada vez que quieras actualizar:

```powershell
# Haz cambios en los archivos...

# Agregar cambios
git add .

# Crear commit
git commit -m "Descripción de cambios"

# Subir a GitHub
git push origin main

# Vercel automáticamente redeployará
```

### 📚 Recursos Útiles

- Documentación de Git: https://git-scm.com/doc
- Documentación de Vercel: https://vercel.com/docs
- Guía completa: Ver archivo `DEPLOYMENT.md`

---

¿Necesitas ayuda con algún paso? Consulta `DEPLOYMENT.md` para más detalles.
