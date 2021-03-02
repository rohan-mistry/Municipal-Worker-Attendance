const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const schema = new Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reset: {          
        tokenHash: {    
            type: String,
        },
        expiration : {
            type: Date,
            default: Date.now()
        }
    },   
    role: {
        type: String,
        enum: ['worker','admin']
    },
    allowed: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('user',schema);