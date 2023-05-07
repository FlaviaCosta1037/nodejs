const http = require('http');
const fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if(req.method === 'OPTIONS'){
    res.statusCode = 200;
    res.end();

  } else if (req.method === 'GET' && req.url === '/user') { // Define a rota para a API
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
        const newId = existingData.length > 0 ? existingData[existingData.length - 1].id + 1 : 1; // Incrementa o último ID usado ou define o ID como 1 se o arquivo estiver vazio
        newData.id = newId; // Adiciona o novo ID ao objeto de dados da requisição POST
        const updatedData = [...existingData, newData]; // Combina os dados existentes e os novos dados
        fs.writeFile('./db/db.json', JSON.stringify(updatedData), err => { // Escreve os dados atualizados de volta no arquivo
          if (err) throw err;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Data saved successfully');
        });
      });
    });

  } else if (req.method === 'PUT' && req.url.startsWith('/user/')) {
    const id = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        const existingData = JSON.parse(data);
        const updatedData = existingData.map(item => {
          if (item.id.toString() === id) {
            const newData = JSON.parse(body);
            newData.id = parseInt(id);
            return newData;
          } return item;
        });
        fs.writeFile('./db/db.json', JSON.stringify(updatedData), err => {
          if (err) throw err;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Data updated successfully');
        });
      });
    });
  } else if (req.method === 'PATCH' && req.url.startsWith('/user/')) {
    const id = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        const existingData = JSON.parse(data);
        const updatedData = existingData.map(item => {
          if (item.id.toString() === id) {
            const newData = JSON.parse(body);
            newData.id = parseInt(id);
            return { ...item, ...newData };
          }
          return item;
        });
        fs.writeFile('./db/db.json', JSON.stringify(updatedData), err => {
          if (err) throw err;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Data updated successfully');
        });
      });
    });
  } else if (req.method === 'DELETE' && req.url.startsWith('/user/')) {
    const id = req.url.split('/')[2];
    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err;
      const existingData = JSON.parse(data);
      const updatedData = existingData.filter(item => item.id.toString() !== id);
      fs.writeFile('./db/db.json', JSON.stringify(updatedData), err => {
        if (err) throw err;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Data deleted successfully');
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
