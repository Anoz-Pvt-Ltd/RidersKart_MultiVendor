import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server } from "./app.js";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    server.on("error", (err) => {
      console.log("ERROR", err);
    });

    server.listen(process.env.PORT || 2000, () => {
      console.log("Server is running at the post:" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection failed", err);
  });
