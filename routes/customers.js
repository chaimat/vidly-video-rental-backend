const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Customer, validateCustomer} = require('../models/customer-model');

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', (req, res) => {
    Customer.find({}, (err, customers) => {
        if(err){
            res.send(err.message);
        }else{
            res.send(customers);
        }
    });
});

router.get('/:id', (req, res) => {
    Customer.findById(req.params.id, (err, customer) => {
        if(err){
            res.send(err.message);
        }else{
            if(!customer){
                res.status(404).send('Customer Not Found');
            }else{
                res.send(customer);
            }
        }
    });
});

router.post('/', (req, res) => {
    const {value, error} = validateCustomer(req.body);

    if(error){
        res.status(400).send(error.message);
    }else{
        const customer = new Customer({
            name: value.name,
            phone: value.phone,
            isGold: value.isGold
        });

        customer.save(err => {
            if(err){
                res.send(err.message);
            }else{
                res.send('Customer added');
            }
        })
    }
});

router.delete('/:id', (req, res) => {
    Customer.findByIdAndDelete(req.params.id, (err, customer) => {
        if(err){
            res.send(err.message);
        }else{
            if(!customer){
                res.status(404).send('Customer not found');
            }else{
                res.send('Customer deleted');
            }
        }
    })
});

router.put('/:id', (req, res) => {

    const {value, error} = validateCustomer(req.body);

    if(error){
        res.status(400).send(error.message);
    }else{
        Customer.findByIdAndUpdate(req.params.id, {name: value.name, isGold: value.isGold, phone: value.phone}, (err, customer) => {
            if(err){
                res.send(err.message);
            }else{
                if(!customer){
                    res.status(404).send('Customer not found');
                }else{
                    res.send('Customer Updated');
                }
            }
        });
    }
})


module.exports = router;