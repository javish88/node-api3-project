// code away!
// type: npm i express <------- to install the express library
// to run the server type: npm run server <----- this is the command to run server
// to solve the sqlite3 error just do npm i sqlite3

const server = require('./server.js');

server.listen(5000, () => {
  console.log('\n* Server Running on http://localhost:5000 *\n');
});