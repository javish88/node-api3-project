const express = require('express');

//routers
const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');

const server = express();

//server.use
server.use(express.json());
server.use(logger);

//endpoints
server.use('/api/users', userRouter);
server.use('/api/users', postRouter);//per the setup of userRouter and the MVP requirements postRouter looks like it is not required

//sanity test
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  req.requestTime = Date();
  console.log(`${req.method} to ${req.originalUrl} at ${req.requestTime}`);
  next();
}


module.exports = server;