const { generateQuestion } = require('../services/question-generator');

describe('🎮 Game Service - Question Generator Only', () => {
  it('should generate a valid question for difficulty 1', () => {
    const q = generateQuestion(1);
    expect(q).toHaveProperty('question');
    expect(q).toHaveProperty('correctAnswer');
    expect(typeof q.correctAnswer).toBe('number');
  });

  it('should generate different questions for different calls', () => {
    const q1 = generateQuestion(1);
    const q2 = generateQuestion(1);
    expect(q1.question).not.toEqual(q2.question);
  });
});
