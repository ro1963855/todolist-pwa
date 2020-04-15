/* eslint-disable */

var express = require('express');
var proxy = require('http-proxy-middleware');
var path = require('path');
var serveStatic = require('serve-static');
app = express();
app.use(serveStatic(__dirname + '/dist'));
app.use(
  '/api',
  proxy({ 
    target: 'http://0.0.0.0:3001/',
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  })
);
var port = process.env.PORT || 3000;
app.listen(port);
console.log('server started '+ port);