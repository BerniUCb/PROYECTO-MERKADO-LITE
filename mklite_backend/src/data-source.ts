import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Cargar las variables del .env
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    // Usamos las variables que acabamos de poner en el .env
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    // --- ESTO ES CRÍTICO PARA NEON ---
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    // --------------------------------

    synchronize: false, 
    logging: true,
    entities: [join(__dirname, '**', '*.entity{.ts,.js}'), join(__dirname, '**', '*.view{.ts,.js}')],
    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
    subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;