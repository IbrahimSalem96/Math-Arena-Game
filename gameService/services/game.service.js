const Game = require('../models/game.model');
const GameSession = require('../models/gameSession.model');
const PlayerGame = require('../models/playerGame.model');
const { generateQuestion } = require('./question-generator');

async function startGame(playerName, difficulty) {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const q = generateQuestion(difficulty);
    questions.push({ question: q.question, correctAnswer: q.correctAnswer });
  }

  const gameSession = await GameSession.create({
    difficulty,
    questions,
    timeStarted: new Date()
  });

  const player = await PlayerGame.create({
    gameId: gameSession._id,
    playerName,
    answers: questions.map(q => ({ question: q.question, correctAnswer: q.correctAnswer })),
    joinedAt: new Date(),
    currentQuestionIndex: 0
  });

  return {
    message: `Hello ${playerName}, your game is ready.`,
    gameId: gameSession._id,
    playerId: player._id,
    submit_url: `/game/${player._id}/submit`,
    question: questions[0].question,
    time_started: gameSession.timeStarted
  };
}

async function joinGame(gameId, playerName) {
  const game = await GameSession.findById(gameId);
  if (!game) throw new Error("Game not found");
  if (game.timeEnded) throw new Error("Game already ended");

  const exists = await PlayerGame.findOne({ gameId, playerName });
  if (exists) throw new Error("Player already joined");

  const player = await PlayerGame.create({
    gameId,
    playerName,
    answers: game.questions.map(q => ({ question: q.question, correctAnswer: q.correctAnswer })),
    joinedAt: new Date(),
    currentQuestionIndex: 0
  });

  return {
    result: `Welcome ${playerName}, you joined the game!`,
    playerId: player._id,
    next_question: {
      submit_url: `/game/${player._id}/submit`,
      question: player.answers[0].question
    }
  };
}

async function submitAnswer(playerId, answer) {
  const player = await PlayerGame.findById(playerId);
  if (!player) throw new Error("Player not found");
  if (player.endedAt) throw new Error("Game already ended");

  const game = await GameSession.findById(player.gameId);
  if (!game) throw new Error("Game session not found");
  if (!game.timeStarted) throw new Error("Game start time not set");

  const idx = player.currentQuestionIndex;
  if (idx >= player.answers.length) throw new Error("No more questions");

  const now = new Date();

  let prevTime;
  if (idx === 0) {
    prevTime = game.timeStarted;
  } else {
    prevTime = player.answers[idx - 1].answeredAt;
  }

  const timeTaken = (now - prevTime) / 1000;

  player.answers[idx].submittedAnswer = answer;
  player.answers[idx].answeredAt = now;
  player.answers[idx].timeTaken = timeTaken;

  const correct = Math.abs(answer - player.answers[idx].correctAnswer) < 0.01;
  player.currentQuestionIndex += 1;

  if (player.currentQuestionIndex >= player.answers.length) {
    player.endedAt = now;
  }

  await player.save();

  const nextQ = player.answers[player.currentQuestionIndex];

  return {
    result: correct
      ? `Good job ${player.playerName}, your answer is correct!`
      : `Sorry ${player.playerName}, your answer is incorrect.`,
    next_question: nextQ
      ? {
          submit_url: `/game/${player._id}/submit`,
          question: nextQ.question
        }
      : null,
    current_score: `${player.answers.filter(a => a.submittedAnswer !== undefined && Math.abs(a.submittedAnswer - a.correctAnswer) < 0.01).length} / ${player.currentQuestionIndex}`
  };
}

async function endGame(gameId) {
  const game = await GameSession.findById(gameId);
  if (!game) throw new Error("Game not found");
  if (game.timeEnded) return { message: "Game already ended" };

  game.timeEnded = new Date();
  await game.save();

  return { message: "Game ended successfully" };
}

module.exports = { startGame, submitAnswer, joinGame, endGame };



