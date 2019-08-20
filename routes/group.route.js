const express = require('express');
const Group = require('../models/Group')
const router = express.Router();
module.exports = router;

//Get all groups
router.get('/', function(req, res) {
    Group.find({}, function(err, groups) {
      if(err) {
        console.log(err)
        res.status(500).json({
          msg: "unable to get groups"
        })
      }else {
        res.status(200).json({groups})
      }
    })
})

//Get specific group
router.get('/:group_id', function(req, res) {
  Group.findById(req.params.group_id, function(err, group) {
    if(err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get group"
      })
    }else {
      res.status(200).json({group})
    }
  })
})


//Create a group
router.post('/', function(req, res) {
    const {title} = req.body;
    const group = new Group({title})
    group.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).json({
          msg: "unable to create group"
        })
      } else {
        res.status(200).json(group)
      }
    })
})

//Patch (partial update) a post by id
router.patch('/:group_id', function(req, res) {
  Group.findByIdAndUpdate(req.params.group_id, req.body, {new: true}, function (err, group) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to update group"
      })
    } else {
      res.status(200).json(group);
    }
  });
})

//Delete a post by id
router.delete('/:group_id', function(req, res, next) {
  Group.findByIdAndRemove(req.params.group_id, req.body, function (err, group) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to delete group"
      })
    } else {
      res.status(200).json(group);
    }
  });
});


//Add members to a group by ID
router.post('/:group_id/members', function(req, res) {
  const {username} = req.body
  if(!username) {
      res.status(500).json({
          msg: "Unable to find username passed"
      })
  }
  Group.findByIdAndUpdate(req.params.group_id, {$push: {members: username}}, {new: true}, function (err, group) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to add members"
      })
    } else {
      res.status(200).json(group);
    }
  });
})

//Add announcement to a group by ID
router.post('/:group_id/announcements', function(req, res) {
    const {announcement} = req.body
    Group.findByIdAndUpdate(req.params.group_id, {$push: {announcements: announcement}}, {new: true}, function (err, group) {
      if (err) {
        console.log(err);
        res.status(500).json({
          msg: "unable to add members"
        })
      } else {
        res.status(200).json(group);
      }
    });
  })

