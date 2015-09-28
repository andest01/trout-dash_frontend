var gzippo = require('gzippo');
var express = require('express');
var app = express();

process.env.PWD = process.cwd();

app.use(express.logger('dev'));
app.use(gzippo.staticGzip('' + process.env.PWD + '/dist'));
app.listen(process.env.PORT || 5000);