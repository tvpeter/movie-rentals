const express = require('express');
const {User, validate} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async(req, res)=> {
    //validate the request
   const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if user already exits
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered');

    //create and save user
    //  user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password =await bcrypt.hash(user.password, salt);

     await user.save();

    // return res.send({
    //     name: user.name,
    //     email: user.email
    // });

    //we will move this to the user model and add as a method
    const token = user.generateAuthToken();
    //const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));

    return res.header('x-auth-token', token).send(_.pick(user, ['id','name', 'email']))

});

router.get('/', async(req, res)=>{
    const users = await User.find().sort('name');

    return res.send(users);
});

module.exports = router;
