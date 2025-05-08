import { ENVIRONMENT } from '@const/default';
import Database from '@core/database';
import errorHandler from '@middlewares/errorHandler';
import apiRoutes from '@routes/api';
import webRoutes from '@routes/web';
import Logger from '@utils/Logger';
import RouteExplorer from '@utils/RouteExplorer';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import helmet from 'helmet';

class Bootstrap {
  private app: Application = express();
  private config = {
    webRoutePrefix: process.env.WEB_ROUTE_PREFIX || '/',
    apiRoutePrefix: process.env.API_ROUTE_PREFIX || '/api/v1/',
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN || '*'
  };

  /**
   * Start the application
   * This method initializes the application by loading environment variables,
   * configuring middlewares, setting up routes, and starting the server.
   * It also handles graceful shutdown for the database connection.
   */
  public async start(): Promise<void> {
    this.loadEnvironment();
    this.configureMiddlewares();
    this.configureRoutes();

    this.app.use(errorHandler);
    this.printRouteMap();

    await this.initializeDatabase();

    // Graceful shutdown for database connection
    await this.shutdownDatabase();

    this.app.listen(this.config.port, () => {
      Logger.logInfo(`Server running on port ${this.config.port} in ${ENVIRONMENT} mode`);
    }).on("error", (error: Error) => {
      Logger.logError("Failed to start server", error);
      process.exit(1);
    });
  }

  /**
   * Load environment variables from .env files
   * This method loads environment variables from .env files based on the current environment
   * and updates the configuration object with the loaded values.
   * It uses dotenv to load the environment variables and sets default values if not provided.
   * The order of loading is:
   * 1. .env.<ENVIRONMENT>
   * 2. .env.<ENVIRONMENT>.local
   * 3. .env.local
   * 4. .env
   * The environment variables are used to configure the web route prefix, API route prefix,
   * server port, and CORS origin.
   * The loaded values are then used to set up the application configuration.
   * @returns {void}
   * @throws {Error} If there is an error loading the environment variables
   */
  private loadEnvironment(): void {
    dotenv.config({ path: [`.env.${ENVIRONMENT}`, `.env.${ENVIRONMENT}.local`, ".env.local"] });
    // Update config with environment values after loading
    this.config = {
      webRoutePrefix: process.env.WEB_ROUTE_PREFIX || '/',
      apiRoutePrefix: process.env.API_ROUTE_PREFIX || '/api/v1/',
      port: process.env.PORT || 3000,
      corsOrigin: process.env.CORS_ORIGIN || '*'
    };
  }

  /**
   * Configure middlewares for the application
   * This method sets up CORS, security headers, JSON parsing, and static file serving
   * It also sets the maximum request body size for JSON and URL-encoded data
   * and serves static files from the 'public' directory with a cache control header
   * for one day.
   */
  private configureMiddlewares(): void {
    this.app.use(cors({
      origin: this.config.corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    }));
    this.app.use(helmet());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.app.use(express.static('public', { maxAge: '1d' }));
  }

  /**
   * Configure the routes for the application
   * This method sets up the web and API routes
   */
  private configureRoutes(): void {
    this.app.use(this.config.webRoutePrefix, webRoutes);
    this.app.use(this.config.apiRoutePrefix, apiRoutes);
  }

  /**
   * Print the route map to the console
   */
  private printRouteMap(): void {
    RouteExplorer.printRoutes([
      { router: webRoutes, prefix: this.config.webRoutePrefix },
      { router: apiRoutes, prefix: this.config.apiRoutePrefix },
    ]);
  }

  /**
   * Initialize the database connection
   */
  private async initializeDatabase(): Promise<void> {
    try {
      const db = Database.getInstance();
      await db.initialize();
      Logger.logInfo("Database connection established");
    } catch (error: any) {
      Logger.logError("Failed to initialize database connection", error);
      process.exit(1);
    }
  }

  /**
   * Close the database connection
   */
  private async destroyDatabase(): Promise<void> {
    try {
      const db = Database.getInstance();
      await db.destroy();
      Logger.logInfo("Database connection closed");
    } catch (error: any) {
      Logger.logError("Failed to close database connection", error);
    }
  }

  /**
   * Gracefully shutdown the database connection on process termination signals
   */
  private async shutdownDatabase(): Promise<void> {
    process.on('SIGTERM', async () => {
      Logger.logInfo("SIGTERM signal received: closing database connection");
      await this.destroyDatabase();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      Logger.logInfo("SIGINT signal received: closing database connection");
      await this.destroyDatabase();
      process.exit(0);
    });
  }
}

export default Bootstrap;
