// mongoose package which will help us connect with our mongoDB database
import mongoose from "mongoose";

// Just a constant so that we can change it at one place and it takes effect everywhere at once.
import { DB_NAME } from "../constants.js";


// THINGS TO REMEMBER WHILE CONNECTING TO THE DATABASE
// 1. Database is on another continent so it can take time to connect - always use async/await
// 2. There are always chances that some error occurs while connecting to database - always wrap your code with try/catch

async function connectToDB() {
  try {
    // connect function gives us back a connectionInstance
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_ATLAS_URI}/${DB_NAME}`
    );
    console.log(
      `Successfully connected to database : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Error while connecting to database : ${error.message}`);
    
    // The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code.
    process.exit(1);
  }
}

export default connectToDB;
