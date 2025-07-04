const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String
});

module.exports = mongoose.model('Users', UserSchema);
