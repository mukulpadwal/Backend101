import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectToDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_ATLAS_URI}/${DB_NAME}`
    );
    console.log(
      `Successfully connected to database : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Error while connecting to database : ${error.message}`);
    process.exit(1);
  }
}

export default connectToDB;
