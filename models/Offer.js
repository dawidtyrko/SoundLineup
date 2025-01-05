const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    localId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Local',
        required: true
    },
    artistSignups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    }],
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Offer = mongoose.model('Offer', offerSchema, 'offers');

module.exports = Offer;
