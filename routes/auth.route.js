const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const withAuth = require('../middleware');
const User = require('../models/User')
module.exports = router;

const secret = 'mysecretsshhh';

router.post('/register', function(req, res) {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
    user.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).send("Error registering new user please try again.");
      } else {
        res.status(200).send("Welcome to the club!");
      }
    });
});


router.post('/authenticate', function(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
          error: 'Incorrect email or password'
        });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
              error: 'Internal error please try again'
            });
          } else if (!same) {
            res.status(401)
              .json({
              error: 'Incorrect email or password'
            });
          } else {
            // Issue token
            const payload = {
              email: email,
              name: user.name
            };
            const token = jwt.sign(payload, secret, {
              expiresIn: '72h'
            });
            res.cookie('token', token, {}).sendStatus(200);
          }
        });
      }
    });
});


router.get('/checkToken', withAuth, function(req, res) {
    console.log(`${req.email} | ${req.name} checked in`)
    res.status(200).json({email: req.email, name: req.name});
});
