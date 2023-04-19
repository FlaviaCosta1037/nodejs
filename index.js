const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db", "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
