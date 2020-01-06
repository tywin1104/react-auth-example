const express = require('express');
const Announcement = require('../models/Announcement')
const authenticate = require('../helpers/check-auth')
const router = express.Router();
module.exports = router;


//Get most recent annoucement
router.get('/recent', function (req, res) {
  Announcement.findOne().sort('-timestamp').exec(function (err, announcement) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "Unable to get most recent annoucement"
      })
    } else {
      res.status(200).json({ announcement })
    }
  })
})


//Create a announcement
router.post('/', authenticate, function (req, res) {
  if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') return res.status(401).send();
  const { content } = req.body;
  const announcement = new Announcement({ content })
  announcement.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "Unable to Create Announcement"
      })
    } else {
      res.status(200).json(announcement)
    }
  })
})


//Patch a announcement by id
router.patch('/:announcement_id', authenticate, function (req, res) {
  // if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') return res.status(401).send();
  console.log(req.body)
  Announcement.findOneAndUpdate({_id: req.params.announcement_id},  req.body , function (err, announcement) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "Unable to Patch Announcement"
      })
    } else {
      console.log(announcement)
      res.status(200).json(announcement);
    }
  });
});


//Delete a announcement by id
router.delete('/:announcement_id', authenticate, function (req, res) {
  if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') return res.status(401).send();

  Announcement.findByIdAndRemove(req.params.announcement_id, req.body, function (err, announcement) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "Unable to Delete Announcement"
      })
    } else {
      res.status(200).json(announcement);
    }
  });
});



