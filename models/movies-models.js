const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genres-model')

mongoose.set('useCreateIndex', true);

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    genre: {
        type: [genreSchema],
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: [0, 'Movie Out of Stock'],
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = new mongoose.model('Movie', movieSchema);

async function validateMovie(movie){
    const movieSchema = Joi.object({
        title: Joi.string().min(5).max(5).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    });

    return movieSchema.validate(movie);
}

exports.validateMovie = validateMovie;
exports.Movie = Movie;