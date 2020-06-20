const express = require('express');
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Hello Welcome to the home page");
});

module.exports = router;