# 📋 Instrucciones para Actualizar el Proyecto

## 🎯 Resumen de Cambios

Este update incluye mejoras importantes en el manejo de imágenes de productos:

### 🔍 Problema Original

**¿Por qué no se veían las imágenes en el frontend?**

1. **URLs vacías en la base de datos**: Los productos tenían `image_url = NULL` o URLs inválidas
2. **Next.js bloqueaba imágenes remotas**: Por seguridad, Next.js no permite cargar imágenes de dominios externos sin configuración
3. **Falta de configuración en `next.config.ts`**: No había `remotePatterns` configurado para permitir dominios externos

**Solución aplicada:**
- ✅ Actualización masiva de URLs en la base de datos con URLs reales
- ✅ Configuración de `next.config.ts` para permitir imágenes remotas
- ✅ Script de restauración para mantener las URLs actualizadas

### ✅ Cambios Realizados

1. **Imágenes de Productos Actualizadas**
   - ❌ **ANTES**: URLs de IA generadas (Pollinations.ai) - tardaban mucho en cargar
   - ✅ **AHORA**: URLs reales de productos (amarket.com.bo, pilandina.com.bo) - carga rápida
   - **116 productos** actualizados con URLs reales

2. **Migración de Base de Datos**
   - Migración `1764254883023-UpdateAllProductImages.ts` actualizada
   - Migración `1765845168957-AddDriverToNotificationEnum.ts` corregida (evita errores de duplicados)

3. **Configuración Frontend**
   - `next.config.ts` configurado para permitir imágenes remotas (`remotePatterns`)

4. **Script de Restauración**
   - Script organizado en `src/database/restaurar-imagenes-reales.ts` (ubicación correcta)

---

## 🚀 Instrucciones para el Equipo

### Paso 1: Actualizar el Código desde GitHub

```bash
# Asegúrate de estar en la rama main
git checkout main

# Traer los últimos cambios
git pull origin main
```

### Paso 2: Instalar Dependencias (si es necesario)

**Backend:**
```bash
cd mklite_backend
npm install
```

**Frontend:**
```bash
cd mklite_frontend
npm install
```

### Paso 3: Ejecutar Migraciones

```bash
# Desde mklite_backend
cd mklite_backend
npm run migration:run
```

**Nota**: Si ya ejecutaste las migraciones antes, este paso puede mostrar "No migrations are pending". Eso está bien.

### Paso 4: Actualizar Imágenes en la Base de Datos

Si necesitas restaurar las imágenes con URLs reales, ejecuta:

```bash
# Desde mklite_backend
cd mklite_backend
npx ts-node -r tsconfig-paths/register src/database/restaurar-imagenes-reales.ts
```

Este script actualizará todas las imágenes de productos con URLs reales.

### Paso 5: Levantar los Servicios

**Backend:**
```bash
cd mklite_backend
npm run start:dev
```

**Frontend (en otra terminal):**
```bash
cd mklite_frontend
npm run dev
```

---

## 📁 Archivos Modificados

### Backend
- ✅ `src/database/migrations/1764254883023-UpdateAllProductImages.ts` - Migración con URLs reales
- ✅ `src/database/migrations/1765845168957-AddDriverToNotificationEnum.ts` - Corregida para evitar duplicados
- ✅ `src/database/restaurar-imagenes-reales.ts` - Script para restaurar imágenes manualmente (ubicado en database/)

### Frontend
- ✅ `next.config.ts` - Configurado para permitir imágenes remotas

---

## 🔍 Verificación

Después de actualizar, verifica que:

1. ✅ Las migraciones se ejecutaron sin errores
2. ✅ Las imágenes se cargan rápidamente en el frontend
3. ✅ No hay errores en la consola del navegador
4. ✅ Los productos muestran imágenes reales (no placeholders)

---

## ❓ Problemas Comunes

### Error: "enum label already exists"
**Solución**: La migración ya está corregida. Si aún aparece, ejecuta:
```bash
npm run migration:run
```

### Las imágenes no se muestran
**Solución**: 
1. Verifica que ejecutaste el script de restauración
2. Revisa la consola del navegador para errores de CORS
3. Asegúrate de que `next.config.ts` tiene la configuración correcta

### Script no encuentra el archivo
**Solución**: Asegúrate de ejecutar desde la raíz de `mklite_backend`:
```bash
cd mklite_backend
npx ts-node -r tsconfig-paths/register src/database/restaurar-imagenes-reales.ts
```

---

## 📝 Notas Importantes

- ⚠️ **No se necesitan imágenes de IA**: El código de generación de IA fue removido. Ahora usamos solo URLs reales.
- ✅ **Script reutilizable**: Puedes ejecutar `restaurar-imagenes-reales.ts` cuantas veces necesites.
- 🔄 **Migraciones idempotentes**: Las migraciones están diseñadas para ejecutarse múltiples veces sin errores.

---

## 👥 Para el Equipo

Si tienes dudas o problemas:
1. Revisa este documento primero
2. Verifica que seguiste todos los pasos
3. Consulta los logs de error en la consola
4. Contacta al equipo si el problema persiste

---

**Última actualización**: Diciembre 2025  
**Rama**: `main` (después del merge)

