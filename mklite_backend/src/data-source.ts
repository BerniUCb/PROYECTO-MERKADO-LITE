// src/data-source.ts

import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: '172.28.241.32',
    port: 5433,
    username: 'merkado_admin',
    password: 'app',
    database: 'merkado_lite_db',
    synchronize: false,

 
    entities: [join(__dirname, '**', '*.entity{.js,.ts}')],
    migrations: [join(__dirname, '../database/migrations/*{.js,.ts}')],
    
    logging: true,
    subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;