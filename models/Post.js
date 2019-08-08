const mongoose = require('mongoose');


var ReplySchema = new mongoose.Schema({
    content: {type: String, required:true},
    username: {type: String, required:true},
    timestamp: {type: Date, default: Date.now, required:true}
});

const PostSchema = new mongoose.Schema({
    username: {type: String, required:true},
    title: {type: String, required:true},
    content: {type: String, required:true},
    replies: [{type: ReplySchema}],
    timestamp: {type: Date, default: Date.now, required:true},
    resolved: {type: Boolean, required:true, default: false},
});


module.exports = mongoose.model('Post', PostSchema);