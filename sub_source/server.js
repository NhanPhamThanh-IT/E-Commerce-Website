const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello, HTTPS!');
});

server.listen(3000, () => {
  console.log('Server is running on https://localhost:3000');
});
