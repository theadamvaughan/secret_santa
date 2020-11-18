const mongoose = require('mongoose')
const Party = mongoose.Schema({
  party_location: {
    type: String,
    required:true
  },
  max_cost: {
    type: Number,
    required:true
  },
  party_date: {
    type: Date,
    default: Date.now
  },
  closing_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Party', Party)