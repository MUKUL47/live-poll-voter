require('dotenv').config()
const EventEmitter = require('events')
exports.listener = new EventEmitter();
const routes = require('./routes/router.controller').routes
const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const path = require('path');
app.use(express.static(path.join(__dirname, './')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);
const io = require('socket.io').listen(app.listen(8080))
require('./routes/socket.controller').socketController(io)