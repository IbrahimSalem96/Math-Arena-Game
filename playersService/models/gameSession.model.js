const mongoose = require('mongoose');

const GameSessionSchema = new mongoose.Schema({
  difficulty: Number,
  questions: [{
    question: String,
    correctAnswer: Number
  }],
  timeStarted: Date,
  timeEnded: Date
});

module.exports = mongoose.model('GameSession', GameSessionSchema);
