var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var creditsRouter = require("./routes/credits");
var borrowsRouter = require("./routes/borrows")
var transactionsRouter = require("./routes/transactions")

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("trust proxy", true);
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.static(path.join(__dirname, "public")));



app.use("/*", indexRouter);
app.use("/api", usersRouter, creditsRouter, borrowsRouter, transactionsRouter);
app.use(errorMiddleware);

module.exports = app;
