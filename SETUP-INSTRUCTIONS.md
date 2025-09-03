# 📋 Configuración de GitHub Pages - Paso a Paso

## 🆕 **1. Crear Repositorio en GitHub**

1. **Ir a**: [https://github.com/new](https://github.com/new)

2. **Configurar repositorio**:
   ```
   Repository name: BostonTracker-Demo
   Description: 🔴 Interactive demo of Boston Tracker delivery dashboard - Live preview of admin interface with real-time tracking, user management, and responsive design
   ```

3. **Configuración importante**:
   - ✅ **Public** (obligatorio para GitHub Pages gratuito)
   - ❌ **NO marcar** "Add a README file"
   - ❌ **NO añadir** .gitignore
   - ❌ **NO elegir** license

4. **Click** `Create repository`

---

## 🔗 **2. Conectar y Subir Demo**

### **Comandos a ejecutar:**
```bash
# Ir al directorio de la demo
cd /tmp/BostonTracker-Demo

# Conectar con el nuevo repositorio
git remote add origin https://github.com/Scribax/BostonTracker-Demo.git

# Subir todos los archivos
git push -u origin main
```

---

## ⚙️ **3. Activar GitHub Pages**

1. **Ir al repositorio**: `https://github.com/Scribax/BostonTracker-Demo`

2. **Settings** ⚙️ (tab superior derecho)

3. **Pages** (sidebar izquierdo, scroll hacia abajo)

4. **Configurar GitHub Pages**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`  
   - **Folder**: `/ (root)`
   - **Click**: `Save` 💾

---

## 🌟 **4. ¡Demo Lista!**

### **Tu demo estará disponible en:**
```
https://scribax.github.io/BostonTracker-Demo/
```

**⏰ Tiempo de procesamiento**: 2-5 minutos después de activar GitHub Pages

---

## 🔒 **5. Configuración Final de Repositorios**

### **Repositorio Principal** (`BostonTracker`)
- 🔒 **Puedes hacerlo PRIVADO** si quieres
- 💻 **Contiene**: Código completo del proyecto
- 🎯 **Propósito**: Desarrollo y código fuente

### **Repositorio Demo** (`BostonTracker-Demo`)
- 🌐 **Debe ser PÚBLICO** (para GitHub Pages gratuito)
- 🎨 **Contiene**: Solo archivos de la demo
- 🎯 **Propósito**: Presentación y portfolio

---

## ✅ **Verificar que Todo Funcione**

1. **Demo accesible**: URL funciona en navegador
2. **Mapa carga**: Se muestra Boston con marcadores
3. **Tabs funcionan**: Puedes navegar entre secciones
4. **Responsive**: Funciona en móvil y desktop
5. **Animaciones**: Efectos hover y transiciones fluidas

---

## 🔧 **Solución de Problemas**

### **Si GitHub Pages no se activa:**
- Verificar que el repo sea **público**
- Confirmar que `index.html` esté en root
- Esperar 10 minutos para procesamiento inicial

### **Si el mapa no carga:**
- Verificar conexión a internet
- Los tiles de OpenStreetMap requieren conexión online

### **Si las animaciones no funcionan:**
- Probar en navegador moderno (Chrome, Firefox, Safari)
- Verificar que JavaScript esté habilitado

---

## 📞 **Soporte**

Si tienes problemas con la configuración:
- 📧 **Email**: franco@bostonburgers.com
- 🐙 **GitHub**: [@Scribax](https://github.com/Scribax)

---

**🎯 ¡Listo! Siguiendo estos pasos tendrás tu demo online en minutos!**
