const GameSession = require('../models/gameSession.model');
const PlayerGame = require('../models/playerGame.model');

async function getPlayerResult(playerId) {
  const player = await PlayerGame.findById(playerId);
  if (!player) throw new Error("Player not found");

  const game = await GameSession.findById(player.gameId);
  if (!game) throw new Error("Game session not found");

  const totalQuestions = player.answers.length;
  const correct = player.answers.filter(q => Math.abs((q.submittedAnswer || 0) - q.correctAnswer) < 0.01);
  const currentScore = `${correct.length} / ${totalQuestions}`;

  const history = player.answers.map(q => ({
    question: q.question,
    correctAnswer: q.correctAnswer,
    submittedAnswer: q.submittedAnswer,
    timeTaken: q.timeTaken
  }));

  const best = player.answers.reduce((best, q) => {
    const isCorrect = Math.abs((q.submittedAnswer || 0) - q.correctAnswer) < 0.01;
    if (isCorrect && q.timeTaken && (best === null || q.timeTaken < best.timeTaken)) {
      return q;
    }
    return best;
  }, null);

  return {
    name: player.playerName,
    difficulty: game.difficulty || 'N/A',
    current_score: currentScore,
    total_time_spent: player.answers.reduce((sum, q) => sum + (q.timeTaken || 0), 0).toFixed(2),
    best_score: best ? {
      question: best.question,
      answer: best.submittedAnswer,
      time_taken: best.timeTaken
    } : null,
    history
  };
}


async function getGameResult(gameId) {
  const players = await PlayerGame.find({ gameId });
  const game = await GameSession.findById(gameId);
  if (!game) throw new Error("Game not found");

  const playerScores = players.map(player => {
    const correct = player.answers.filter(q => Math.abs((q.submittedAnswer || 0) - q.correctAnswer) < 0.01);
    const totalTime = player.answers.reduce((acc, q) => acc + (q.timeTaken || 0), 0);
    return {
      player: player.playerName,
      correct: correct.length,
      totalTime
    };
  });

  const maxScore = Math.max(...playerScores.map(p => p.correct), 0);
  const winners = playerScores
    .filter(p => p.correct === maxScore)
    .sort((a, b) => a.totalTime - b.totalTime)
    .map(p => p.player);

  const best = players.flatMap(p =>
    p.answers
      .filter(a => Math.abs((a.submittedAnswer || 0) - a.correctAnswer) < 0.01 && typeof a.timeTaken === 'number')
      .map(a => ({
        question: a.question,
        submittedAnswer: a.submittedAnswer,
        correctAnswer: a.correctAnswer,
        timeTaken: a.timeTaken,
        player: p.playerName
      }))
  ).sort((a, b) => a.timeTaken - b.timeTaken)[0];

  return {
    difficulty: game.difficulty,
    winners,
    best_score: best ? {
      player: best.player,
      question: best.question,
      answer: best.submittedAnswer,
      time_taken: best.timeTaken
    } : null,
    scores: playerScores.map(p => ({
      player: p.player,
      score: `${p.correct} / ${game.questions.length}`
    }))
  };
}



module.exports = { getPlayerResult, getGameResult };
