#!/bin/bash

# --- CONFIGURACIÓN ---
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 1. Detectar dónde estamos (la carpeta del script)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# 2. Definir dónde guardar los backups (Subimos 2 niveles y entramos a 'backups')
# Esto apunta a PROYECTO-MERKADO-LITE/backups
BACKUP_DIR="$SCRIPT_DIR/../../backups"

# Crear la carpeta de backups si no existe
mkdir -p "$BACKUP_DIR"

FILENAME="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
DB_NAME="merkadolite_db"
DB_USER="merkado_admin"
export PGPASSWORD="merkado_pass" 

# --- EJECUCIÓN ---
echo "🚀 Iniciando backup de $DB_NAME..."

if pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > "$FILENAME"; then
    echo "✅ Backup creado: $FILENAME"
else
    echo "❌ Error al crear el backup"
    exit 1
fi

# --- LIMPIEZA (7 días) ---
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
echo "🏁 Listo."
