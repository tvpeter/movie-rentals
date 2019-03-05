const winston = require('winston');
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/logger')();
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 4000;
const server = app.listen(port, ()=>winston.info(`Listening on port ${port}`));

module.exports = server;