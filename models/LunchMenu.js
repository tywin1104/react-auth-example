const mongoose = require('mongoose');



const LunchMenuSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now, required: true },
    images: [{ type: String }]
});


module.exports = mongoose.model('LunchMenu', LunchMenuSchema);