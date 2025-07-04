function generateQuestion(difficulty) {
  const levels = {
    1: { operands: 2, digits: 1 },
    2: { operands: 3, digits: 2 },
    3: { operands: 4, digits: 3 },
    4: { operands: 5, digits: 4 }
  };

  const level = levels[difficulty];
  if (!level) {
    throw new Error(`Invalid difficulty level: ${difficulty}`);
  }

  const { operands, digits } = level;

  const operators = ['+', '-', '*', '/'];
  const numbers = Array.from({ length: operands }, () => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });

  const ops = Array.from({ length: operands - 1 }, () => operators[Math.floor(Math.random() * operators.length)]);

  let expression = '';
  for (let i = 0; i < numbers.length; i++) {
    expression += numbers[i];
    if (i < ops.length) {
      expression += ` ${ops[i]} `;
    }
  }

  let answer;
  try {
    answer = eval(expression);
    if (isNaN(answer) || !isFinite(answer)) answer = 0;
    answer = parseFloat(answer.toFixed(2));
  } catch {
    answer = 0;
  }

  return { question: expression, correctAnswer: answer };
}

module.exports = { generateQuestion };
