const express = require('express');
const stewardsAnnounce = require('../models/stewardsAnnouncements')
const authenticate = require('../helpers/check-auth')
const router = express.Router();
module.exports = router;


//Get most recent annoucement
router.get('/', function (req, res) {
  stewardsAnnounce.find().exec(function (err, stewardsAnnounce) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "Unable to get most recent annoucement"
      })
    } else {
      res.status(200).json({ stewardsAnnounce })
    }
  })
})


//Create a stewardsAnnounce
router.post('/', authenticate, function (req, res) {
  if (req.user.role !== 'MOD' && req.user.role !== 'ADMIN') return res.status(401).send();
  const { title,content } = req.body;
  const SA = new stewardsAnnounce({ title,content })
  SA.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "Unable to Create stewardsAnnounce"
      })
    } else {
      res.status(200).json(SA)
    }
  })
})


//Patch a stewardsAnnounce by id
router.put('/:stewardsAnnounce_id', authenticate, function (req, res) {
  if (req.user.role !== 'MOD' && req.user.role !== 'ADMIN') return res.status(401).send();
  console.log(req.body)
  stewardsAnnounce.findOneAndUpdate({_id: req.params.stewardsAnnounce_id},  req.body , {new:true}, function (err, stewardsAnnounce) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "Unable to Patch stewardsAnnounce"
      })
    } else {
      console.log(stewardsAnnounce)
      res.status(200).json(stewardsAnnounce);
    }
  });
});



