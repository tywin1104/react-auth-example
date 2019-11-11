const mongoose = require('mongoose');

const NotificationsSchema = new mongoose.Schema({
    username: String,
    posts: [],
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Notifications', NotificationsSchema);