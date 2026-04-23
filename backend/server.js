require('dotenv').config()
// Force restart
const express = require("express");
const http = require("http");
const path = require('path');
const config = require("./config/config");
const dbConnection = require("./config/dbAdv");
const logger = require("./utils/logger");

const { setupMiddleware } = require("./middlewares/setup");
const routes = require("./routes");
const BaseController = require("./controllers/BaseController");

class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = config.PORT;
  }

  async initialize() {
    try {
      await dbConnection.connect();
      
      // Setup Middleware
      setupMiddleware(this.app);

      // Serve static upload files
      this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

      // Setup Routes
      this.app.use("/api", routes);

      // Global Error Handler
      const { ResponseFormatter } = require("./utils/response");
      this.app.use((err, req, res, next) => {
        logger.error(`Error: ${err.message}`, { stack: err.stack });
        return ResponseFormatter.error(res, err);
      });


      logger.info("Server initialized successfully");
    } catch (error) {
      logger.error("server initialization failed:", error);
      process.exit(1);
    }
  }

  async start(){
    await this.initialize();

    this.server.listen(this.port, async () =>{
        logger.info(`Server running in ${config.NODE_ENV} mode on port ${this.port}`)
    })
  }
}

const appServer = new Server();
appServer.start();

module.exports = appServer.app;
