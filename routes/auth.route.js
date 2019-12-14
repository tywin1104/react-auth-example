const express = require('express');
const router = express.Router();
const authenticate = require('../helpers/check-auth');
const { encode } = require('../helpers/jwt')
const User = require('../models/User')
module.exports = router;

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
  console.log('login')
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
              _id: user._id,
              email: email,
              name: user.name,
              role:user.userType
            };
            res.setHeader('token', encode(payload))
            res.status(200).send({token:encode(payload)});
          }
        });
      }
    });
});


router.get('/checkToken', authenticate, function(req, res) {
    console.log(`${req.user.email} | ${req.user.username} checked in`)
    res.status(200).json({email: req.user.email, name: req.user.username});
});
