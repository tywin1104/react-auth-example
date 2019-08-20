const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    content: {type: String, required:true},
    timestamp: {type: Date, default: Date.now, required:true}
});


const GroupSchema = new mongoose.Schema({
    title: {type: String, required:true, unique:true},
    description: {type: String, default: ""},
    members: {type: [String]},
    announcements: [{type: AnnouncementSchema}],
});


module.exports = mongoose.model('Group', GroupSchema);