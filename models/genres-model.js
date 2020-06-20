const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const genreSchema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required()
    });

    return genreSchema.validate(genre)
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;