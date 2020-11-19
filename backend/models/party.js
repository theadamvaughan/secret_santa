const mongoose = require('mongoose')
const Party = mongoose.Schema({
  invite_code: {
    type: String,
    required: true
  },
  host_id: {
    type: Number,
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
