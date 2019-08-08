const express = require('express');
const Announcement = require('../models/Announcement')
const router = express.Router();
module.exports = router;


//Get most recent annoucement
router.get('/recent', function(req, res) {
  Announcement.findOne().sort('-timestamp').exec(function(err, announcement) {
      if(err) {
          console.log(err)
          res.status(500).json({
              msg: "Unable to get most recent annoucement"
          })
      }else {
        res.status(200).json({announcement})
      }
  })
})


//Create a announcement
router.post('/', function(req, res) {
    const {content} = req.body;
    const announcement = new Announcement({content})
    announcement.save(function(err) {
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


//Delete a announcement by id
router.delete('/:announcement_id', function(req, res) {
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



