const mongoose = require('mongoose');

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
        type: String, // This will store the file path
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Artist = mongoose.model('Artist', artistSchema, 'artists'); // Explicitly specifying collection name

module.exports = Artist;