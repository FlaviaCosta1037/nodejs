const http = require('http');
const fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/user') { // Define a rota para a API
    fs.readFile('./db/db.json', (err, data) => { // Lê o arquivo db.json
      if (err) throw err;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(data); // Envia o conteúdo como resposta da requisição
    });
  } else if (req.method === 'POST' && req.url === '/user') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fs.readFile('./db/db.json', (err, data) => { // Lê o conteúdo atual do arquivo db.json
        if (err) throw err;
        const existingData = JSON.parse(data); // Analisa o conteúdo como um objeto JavaScript
        const newData = JSON.parse(body); // Analisa o corpo da requisição como um objeto JavaScript
        const updatedData = { ...existingData, ...newData }; // Combina os dados existentes e os novos dados
        fs.writeFile('./db/db.json', JSON.stringify(updatedData), err => { // Escreve os dados atualizados de volta no arquivo
          if (err) throw err;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Data saved successfully');
        });
      });
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
