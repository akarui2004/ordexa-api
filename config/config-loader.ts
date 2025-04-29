import fs from 'fs';
import path from 'path';
import toml from 'toml';

// This module provides a singleton class to manage configuration settings
// for a Node.js application. It loads configuration files in TOML format
// based on the current environment (development, production, etc.) and
// allows access to the configuration values through a simple API.
type ConfigValue = string | number | boolean | object | null;
type Config = Record<string, ConfigValue>;

class ConfigLoader {
  private config: Config = {};
  private static instance: ConfigLoader;

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  private loadConfig(): void {
    const env = process.env.NODE_ENV || 'development';
    const configDir = path.resolve(__dirname);
    const configFiles = [
      path.join(configDir, 'base.toml'),
      path.join(configDir, `${env}.toml`),
      path.join(configDir, `${env}.local.toml`),
    ];

    this.config = configFiles.reduce<Config>((acc, confFile) => {
      try {
        if (fs.existsSync(confFile)) {
          const conf = toml.parse(fs.readFileSync(confFile, 'utf8'));
          return this.deepMerge(acc, conf);
        }
        return acc;
      } catch (error) {
        console.warn(`Warning: Could not load config file ${confFile}`, error);
        return acc;
      }
    }, {} as Config);
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }

  private isObject(item: any): boolean {
    return !!item && typeof item === 'object' && !Array.isArray(item);
  }

  public get<T = any>(key?: string, defaultValue?: T): T {
    if (!key) return this.config as unknown as T;

    const keys = key.split('.');
    let value: any = this.config;

    for (const k of keys) {
      if (value === undefined) return defaultValue as T;
      value = value[k];
    }

    return (value === undefined ? defaultValue : value) as T;
  }

  public getAll(): Config {
    return { ...this.config };
  }
}

const config = ConfigLoader.getInstance();
export default config;
