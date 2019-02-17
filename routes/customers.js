const express = require('express');
const {Customer, validate} = require('../models/customers');
const auth = require('../middlewares/auth');
const router = express.Router();



router.get('/', async (req, res)=>{

    const customers = await Customer.find().sort('name');
    
    return res.send(customers);
});

router.get('/:id', async (req, res) =>{
    //validate the request

    //search the db 
    const customer =  await Customer.findById(req.params.id);

    //return 404 if not found
    if(!customer) return res.status('404').send('Customer not found');

    //return the result
    return res.send(customer);
});

router.post('/', auth, async (req, res)=>{
    //validate the payload
    // const schema = {
    //     name: Joi.string().required().min(4).max(20),
    //     phone: Joi.string().required().min(5).max(12),
    //     isGold: Joi.bool()
    // }
    // const result = Joi.validate(req.body, schema);

    const { error } = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    //insert in the db
    const customer = new Customer({
        name : req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    const newCustomer = await customer.save();
    return res.send(newCustomer);
});

router.put('/:id', auth, async (req, res)=>{
    // const schema = Joi.object().keys({
    //     name: Joi.string().required().min(4).max(20),
    //     phone: Joi.string().required().min(5).max(12),
    //     isGold:Joi.bool()
    // }).or('name', 'phone');

    // const result = Joi.validate(req.body, schema);
    const { error } = validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

   const customer = await  Customer.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, {new : true});
    if(!customer) return res.status(404).send('Customer not found');
    return res.send(customer);
});

router.delete('/:id', async (req, res)=>{
    const customer = await Customer.findOneAndDelete(req.params.id);
    if(!customer) res.status(404).send('Customer not found');
    return res.send(customer);
});



module.exports = router;