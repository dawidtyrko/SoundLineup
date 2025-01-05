const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    }],
    rating: {
        type: Number,
        min: 1,
        max: 10,
    },
    opinions: [{
        opinion: {
            type: String,
            required: true
        },
        localName: {
            type: String,
            required: true
        },
        localId: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('Group', groupSchema, 'groups');

module.exports = Group;
