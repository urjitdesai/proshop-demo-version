const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const { notFound } = require("./middleware/errorMiddleware");
const morgan = require("morgan");
//const errorHandler= require('./middleware/errorMiddleware')
connectDB();
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/uploads", express.static("uploads"));
//app.use("/uploads",express.static(path.join(dirname,'/uploads')))
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);
// app.use((req,res,next) => {
//     console.log("NOT FOUND ERROR HANDLER CALLED");
//     const error= new Error(`Not Found - ${req.originalUrl}`)
//     res.status(404)
//     next(error)
// })

// ERROR MIDDLEWARE
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const dirname = path.resolve();
console.log(process.env.NODE_ENV);
app.use("/uploads", express.static(path.join(dirname, "/uploads")));
if (process.env.NODE_ENV === "production") {
  console.log("production mode running");
  app.use(express.static(path.join(dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    console.log("HERE");
    res.send("API is running...");
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on ${PORT}`));
