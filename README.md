# PROYECTO MERKADO LITE

Aplicación web para la gestión de compras y ventas en un mercado local.  
El proyecto está dividido en Frontend, Backend y Base de Datos.

---

## 🧱 Tecnologías
- **Frontend:** Next.js
- **Backend:** NestJS + TypeORM
- **Base de Datos:** MySQL
- **Lenguajes:** JavaScript / TypeScript / HTML / CSS
- **Control de Versiones:** Git + GitHub
- **Entorno de Desarrollo:** Docker (Compose)
- **Deploy:** Railway (Gratuito)

---

## 📁 Estructura del Proyecto

PROYECTO-MERKADO-LITE/
├─ apps/
│ ├─ backend/ # API (NestJS + TypeORM)
│ └─ web/ # Frontend (Next.js)
├─ infra/
│ └─ compose/ # Configuración docker-compose
├─ db/
│ ├─ migrations/ # Scripts de cambios en la BD (DBA)
│ └─ seed/ # Datos iniciales (DBA)
├─ .env.example # Variables de entorno base
└─ README.md


## 🔌 Conexiones del Sistema

| Componente | Se comunica con | Cómo | Nota |
|-----------|----------------|------|------|
| Frontend (Next.js) | Backend (NestJS) | HTTP/REST | ✅
| Backend (NestJS) | MySQL | TypeORM | ✅
| Frontend → BD | ❌ | No directo | Correcto
