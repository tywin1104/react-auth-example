const mongoose = require('mongoose');

const StewardsAnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('StewardsAnnouncement', StewardsAnnouncementSchema);