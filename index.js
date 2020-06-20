const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

mongoose.connect('mongodb://localhost/vidlyDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const genres = require("./routes/genres");
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/user');
const home = require("./routes/home");

const app = express()

app.use("/", home);
app.use("/api/genres", genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at ${port}`));
