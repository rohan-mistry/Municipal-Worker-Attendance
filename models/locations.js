const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const municipal = require('./municipal');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    landmark: {
        type: String,
    },
    size: {
        type: Number,
        required: true
    },
    municipal: {
        type:Schema.Types.ObjectId,
        ref:municipal
    }

})

module.exports = mongoose.model('Location',schema);
