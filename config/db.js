const mongoose = require("mongoose");
const DB_URL = process.env.mongoURI;

mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
      await new mongoose.connect(DB_URL, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
  
      console.log("****************************");
      console.log("*    Starting Server");
      console.log(`*    Port: ${process.env.PORT || 5000}`);
      console.log(`*    NODE_ENV: ${process.env.NODE_ENV || 'Development'}`);
      console.log(`*    Database: MongoDB`);
      console.log(`*    DB Connection: OK\n****************************\n`);
    } catch (e) {
      console.log(`Error connecting to DB: ${e}`);
      process.exit(1);
    }
  };

  module.exports = connectDB;