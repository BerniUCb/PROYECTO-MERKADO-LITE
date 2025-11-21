// src/data-source.ts

import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'merkado_admin',
    password: 'merkado_pass',
    database: 'merkadolite_db',


    synchronize:false,



 
    entities: [join(__dirname, '**', '*.entity{.js,.ts}')],
    migrations: [join(__dirname, 'database', 'migrations', '*{.ts,.js}')],
    
    logging: true,
    subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
