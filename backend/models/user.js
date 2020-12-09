const mongoose = require('mongoose')
const User = mongoose.Schema({
  user_id: {
    type: String,
    default: null
  },
  first_name: {
    type: String,
    required:true
  },
  surname: {
    type: String,
    required:true
  },
  email_address: {
    type: String,
    required: true
  },
  party_id: {
    type: String,
  }
})

module.exports = mongoose.model('User', User)
