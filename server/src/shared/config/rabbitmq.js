import amqp from "amqplib";
import config from "./index.js";
import logger from "./logger.js";

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnecting = false;
  }

  async connect() {
    if (this.channel) {
      return this.channel;
    }

    if (this.isConnecting) {
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isConnecting) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
      return this.channel;
    }

    try {
      this.isConnecting = true;

      logger.info(`Connecting to RabbitMQ at ${config.rabbitmq.url}...`);
      this.connection = await amqp.connect(config.rabbitmq.url);
      this.channel = await this.connection.createChannel();

      // Creating key & queue names based on the configuration. This allows us to easily change the queue name and other settings through environment variables without modifying the code.
      const dlqName = `${config.rabbitmq.queue}.dlq`; //api_hits.dlq

      // DL Queue is used to store messages that could not be processed successfully. This allows us to analyze and handle failed messages separately without losing them.
      await this.channel.assertQueue(dlqName, { durable: true });

      // Normal Queue where we will publish messages related to API hits. The durable option ensures that the queue will survive a RabbitMQ server restart, providing reliability for our message processing.
      await this.channel.assertQueue(config.rabbitmq.queue, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": "", // Default exchange
          "x-dead-letter-routing-key": dlqName, // Route failed messages to the DLQ
        },
      });

      logger.info(
        `RabbitMQ connected, queue: "${config.rabbitmq.queue}" and "${dlqName}" are ready.`,
      );

      this.connection.on("close", () => {
        logger.warn("RabbitMQ connection closed");
        this.connection = null;
        this.channel = null;
      });

      this.connection.on("error", (err) => {
        logger.error("RabbitMQ connection error:", err);
        this.connection = null;
        this.channel = null;
      });

      this.isConnecting = false;
      return this.channel;
    } catch (error) {
      this.isConnecting = false;
      logger.error("Error connecting to RabbitMQ queues:", error);
      throw error;
    }
  }

  getChannel() {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel is not established. Call connect() first.",
      );
    }
    return this.channel;
  }

  getStatus() {
    if (!this.connection || !this.channel) {
      return "disconnected";
    }
    if (this.connection.closing) {
      return "closing";
    }
    return "connected";
  }

  async close(){
    try {
        if(this.channel){
            await this.channel.close();
            this.channel = null;
            logger.info("RabbitMQ channel closed successfully");
        }
        if(this.connection){
            await this.connection.close();
            this.connection = null;
            logger.info("RabbitMQ connection closed successfully");
        }
    } catch (error) {
        logger.error("Error closing RabbitMQ connection:", error);
    }
  }
}

const rabbitMQConnection = new RabbitMQConnection();

export default rabbitMQConnection;
