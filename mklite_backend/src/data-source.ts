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
<<<<<<< HEAD
    synchronize:true,
=======
    synchronize: true,
>>>>>>> 3ad57b5a67ec0118e1fc33113fffd58da8009248

 
    entities: [join(__dirname, '**', '*.entity{.js,.ts}')],
    migrations: [join(__dirname, '../database/migrations/*{.js,.ts}')],
    
    logging: true,
    subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
