import { LOG_DIR } from '@const/default';
import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isDevelopment = process.env.NODE_ENV !== 'development';

class LoggerInstance {
  // Singleton instance
  private static instance: LoggerInstance;
  private logger: winston.Logger;

  private constructor() {
    // Ensure the log directory exists
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  }

  /**
   * Initialize the logger with transports and format
   * @returns {void}
   */
  private initialize(): void {
    this.logger = winston.createLogger({
      level: isDevelopment ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}${
            Object.keys(metadata).length ? ' '+JSON.stringify(metadata, null, 2) : ''
          }`;
        })
      ),
      transports: this.initTransports(),
    });
  }

  /**
   * Initialize transports for the logger
   * @returns {winston.transport[]}
   */
  private initTransports(): winston.transport[] {
    const transports: winston.transport[] = [
      new DailyRotateFile({
        filename: `${LOG_DIR}/%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '14d',
      }),
      new DailyRotateFile({
        filename: `${LOG_DIR}/%DATE%-error.log`,
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        zippedArchive: true,
        maxFiles: '14d',
      }),
    ];

    if (isDevelopment) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
          ),
        })
      );
    }

    return transports;
  }

  public static getInstance(): LoggerInstance {
    if (!LoggerInstance.instance) {
      LoggerInstance.instance = new LoggerInstance();
      LoggerInstance.instance.initialize();
    }
    return LoggerInstance.instance;
  }

  public logInfo(message: string, metadata?: Record<string, any>): void {
    this.logger.info(message, metadata || {});
  }

  public logError(message: string, error?: Error, metadata?: Record<string, any>): void {
    const combinedMetadata = {
      ...(metadata || {}),
      ...(error ? {
        errorMessage: error.message,
        stack: error.stack
      } : {})
    };
    this.logger.error(message, combinedMetadata);
  }

  public logWarning(message: string, metadata?: Record<string, any>): void {
    this.logger.warn(message, metadata || {});
  }

  public logDebug(message: string, metadata?: Record<string, any>): void {
    this.logger.debug(message, metadata || {});
  }

  public logHttp(req: any, res: any, responseTime?: number): void {
    this.logger.http(`${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      userAgent: req.headers['user-agent']
    });
  }
}

const Logger = LoggerInstance.getInstance();
export default Logger;
