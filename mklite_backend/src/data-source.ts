import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Verificamos si estamos en Neon o en Local para configurar el SSL automáticamente
const isNeon = process.env.DB_HOST?.includes('neon.tech');
const isSSL = process.env.DB_SSL === 'true' || isNeon; // Si es Neon, forzamos SSL sí o sí

console.log("==================================================");
console.log("🚀 CONECTANDO A:", process.env.DB_HOST);
console.log("🔒 SSL ACTIVADO:", isSSL);
console.log("==================================================");

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'merkado_admin',
    password: process.env.DB_PASSWORD || 'merkado_pass',
    database: process.env.DB_NAME || 'merkadolite_db',
    
    // --- AQUÍ ESTÁ LA CORRECCIÓN MÁGICA ---
    // Si detectamos Neon o DB_SSL=true, activamos la configuración que pide la nube
    ssl: isSSL ? { rejectUnauthorized: false } : false,
    // ---------------------------------------
    
    synchronize: false,
    logging: true,
    entities: [join(__dirname, '**', '*.entity{.ts,.js}'), join(__dirname, '**', '*.view{.ts,.js}')],
    migrations: [join(__dirname, 'database', 'migrations', '*{.ts,.js}')],
    subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;