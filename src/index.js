import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";

dotenv.config({ path: "./src" });

(async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      "MongoDB connection successful, Host is: ",
      connectInstance.connection.host
    );
  } catch (error) {
    console.log("MongoDB connection FAILED: ", error);
    throw error;
  }
})();
