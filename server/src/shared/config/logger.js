import winston from 'winston';
import config from './index.js';

/**
 * Winston is a versatile logging library for Node.js that allows you to log messages in various formats and transports (e.g., console, file, etc.). In this configuration, we set up Winston to log messages to both the console and files. The logging level is determined by the environment (production or development), and we include timestamps and error stack traces in the logs for better debugging and monitoring.
 */

const logger = winston.createLogger({
  level: config.node_env === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),

  defaultMeta: { service: 'api-monitoring-service' },

  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (config.node_env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;