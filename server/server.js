const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const courseRouter = require("./routes/course");

const app = express();
const port = process.env.PORT || 5170;

const corsOption = {
  origin: ["http://localhost:5173"],
  optionSuccessStatus: 200,
};

async function initialize() {
  app.use(express.static("../client/public/"));
  app.use(express.json());
  app.use(cors(corsOption));
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/courses", courseRouter);

  app.listen(port, () => {
    console.log(`Server is connected to port: ${port}`);
  });
}

async function close() {}

module.exports = {
  initialize,
  close,
};
