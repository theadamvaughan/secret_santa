const mongoose = require('mongoose')
const Party = mongoose.Schema({
  party_id: {
    type: String,
    default: null
  },
  host_id: {
    type: String,
  },
  party_location: {
    type: String,
    required:true
  },
  max_cost: {
    type: Number,
    required:true
  },
  party_date: {
    type: Date
  },
  closing_date: {
    type: Date
  }
})

module.exports = mongoose.model('Party', Party)
