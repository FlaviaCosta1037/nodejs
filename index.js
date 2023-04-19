const http = require('http');
const fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/users') { // Define a rota para a API
    fs.readFile('./db/db.json', (err, data) => { // Lê o arquivo db.json
      if (err) throw err;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(data); // Envia o conteúdo como resposta da requisição
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
