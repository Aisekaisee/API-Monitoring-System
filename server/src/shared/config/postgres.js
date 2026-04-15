import pg from "pg";
import config from "./index.js";
import logger from "./logger.js";
import { log } from "winston";

const { Pool } = pg;

/**
 * This module defines a PostgresConnection class that manages the connection to a PostgreSQL database using the pg library.
 *
 * Singleton Pattern: The PostgresConnection class is implemented as a singleton to ensure that only one instance of the connection pool exists throughout the application. This prevents multiple pools from being created, which can lead to resource exhaustion and performance issues.
 */
class PostgresConnection {
  constructor() {
    this.pool = null;
  }

  /**
   * Get the PostgreSQL connection pool. If the pool does not exist, it will be created.
   * @returns {Pool} The PostgreSQL connection pool
   * @throws {Error} If there is an error creating the connection pool
   */
  getPool() {
    if (!this.pool) {
      this.pool = new Pool({
        host: config.postgres.host,
        port: config.postgres.port,
        user: config.postgres.user,
        password: config.postgres.password,
        database: config.postgres.database,
        max: 20, // maximum number of clients in the pool
        idleTimeoutMillis: 30000, // close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
      });

      this.pool.on("error", (err) => {
        logger.error("Unexpected error on idle PostgreSQL client:", err);
      });

      logger.info(
        `PostgreSQL pool created successfully for ${config.postgres.host}:${config.postgres.port}`,
      );
    }
    return this.pool;
  }

  /**
   * Test the PostgreSQL connection by executing a simple query to retrieve the current server time. This method can be used to verify that the connection to PostgreSQL is working correctly.
   * @returns {Promise<void>}
   * @throws {Error} If there is an error testing the connection
   */
  async testConnection() {
    try {
      const pool = this.getPool();
      const client = await pool.connect();
      const result = await client.query("SELECT NOW()");
      client.release();
      logger.info(
        `PostgreSQL connected successfully at ${config.postgres.host}:${config.postgres.port}, server time: ${result.rows[0].now}`,
      );
    } catch (error) {
      logger.error("PostgreSQL connection test failed:", error);
      throw error;
    }
  }

  /**
   * Execute a PostgreSQL query with the given text and parameters. This method uses the connection pool to execute the query and logs the execution time for debugging purposes.
   * @param {string} text - The SQL query text
   * @param {Array} params - The parameters for the SQL query
   * @returns {Promise<pg.QueryResult>} The result of the query execution
   * @throws {Error} If there is an error executing the query
   */
  async query(text, params) {
    const pool = this.getPool();
    const start = Date.now();
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug(
        `Executed query: ${text} with params: ${params} in ${duration}ms`,
      );
      return result;
    } catch (err) {
      logger.error("Error executing PostgreSQL query:", {
        query: text,
        params,
        error: err,
      });
      throw err;
    }
  }

  /**
   * Close the PostgreSQL connection pool. This method should be called when the application is shutting down to gracefully close all connections in the pool.
   * @returns {Promise<void>}
   * @throws {Error} If there is an error closing the connection pool
   */
  async close() {
    if (this.pool) {
      try {
        await this.pool.end();
        this.pool = null;
        logger.info(
          `PostgreSQL pool closed successfully for ${config.postgres.host}:${config.postgres.port}`,
        );
      } catch (error) {
        logger.error("Error closing PostgreSQL pool:", error);
        throw error;
      }
    }
  }
}

const postgresConnection = new PostgresConnection();

export default postgresConnection;
