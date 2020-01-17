const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");
const db = require("./users/userDb");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(logger);
server.use("/users", userRouter);
server.use("/users/:id/posts", postRouter);

server.get("/", (req, res) => {
  const message = process.env.MSG || "Hello World";

  db.get(req.query)
    .then(users => {
      res.status(200).json({ message, users });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error getting the users" });
    });
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next();
}

module.exports = server;
