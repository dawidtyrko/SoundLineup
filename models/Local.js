const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

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
    password: {
        type: String,
        required: true
    },
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
localSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})
const Local = mongoose.model('Local', localSchema, 'locals');

module.exports = Local;
