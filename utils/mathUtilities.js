// utils/mathUtilities.js

/**
 * Generates a random math question.
 * @returns {object} The question object containing the question string, operator, and operands.
 */
function generateQuestion() {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let num1 = Math.floor(Math.random() * 100) + 1; // 1-100
    let num2 = Math.floor(Math.random() * 100) + 1; // 1-100

    // Adjust for division to avoid decimals
    if (operator === '/') {
        num1 = num1 * num2; // Ensures num1 is divisible by num2
    }

    const question = `${num1} ${operator} ${num2}`;
    return { question, operator, num1, num2 };
}

/**
 * Checks if the provided answer is correct.
 * @param {object} questionObj - The question object.
 * @param {string} answer - The user's answer.
 * @returns {boolean} - True if correct, else false.
 */
function checkAnswer(questionObj, answer) {
    const { operator, num1, num2 } = questionObj;

    let correctAnswer;
    switch (operator) {
        case '+':
            correctAnswer = num1 + num2;
            break;
        case '-':
            correctAnswer = num1 - num2;
            break;
        case '*':
            correctAnswer = num1 * num2;
            break;
        case '/':
            correctAnswer = num1 / num2;
            break;
        default:
            return false;
    }

    return Number(answer) === correctAnswer;
}

module.exports = {
    generateQuestion,
    checkAnswer
};
