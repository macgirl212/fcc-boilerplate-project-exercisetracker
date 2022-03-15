const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please provide description']
    },
    duration: {
        type: Number,
        required: [true, 'Please provide duration']
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username']
    },
    count: {
        type: Number
    },
    log: {
        type: [logSchema]
    }
})

module.exports = mongoose.model('User', UserSchema)