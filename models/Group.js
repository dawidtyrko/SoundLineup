const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

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
    audioLinks: [{
        platform: {
            type: String,
            required: true, // e.g., "YouTube", "Spotify"
        },
        url: {
            type: String,
            required: true
        }
    }],
    profileImage: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
groupSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const Group = mongoose.model('Group', groupSchema, 'groups');

module.exports = Group;
