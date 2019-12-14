const express = require('express');
const { Election } = require('../models/Election')
const { Participant } = require('../models/Election')
const router = express.Router();
const authenticate = require('../helpers/check-auth')

module.exports = router;

//Get all elections
router.get('/', authenticate, function (req, res) {
  Election.find({}, function (err, elections) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get elections"
      })
    } else {
      res.status(200).json({ elections })
    }
  })
})

//Get specific election
router.get('/:election_id', authenticate, function (req, res) {
  Election.findById(req.params.election_id, function (err, election) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get election"
      })
    } else {
      res.status(200).json({ election })
    }
  })
})



//Create a election
router.post('/', authenticate, function (req, res) {
  const { participantNames } = req.body;
  const election = new Election({ participantNames })
  election.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to create election"
      })
    } else {
      res.status(200).json(election)
    }
  })
})



//Add participants
router.post('/:election_id/participants/', authenticate, function (req, res) {
  const { name, slogan } = req.body
  const participant = new Participant({ name, slogan })
  participant.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to create participant"
      })
    } else {
      res.status(200).json(participant)
    }
  })
})

//Get participants
router.get('/:election_id/participants/', authenticate, function (req, res) {
  Participant.find({}, function (err, participants) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get participants"
      })
    } else {
      res.status(200).json({ participants })
    }
  })
})



//Patch participant by id
router.patch('/:election_id/participants/:participant_id', authenticate, function (req, res) {
  if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') return res.status(401).send();
  
  Participant.findByIdAndUpdate(req.params.participant_id, req.body, { new: true }, function (err, participant) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to update participant"
      })
    } else {
      res.status(200).json(participant);
    }
  });
})

