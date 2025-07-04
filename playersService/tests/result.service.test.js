const { getPlayerResult, getGameResult } = require('../services/result.service');
const PlayerGame = require('../models/playerGame.model');
const GameSession = require('../models/gameSession.model');

jest.mock('../models/playerGame.model');
jest.mock('../models/gameSession.model');

describe('result.service.js', () => {
    describe('getPlayerResult()', () => {
        it('should return player result correctly', async () => {
            PlayerGame.findById.mockResolvedValue({
                _id: 'player1',
                playerName: 'Alice',
                gameId: 'game123',
                answers: [
                    { question: '1+1', submittedAnswer: 2, correctAnswer: 2, timeTaken: 3 },
                    { question: '2+2', submittedAnswer: 4, correctAnswer: 4, timeTaken: 2 },
                    { question: '3+3', submittedAnswer: 5, correctAnswer: 6, timeTaken: 4 }
                ]
            });

            GameSession.findById.mockResolvedValue({
                _id: 'game123',
                difficulty: 2
            });

            const result = await getPlayerResult('player1');

            expect(result.name).toBe('Alice');
            expect(result.difficulty).toBe(2);
            expect(result.current_score).toBe('2 / 3');
            expect(result.total_time_spent).toBe('9.00');
            expect(result.best_score).toEqual({
                question: '2+2',
                answer: 4,
                time_taken: 2
            });
            expect(result.history.length).toBe(3);
        });

        it('should throw if player not found', async () => {
            PlayerGame.findById.mockResolvedValue(null);

            await expect(getPlayerResult('invalid')).rejects.toThrow('Player not found');
        });

        it('should throw if game not found', async () => {
            PlayerGame.findById.mockResolvedValue({
                _id: 'player1',
                gameId: 'game404',
                playerName: 'Test',
                answers: []
            });

            GameSession.findById.mockResolvedValue(null);

            await expect(getPlayerResult('player1')).rejects.toThrow('Game session not found');
        });
    });

    describe('getGameResult()', () => {
        it('should return game result with winners and best score', async () => {
            PlayerGame.find.mockResolvedValue([
                {
                    playerName: 'A',
                    gameId: 'g1',
                    answers: [
                        { question: '1+1', submittedAnswer: 2, correctAnswer: 2, timeTaken: 3 },
                        { question: '2+2', submittedAnswer: 4, correctAnswer: 4, timeTaken: 2 }
                    ]
                },
                {
                    playerName: 'B',
                    gameId: 'g1',
                    answers: [
                        { question: '3+3', submittedAnswer: 6, correctAnswer: 6, timeTaken: 1 },
                        { question: '4+4', submittedAnswer: 8, correctAnswer: 8, timeTaken: 2 }
                    ]
                }
            ]);

            GameSession.findById.mockResolvedValue({
                _id: 'g1',
                difficulty: 3,
                questions: [1, 2, 3, 4]
            });

            const result = await getGameResult('g1');

            expect(result.difficulty).toBe(3);
            expect(result.winners.sort()).toEqual(['A', 'B']);
            expect(result.best_score).toEqual({
                player: 'B',
                question: '3+3',
                answer: 6,
                time_taken: 1
            });
            expect(result.scores).toEqual([
                { player: 'A', score: '2 / 4' },
                { player: 'B', score: '2 / 4' }
            ]);
        });

        it('should throw if game not found', async () => {
            PlayerGame.find.mockResolvedValue([]);
            GameSession.findById.mockResolvedValue(null);

            await expect(getGameResult('invalid')).rejects.toThrow('Game not found');
        });
    });
});
