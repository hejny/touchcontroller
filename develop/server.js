const fs = require('fs');
// const http = require('http');
const https = require('https');
const path = require('path');
const privateKey = fs.readFileSync(path.join(__dirname, './keys/server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './keys/server.cert'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const express = require('express');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const opn = require('open');

// TODO: as indipendent library

const PORT = 6012;

const staticBasePath = './';

const app = express();

app.use(serveStatic(staticBasePath, { index: false }));
app.use(serveIndex(staticBasePath, { icons: true }));

// const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT);

console.log(`Static server listening on port ${PORT}.`);
opn(`https://localhost:${PORT}/samples/`);
