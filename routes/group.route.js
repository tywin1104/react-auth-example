const express = require('express');
const Group = require('../models/Group')
const User = require('../models/User')
const router = express.Router();
const authenticate = require('../helpers/check-auth')

module.exports = router;

//Get all groups
router.get('/', function (req, res) {
  Group.find({}, function (err, groups) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get groups"
      })
    } else {
      res.status(200).json({ groups })
    }
  })
})

//Get specific group
router.get('/:group_id', function (req, res) {
  Group.findById(req.params.group_id, function (err, group) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get group"
      })
    } else {
      res.status(200).json({ group })
    }
  })
})


//Create a group
router.post('/', authenticate, function (req, res) {
  const { title } = req.body;
  console.log('-----------------------', req.user)
  const group = new Group({ title, members:[req.user.username] })
  group.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to create group"
      })
    } else {
      console.log('GROUP DATA', group)
      try {
        User.findOneAndUpdate({ _id: req.user._id }, { $push: { groups: { groupID: group._id, memberType: 'GROUPHEAD' } } }).exec()
        req.user.groups = req.user.groups.concat({ groupID: group._id, memberType: 'GROUPHEAD' })
      }
      catch (e) {
        console.log(e)
      }
      res.status(200).json(group)
    }
  })
})

//Patch (partial update) a post by id
router.patch('/:group_id', authenticate, function (req, res) {
  Group.findByIdAndUpdate(req.params.group_id, req.body, { new: true }, function (err, group) {
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
router.delete('/:group_id', authenticate, function (req, res, next) {
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
router.post('/:group_id/members', authenticate, function (req, res) {
  const { username } = req.body
  if (!username) {
    res.status(500).json({
      msg: "Unable to find username passed"
    })
  }
  Group.findByIdAndUpdate(req.params.group_id, { $push: { members: username } }, { new: true }, function (err, group) {
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
router.post('/:group_id/announcements', authenticate, function (req, res) {
  const group_id = req.params.group_id

  const { announcement } = req.body
  if (req.user.groups.find(group => group.memberType == 'GROUPHEAD' && group.groupID == group_id)) {
    Group.findByIdAndUpdate(req.params.group_id, { $push: { announcements: announcement } }, { new: true }, function (err, group) {
      if (err) {
        console.log(err);
        res.status(500).json({
          msg: "unable to add members"
        })
      } else {
        res.status(200).json(group);
      }
    });
  }
  else {
    res.status(403).send()
  }
})

// ! NEW 
router.put('/grouphead/:group_id', authenticate, function (req, res) {
  const group_id = req.params.group_id
  console.log('grouphead edit : ', req.user, req.body)
  // if the user in the group specified and also a grouphead
  if (req.user.groups.find(group => group.memberType == 'GROUPHEAD' && group.groupID == group_id)) {
    // dynamic edit
    Group.findByIdAndUpdate(req.params.group_id, { ...req.body }, { new: true }, function (err, group) {
      if (err) {
        console.log(err);
        res.status(500).json({
          msg: "unable to edit the group as a grouphead"
        })
      } else {
        res.status(200).json(group);
      }
    });
  }
  else {
    res.status(403).send()
  }

})

