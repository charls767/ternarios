# 🚀 Guía: Subir a GitHub y Desplegar en Vercel

## Paso 1: Crear Repositorio en GitHub

1. **Accede a GitHub**
   - Ve a https://github.com
   - Inicia sesión con tu cuenta (usuario: `charls767`)

2. **Crear nuevo repositorio**
   - Haz clic en el "+" en la esquina superior derecha
   - Selecciona "New repository"
   - Nombre del repositorio: `ternarios` (o el que prefieras)
   - Descripción: "Herramienta interactiva para crear diagramas ternarios"
   - Privado o Público: Según prefieras
   - **NO** inicialices con README (ya tenemos uno)
   - Haz clic en "Create repository"

3. **Copiar la URL del repositorio**
   - Se verá algo como: `https://github.com/charls767/ternarios.git`

## Paso 2: Subir Código a GitHub

Ejecuta estos comandos en la terminal dentro del directorio del proyecto:

```bash
# Navegar al directorio del proyecto
cd c:\Users\USER\Desktop\Ternarios

# Agregar el remote de GitHub
git remote add origin https://github.com/charls767/ternarios.git

# Cambiar rama principal a main (opcional pero recomendado)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

**Notas:**
- Si te pide autenticación, usa GitHub CLI o crea un Personal Access Token
- En Windows, puedes usar GitHub Desktop si prefieres interfaz gráfica

## Paso 3: Desplegar en Vercel

### Opción A: Despliegue Automático (Recomendado)

1. **Accede a Vercel**
   - Ve a https://vercel.com
   - Inicia sesión o crea cuenta
   - Si es la primera vez, autoriza el acceso a GitHub

2. **Crear nuevo proyecto**
   - Haz clic en "New Project"
   - Busca tu repositorio `ternarios`
   - Haz clic en "Import"

3. **Configurar proyecto**
   - **Project Name**: `ternarios` (o el que prefieras)
   - **Framework Preset**: Selecciona "Other"
   - **Root Directory**: `./` (por defecto)
   - **Build Command**: Dejar como está (tomará de vercel.json)
   - **Output Directory**: Dejar en blanco
   - **Environment Variables**: Sin variables necesarias

4. **Desplegar**
   - Haz clic en "Deploy"
   - Espera a que se complete (2-5 minutos)
   - Tu aplicación estará disponible en una URL como:
     `https://ternarios.vercel.app`

### Opción B: Despliegue Manual con Vercel CLI

```bash
# Instalar Vercel CLI (una sola vez)
npm install -g vercel

# Desde el directorio del proyecto
cd c:\Users\USER\Desktop\Ternarios

# Desplegar
vercel

# Sigue las instrucciones interactivas
```

## Paso 4: Actualizaciones Futuras

Después de hacer cambios locales:

```bash
# Desde el directorio del proyecto
cd c:\Users\USER\Desktop\Ternarios

# Hacer cambios en los archivos...

# Agregar cambios a Git
git add .

# Crear commit con mensaje descriptivo
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push origin main
```

**Nota**: Vercel automáticamente detectará los cambios en GitHub y redeployará la aplicación.

## Comandos Útiles de Git

```bash
# Ver estado actual
git status

# Ver commits anteriores
git log

# Ver cambios no guardados
git diff

# Deshacer cambios de un archivo
git checkout -- nombre-archivo

# Ver branches
git branch -a

# Crear nueva rama
git checkout -b nombre-rama

# Cambiar entre ramas
git checkout nombre-rama
```

## Solución de Problemas

### Error: "git not found"
- Descarga Git desde: https://git-scm.com/download/win
- Reinstala y reinicia la terminal

### Error: "Repository not found"
- Verifica que la URL de GitHub sea correcta
- Verifica que tengas permisos en el repositorio
- Si es privado, asegúrate de estar autenticado

### Vercel: Error de Build
- Revisa los logs en Vercel (build logs)
- Verifica que `requirements.txt` tenga todas las dependencias
- Comprueba que `app.py` está en el directorio raíz

### La aplicación está lenta o los gráficos tardan
- Es normal en Vercel (servidor de bajo costo)
- Considera actualizar plan de Vercel para mejor rendimiento

## URLs Importantes

- GitHub: https://github.com/charls767/ternarios
- Vercel: https://ternarios.vercel.app (después del deploy)
- Docs Vercel: https://vercel.com/docs
- Docs Git: https://git-scm.com/doc

## ✅ Checklist Final

- [ ] Repositorio Git inicializado localmente
- [ ] Archivos agregados y commit realizado
- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Despliegue completado
- [ ] URL de Vercel funcionando
- [ ] Diagrama ternario cargando correctamente en Vercel

¡Listo! Tu aplicación de diagramas ternarios está en línea. 🎉
