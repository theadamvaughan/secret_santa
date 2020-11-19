const mongoose = require('mongoose')
const User = mongoose.Schema({
  first_name: {
    type: String,
    required:true
  },
  surname_name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  party_id: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', User)