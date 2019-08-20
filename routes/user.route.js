const express = require('express');
const User = require('../models/User')
const router = express.Router();
module.exports = router;


//Get Users
router.get('/', function(req, res) {
    console.log(req.query)
    User.find(req.query, function(err, users) {
      if(err) {
        console.log(err)
        res.status(500).json({
          msg: "Unable to get all users"
        })
      }else {
        res.status(200).json({users})
      }
    })
  })

//Get User by Id
router.get('/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err) {
        console.log(err)
        res.status(500).json({
          msg: "Unable to get user by id"
        })
      }else {
        res.status(200).json({user})
      }
    })
  })

  //Partial update
router.patch('/:user_id', function(req, res) {
    User.findByIdAndUpdate(req.params.user_id, req.body, {new: true}, function(err, user) {
      if(err) {
        console.log(err)
        res.status(500).json({
          msg: "Unable to update user"
        })
      }else {
        res.status(200).json({user})
      }
    })
  })

  //Add group info to user
router.post('/:user_id/groups', function(req, res) {
  const {group} = req.body
  User.findByIdAndUpdate(req.params.user_id, {$push: {groups: group}}, {new: true}, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to add group info to this user"
      })
    } else {
      res.status(200).json(user);
    }
  });
})