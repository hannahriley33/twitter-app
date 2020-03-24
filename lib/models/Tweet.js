const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxLength: 280
  }
});


module.exports = mongoose.model('Tweet', tweetSchema);
