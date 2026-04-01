require('dotenv').config()
const express = require("express");
const http = require("http");
const config = require("./config/config");
const dbConnection = require("./config/dbAdv");
const logger = require("./utils/logger");

class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = config.PORT;
  }

  async initialize() {
    try {
      await dbConnection.connect();
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

        // setTimeout(async ()=>{
        //     await runSeeders();
        // },2000)
    })
  }
}

const appServer = new Server();
appServer.start();

module.exports = appServer.app;
