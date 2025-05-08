import config from '@config/config-loader';
import path from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

class Database {
  private static instance: Database;
  private readonly dataSource: DataSource;

  private constructor() {
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
      entities: [path.join(__dirname, 'entity', '*.{ts,js}')],
      migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
      subscribers: [path.join(__dirname, 'subscribers', '*.{ts,js}')],
    };

    this.dataSource = new DataSource(dbConfig);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  public async initialize(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
    } catch (error) {
      throw new Error(`Failed to initialize database connection: ${error}`);
    }
  }

  public async destroy(): Promise<void> {
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }
    } catch (error) {
      throw new Error(`Failed to destroy database connection: ${error}`);
    }
  }
}

export default Database;
