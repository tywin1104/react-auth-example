const mongoose = require('mongoose');


var ParticipantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    votes: {type: Number, default: 0},
    slogan: {type: String}
});

const ElectionSchema = new mongoose.Schema({
    participantNames: [{type: String}]
});


module.exports = {
    Election: mongoose.model('Election', ElectionSchema),
    Participant: mongoose.model('Participant', ParticipantSchema),
}