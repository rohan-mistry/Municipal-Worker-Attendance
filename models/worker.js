const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const municipal = require('./municipal');
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
    authenticated: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        required: true
    },
    allotment: {
        type: [Schema.Types.ObjectId]
    },
    municipal: {
        type: Schema.Types.ObjectId,
        ref: municipal
    },

})

module.exports = mongoose.model('Worker',schema);