import path from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import config from './config-loader';

// Database configuration options
const dbConfig: DataSourceOptions = {
  // Connection details
  type: 'postgres',
  host: config.get<string>('db.host', '127.0.0.1'),
  port: config.get<number>('db.port', 5432),
  username: config.get<string>('db.username', 'postgres'),
  password: config.get<string>('db.password', 'postgres'),
  database: config.get<string>('db.database', 'ordexa'),

  // Options
  synchronize: config.get<boolean>('db.options.synchronize', false),
  logging: config.get<boolean>('db.options.logging', false),

  // Connection pool options
  extra: {
    max: config.get<number>('db.pool.max', 10),
    min: config.get<number>('db.pool.min', 5),
    idleTimeoutMillis: config.get<number>('db.pool.idleTimeoutMillis', 30000),
    connectionTimeoutMillis: config.get<number>('db.pool.connectionTimeoutMillis', 2000),
  },

  // Paths for TypeORM entities, migrations, and subscribers
  entities: [path.join(__dirname, '..', 'src', 'entities', '*.{ts,js}')],
  migrations: [path.join(__dirname, '..', 'src', 'migrations', '*.{ts,js}')],
  subscribers: [path.join(__dirname, '..', 'src', 'subscribers', '*.{ts,js}')],
};

// Create and export the DataSource instance
export const AppDataSource = new DataSource(dbConfig);
