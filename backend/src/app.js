const express = require('express');
const bodyParser = require('body-parser');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { sequelize } = require('./config/db');

const app = express();

app.use(bodyParser.json());
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

sequelize.sync();

module.exports = app;
