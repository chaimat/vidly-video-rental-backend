const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const {Genre, validateGenre} = require('../models/genres-model');

router.use(bodyParser.urlencoded({
    extended: true
}))

router.get("/", async (req, res) => {
        const genres = await Genre.find();
        res.send(genres);
});

router.get("/:id", async (req, res) => {
        const genre = await Genre.findById(req.params.id)
        if (!genre) {
            res.status(404).send("Genre not found");
        } else {
            res.send(genre)
        }
    });

router.post("/", (req, res) => {

    const {value,error} = validateGenre(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {

        const genre = new Genre({
            name: value.name
        });

        genre.save(err => {
            if (!err) {
                res.send("Genre added")
            }
        });
    }
});

router.delete("/:id", (req, res) => {

    Genre.findByIdAndDelete(req.params.id, (err, genre) => {
        if (!genre) {
            res.status(404).send("Genre not found")
        } else {
            res.send('Genre deleted')
        }
    })
    
});

router.put("/:id", (req, res) => {

    const {
        value,
        error
    } = validateGenre(req.body);
    
    if (error) {
        res.status(400).send(error.details[0].message)
    } else {
        Genre.findByIdAndUpdate(req.params.id, {name: value.name}, (err, genre) => {

            if (!genre) {
                res.status(404).send("Genre not found");
            } else {
                genre.name = value.name;
                genre.save(err => {
                    if(err){
                        res.send(err);
                    }else{
                        res.send("updated")
                    }
                })
            }

        });

    }
});

module.exports = router;