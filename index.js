const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!');
});

const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db", "db.json"));
const middlewares = jsonServer.defaults();

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
