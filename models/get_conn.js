const { MongoClient } = require("mongodb");
require("dotenv").config();

class DBConnection {
  constructor() {
    this.db = null;
    this.uri = process.env.MONGODB_URI;
  }

  async connect() {
    try {
      this.db = await MongoClient.connect(this.uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  async get() {
    try {
      if (this.db !== null) {
        console.log("Directly returning existing connection");
        return this.db;
      } else {
        await this.connect();
        console.log("Returning new connection")
        return this.db;
      }
    } catch (error) {
      console.error("Error getting MongoDB connection:", error);
      throw error;
    }
  }
}

module.exports = new DBConnection();