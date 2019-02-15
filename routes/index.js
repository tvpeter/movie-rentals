const express = require('express');

const router = express.Router();

router.get('/', (req, res)=>{
    res.send('Hello and welcome to the genres movies');
});

module.exports = router;