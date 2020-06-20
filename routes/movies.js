const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Movie, validateMovie} = require('../models/movies-models');
const {Genre, validateGenre} = require('../models/genres-model');

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies); 
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        res.status(404).send('Movie not found');
    }else{
        res.send(movie);
    }
});

router.post('/', async (req, res) => {
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Genre not found');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre.genreId,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });

    movie = await movie.save()
    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send('Movie not found');
    res.send('Movie deleted');
});

router.put('/:id', async (req, res) => {

    const {value, error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Genre not found');

    Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    }, (err, movie) => {
        if(err){
            res.status(400).send(err.message);
        } else {
            if(!movie) return res.status(404).send('Movie not found');
            res.send('Movie updated');
        }
    });
});

module.exports = router;