const winston = require('winston');
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/logger')();
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 4000;
app.listen(port, ()=>winston.info(`Listening on port ${port}`));