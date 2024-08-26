import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler.js";

dotenv.config({ path: "./src" });

asyncHandler(
  mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
);

// const connectDB = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(
//       `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
//     );
//     console.log(
//       "Connection to MongoDB successful! HOST: ",
//       connectionInstance.connection.host
//     );
//   } catch (error) {
//     console.log("MongoDB connection FAILED: ", error);
//     process.exit(1);
//   }
// };

export default connectDB;
