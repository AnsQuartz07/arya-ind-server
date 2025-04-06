const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({   
    videoId: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    moduleId: {
        type: String,
        require: true
    },
    title: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    subject: {
        type: String,
        required: true,
        max: 1024,
    },
    teacher: {
        type: String,
        max: 100,
    },
    course: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
    videoColor: {
        type: String,
    },
    views: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Lecture', lectureSchema);