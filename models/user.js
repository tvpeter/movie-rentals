const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 40
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 6,
        maxlength: 50

    },
    password: {
        type: String,
        required: true,
        minlength:4,
        maxlength: 1024

    }
});

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

//we can use joi.password-complexity package to validate the strength of supplied passwords

function validateUser(user){
    const schema = {
        name: Joi.string().min(2).max(40).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(4).max(50).required()
    }
    return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;