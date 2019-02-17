const express = require('express');
const {User} = require('../models/user');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async(req, res)=> {
    //validate the request
   const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if user already exits
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email/password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email/password');

    //jwtPrivatekey is the name of the app setting
    //const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    const token = user.generateAuthToken();
    return res.send(token);
});

router.get('/', async(req, res)=>{
    const users = await User.find().sort('name');

    return res.send(users);
});


function validate(req){
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().min(4).max(50).required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;
