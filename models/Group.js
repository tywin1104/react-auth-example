const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});


const GroupSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    houseman: { type: String, default: "" },
    members: { type: [String] },
    eventOne:{
        icon: { type: String, default: "football" },
        description: { type: String, default: "3:45PM Bremners vs ||| House Soccer" },
        date: { type: String, default: "Tomorrow" }
    },
    eventTwo:{
        icon: { type: String, default: "football" },
        description: { type: String, default: "3:45PM Bremners vs ||| House Soccer" },
        date: { type: String, default: "Tomorrow" }
    },
    eventThree:{
        icon: { type: String, default: "football" },
        description: { type: String, default: "3:45PM Bremners vs ||| House Soccer" },
        date: { type: String, default: "Tomorrow" }
    },
    eventFour:{
        icon: { type: String, default: "football" },
        description: { type: String, default: "3:45PM Bremners vs ||| House Soccer" },
        date: { type: String, default: "Tomorrow" }
    },
    eventFive:{
        icon: { type: String, default: "football" },
        description: { type: String, default: "3:45PM Bremners vs ||| House Soccer" },
        date: { type: String, default: "Tomorrow" }
    },
    eventSix:{
        icon: { type: String, default: "football" },
        description: { type: String, default: "3:45PM Bremners vs ||| House Soccer" },
        date: { type: String, default: "Tomorrow" }
    },
    announcements: [{ type: AnnouncementSchema }],
});


module.exports = mongoose.model('Group', GroupSchema);