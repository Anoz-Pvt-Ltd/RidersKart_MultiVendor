import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "32kb" })); // For JSON format
app.use(express.text({ type: "text/*", limit: "32kb" })); // For plain text format
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//print function to ensure every step is executed
app.use((req, res, next) => {
  console.log(`Received ${req.method} request with body:`, req.body);
  console.log(`Received ${req.method} request with params:`, req.params);
  next();
});

// routers
import vendorRouter from "./routes/vendor.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";

//vendor routes
app.use("/api/v1/vendor", vendorRouter);

//product routes
app.use("/api/v1/products", productRouter);

//orders routes
app.use("/api/v1/orders", orderRouter);

export { app };
