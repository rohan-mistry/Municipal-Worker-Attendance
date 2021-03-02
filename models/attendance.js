const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const locations = require('./locations');
const municipal = require('./municipal');
const worker = require('./worker');

const schema = new Schema({
  lat: {
    type: Number,
    required:true
  },
  long: {
    type: Number,
    required:true
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: worker,
    required:true
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: locations,
    required:true
  },
  municipal: {
    type: Schema.Types.ObjectId,
    ref: municipal,
    required:true
  },
  createdAt: {
    type:Number,
  },
  updatedAt: {
    type:Number,
  }
},{
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

module.exports = mongoose.model('Attendance',schema);
