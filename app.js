// app.js
const express = require('express');
const cors = require('cors');
const templateRoutes = require('./routes/templateRoutes');

const app = express();

app.use(cors());
// app.use(cors({
//     origin: ['http://localhost:5173'], 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], 
//     credentials: true
//   }));
  

app.use(express.json());

app.use('/api/templates', templateRoutes);

module.exports = app;
