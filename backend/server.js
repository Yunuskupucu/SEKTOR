const express = require('express');
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
const http = require("http");
//ortam değişkenleri için 
dotenv.config();
// Express
const app = express;
const server = http.createServer(app);
const io = socketIo(server);
// Middleware
app.use(bodyParser.json());