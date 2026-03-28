import mongoose from "mongoose";
import config from "./index.js";
import logger from "./logger.js";

/**
 * This module defines a MongoDBConnection class that manages the connection to a MongoDB database using Mongoose. The class has methods to connect and disconnect from the database. The connection details (URI and database name) are retrieved from the configuration defined in the index.js file. The connectToMongoDB function is exported for use in other parts of the application to establish a connection to MongoDB when needed.
 *
 * Singleton Pattern: The MongoDBConnection class is implemented as a singleton to ensure that only one instance of the connection exists throughout the application. This prevents multiple connections from being created, which can lead to resource exhaustion and performance issues.
 */

// MongoDB Database manager/connector
class MongoDBConnection {
  constructor() {
    this.connection = null;
  }

  /**
   * Connect to MongoDB
   * @returns {Promise<mongoose.Connection>} The MongoDB connection instance
   * @throws {Error} If there is an error connecting to MongoDB
   */
  async connect() {
    if (this.connection) {
      logger.info("MongoDB already connected");
      return this.connection;
    }
    try {
      this.connection = await mongoose.connect(config.mongo.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: config.mongo.dbName,
      });

      logger.info(`Connected to MongoDB successfully at ${config.mongo.uri}`);

      this.connection.on("error", (err) => {
        logger.error("MongoDB connection error:", err);
      });

      this.connection.on("disconnected", () => {
        logger.warn("MongoDB connection lost");
      });

      return this.connection;
    } catch (error) {
      logger.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.connection) {
      return;
    }
    try {
      await mongoose.disconnect();
      this.connection = null;
      logger.info(
        `Disconnected from MongoDB successfully at ${config.mongo.uri}`,
      );
    } catch (error) {
      logger.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }

  /**
   * Get the MongoDB connection instance
   * @returns {mongoose.Connection} The MongoDB connection instance
   * @throws {Error} If the MongoDB connection is not established
   */
  getConnection() {
    if (!this.connection) {
      throw new Error("MongoDB connection not established");
    }
    return this.connection;
  }
}

const mongoDBConnection = new MongoDBConnection();

async function connectToMongoDB() {
  return await mongoDBConnection.connect();
}

export default connectToMongoDB;
