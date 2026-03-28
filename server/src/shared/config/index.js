// Here we will define all the global level configuration related to our application, such as database connection strings, API keys, etc.

import dotenv from "dotenv";

dotenv.config();

const config = {
  // Server configuration
  node_env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  // MongoDB configuration
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/api_monitoring",
    dbName: process.env.MONGO_DB_NAME || "api_monitoring",
  },
  // PostgreSQL configuration
  postgres: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "api_monitoring",
  },
  // RabbitMQ configuration
  // ampq is a protocol used by RabbitMQ for messaging.
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "amqp://localhost:5672",
    queue: process.env.RABBITMQ_QUEUE || "api_hits",
    publisherConfirms:
      process.env.RABBITMQ_PUBLISHER_CONFIRMS === "true" || false,
    retryAttempts: parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS || "3", 10),
    retryDelay: parseInt(process.env.RABBITMQ_RETRY_DELAY || "1000", 10), // in milliseconds
  },

  //JSON web token configuration
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      "ba06f61621183342aab65fc03e7b29c1a0f71c1e2c301f59b12408816402f646",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  // Rate Limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || "1000", 10), // limit each IP to 1000 requests per windowMs
  },
};

export default config;
