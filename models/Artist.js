const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        min: 0
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null // Optional: An artist may or may not belong to a group
    },
    ratings: [{
        rating:{
            type: Number,
            min: 1,
            max: 10,
        },
        localId: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
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
        type: String, // This will store the file path
        required: false
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
artistSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const Artist = mongoose.model('Artist', artistSchema, 'artists'); // Explicitly specifying collection name

module.exports = Artist;