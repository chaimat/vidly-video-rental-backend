const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    isGold: {
        type: Boolean,
        required: true,
        default: false
    },
    phone: {
        type: String,
        minlength: 5,
        maxlength: 15,
        required: true
    }
});

const Customer = new mongoose.model('Customer', customerSchema);


function validateCustomer(customer) {
    const custSchema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        phone: Joi.string().min(5).max(15).required(),
        isGold: Joi.boolean()
    });

    return custSchema.validate(customer)
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;