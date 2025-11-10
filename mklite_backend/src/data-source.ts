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


    entities: [join(process.cwd(), 'src', 'entity', '**', '*.entity{.ts,.js}')],


    migrations: [join(process.cwd(), '..', 'database', 'migrations', '**', '*.ts')],
    
    // ==========================================================
    
    logging: true,
    subscribers: [],
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;