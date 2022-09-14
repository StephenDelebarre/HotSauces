const express = require('express');
const router = express.Router();
const userControll = require('../controllers/user');

// création des routes

router.post('/signup', userControll.signup);
router.post('/login', userControll.login);

module.exports = router;