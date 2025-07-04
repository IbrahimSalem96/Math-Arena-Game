const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: String,
  submittedAnswer: Number,
  correctAnswer: Number,
  timeTaken: Number
});

const PlayerGameSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'GameSession' },
  playerName: String,
  answers: [AnswerSchema],
  currentQuestionIndex: { type: Number, default: 0 },
  joinedAt: Date,
  endedAt: Date
});

module.exports = mongoose.model('PlayerGame', PlayerGameSchema);
