const mongoose = require('mongoose');

const localSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
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
        artistName: {
            type: String,
            required: true
        },
        artistId: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    country: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Local = mongoose.model('Local', localSchema, 'locals');

module.exports = Local;
