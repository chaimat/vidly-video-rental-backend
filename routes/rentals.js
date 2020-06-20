const express = require('express');
const router = express();
const mongoose = require('mongoose');
const {Movie, validateMovie} = require('../models/movies-models');
const {Customer, validateCustomer} = require('../models/customer-model');
const {Rental, validateRental} = require('../models/rentals-model');
const bodyParser = require('body-parser');
const Fawn = require('fawn');

router.use(bodyParser.urlencoded({extended: true}));

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).res.send('Customer not found');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(404).send('Movie not found');

    if(movie.numberInStock <= 0) return res.status(400).send('Movie out of stock')

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}})
            .run();

        res.send('rental created');
    } catch (ex) {
        res.status(500).send(error.message)
    }

    // const session = await mongoose.startSession();
    // session.startTransaction();
    // try{
    //     const opts = {session, new: true};
    //     await Rental.create()

    // }

});

module.exports = router