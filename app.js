const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();
require('./startup/routes')(app);

require('./startup/logger')();
require('./startup/database')();
require('./startup/logger')();
require('./startup/config')();


const port = process.env.PORT || 4000;


app.listen(port, ()=>console.log(`Listening on port ${port}`));