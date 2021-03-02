const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const User = require('./User');

const schema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Municipal',schema);