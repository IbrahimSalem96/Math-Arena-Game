const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  correctAnswer: Number,
  submittedAnswer: Number,
  timeTaken: Number
});

const GameSchema = new mongoose.Schema({
  playerName: String,
  difficulty: Number,
  questions: [QuestionSchema],
  currentQuestionIndex: { type: Number, default: 0 },
  timeStarted: Date,
  timeEnded: Date
});

module.exports = mongoose.model('Games', GameSchema);
