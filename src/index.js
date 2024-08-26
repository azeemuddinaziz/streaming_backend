import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import app from "./app.js";

dotenv.config({ path: "./src" });

connectDB()
  .then(() => {
    app,
      on("Error", (error) => {
        console.log("MongoDB connection error at express: ", error);
      });

    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `Server is running on http://localhost:${process.env.PORT || 8000}`
      );
    });
  })
  .catch((error) => {
    console.log("MonogDB conenction FAILED: ", error);
  });
