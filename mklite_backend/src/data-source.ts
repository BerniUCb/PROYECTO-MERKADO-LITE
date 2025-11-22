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
    synchronize: false,

 
    entities: [join(__dirname, '**', '*.entity{.js,.ts}')],
<<<<<<< HEAD
    // LÍNEA CORREGIDA Y MÁS ROBUSTA
    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
=======
    migrations: [join(__dirname, 'database', 'migrations', '*{.ts,.js}')],
>>>>>>> 38f0f8db92cd1e6c5ca1d31bd2470ee0e0488866
    
    logging: true,
    subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;