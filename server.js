const express = require('express')  
const serveStatic = require('serve-static')

const staticBasePath = './';

const app = express()
const port = 3000;

app.use(serveStatic(staticBasePath, {'index': false}))  
app.listen(port);

console.log(`Static server listening on port ${port}.`);