// script.js

// Quiz Data
const quizData = [
    { question: "What is 5 + 3?", options: ["8", "6", "7", "9"], answer: "8", hint: "Add the two numbers together: 5 plus 3 equals what?" },
    { question: "What is 10 - 4?", options: ["5", "6", "7", "8"], answer: "6", hint: "Subtract 4 from 10 to find the difference." },
    { question: "What is 3 × 2?", options: ["5", "6", "8", "4"], answer: "6", hint: "Multiply 3 by 2: think of 3 groups of 2." },
    { question: "What is 12 ÷ 3?", options: ["4", "3", "5", "6"], answer: "4", hint: "Divide 12 into 3 equal parts." },
    { question: "What is 7 + 8?", options: ["14", "15", "16", "13"], answer: "15", hint: "Add 7 and 8 together." },
    { question: "What is 9 - 5?", options: ["3", "4", "5", "6"], answer: "4", hint: "Subtract 5 from 9 to find the result." },
    { question: "What is 4 × 3?", options: ["10", "11", "12", "14"], answer: "12", hint: "Multiply 4 by 3: think of 4 groups of 3." },
    { question: "What is 15 ÷ 5?", options: ["2", "3", "4", "5"], answer: "3", hint: "Divide 15 into 5 equal parts." },
    { question: "What is 6 + 9?", options: ["14", "15", "16", "17"], answer: "15", hint: "Add 6 and 9 together." },
    { question: "What is 20 - 8?", options: ["11", "12", "13", "14"], answer: "12", hint: "Subtract 8 from 20." },
    { question: "What is 5 × 4?", options: ["18", "20", "22", "24"], answer: "20", hint: "Multiply 5 by 4: think of 5 groups of 4." },
    { question: "What is 18 ÷ 6?", options: ["2", "3", "4", "5"], answer: "3", hint: "Divide 18 into 6 equal parts." },
    { question: "What is 8 + 7?", options: ["14", "15", "16", "17"], answer: "15", hint: "Add 8 and 7 together." },
    { question: "What is 16 - 9?", options: ["6", "7", "8", "9"], answer: "7", hint: "Subtract 9 from 16." }
];

// Leaderboard Data
const leaderboardData = [
    { name: "Jonathan Porter", score: 6500 },
    { name: "Julie Betz", score: 6000 },
    { name: "Alexa Richter", score: 4500 },
    { name: "AnnieM", score: 4000 },
    { name: "Elias Rosendorfer", score: 3000 }
];

// Initialize Quiz State
function initializeQuiz() {
    if (!localStorage.getItem('currentQuestion')) {
        localStorage.setItem('currentQuestion', '0');
        localStorage.setItem('score', '0');
    }
}

// Reset Quiz
function resetQuiz() {
    localStorage.setItem('currentQuestion', '0');
    localStorage.setItem('score', '0');
    window.location.href = 'index.html';
}

// Load Question
function loadQuestion() {
    const currentQuestion = parseInt(localStorage.getItem('currentQuestion') || '0');
    const score = parseInt(localStorage.getItem('score') || '0');
    const totalQuestions = quizData.length;

    if (currentQuestion >= totalQuestions) {
        window.location.href = 'result.html';
        return;
    }

    const question = quizData[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('hint').textContent = question.hint;
    document.getElementById('question-number').textContent = `Q. ${currentQuestion + 1} of ${totalQuestions} | Score: ${score * 100}`;
    document.getElementById('progress-bar').style.width = `${((currentQuestion + 1) / totalQuestions * 100)}%`;
    document.getElementById('progress-bar').setAttribute('aria-valuenow', ((currentQuestion + 1) / totalQuestions * 100));

    const optionsContainer = document.querySelector('#options-container .row');
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'col-6 mb-3';
        div.innerHTML = `
            <label class="option-box" for="option${index}">
                <input type="radio" class="form-check-input visually-hidden" name="answer" value="${option}" id="option${index}" required>
                <span class="option-text">${option}</span>
            </label>
        `;
        optionsContainer.appendChild(div);
    });

    // Option Selection
    const optionBoxes = document.querySelectorAll('.option-box');
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            optionBoxes.forEach(box => box.classList.remove('selected'));
            const selectedBox = radio.closest('.option-box');
            if (selectedBox) {
                selectedBox.classList.add('selected');
            }
        });
    });
}

// Handle Form Submission
function handleSubmit(event) {
    event.preventDefault();
    const selected = document.querySelector("input[name='answer']:checked");
    if (!selected) {
        alert("Please select an answer!");
        return;
    }

    const currentQuestion = parseInt(localStorage.getItem('currentQuestion') || '0');
    const correctAnswer = quizData[currentQuestion].answer;
    const selectedAnswer = selected.value;
    const feedback = document.getElementById('feedback');

    if (selectedAnswer === correctAnswer) {
        feedback.textContent = "Correct!";
        feedback.className = 'mt-3 text-center correct';
        let score = parseInt(localStorage.getItem('score') || '0');
        localStorage.setItem('score', (score + 1).toString());
    } else {
        feedback.textContent = "Incorrect!";
        feedback.className = 'mt-3 text-center incorrect';
    }

    localStorage.setItem('currentQuestion', (currentQuestion + 1).toString());

    setTimeout(() => {
        feedback.className = 'mt-3 text-center d-none';
        if (currentQuestion + 1 >= quizData.length) {
            window.location.href = 'result.html';
        } else {
            loadQuestion();
        }
    }, 1000);
}

// Handle Subscription
function handleSubscribe(event) {
    event.preventDefault();
    const email = document.getElementById('email-input').value;
    if (email) {
        alert(`Subscribed with: ${email}`);
    } else {
        alert("Please enter an email.");
    }
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        initializeQuiz();
        loadQuestion();

        const form = document.getElementById('quiz-form');
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        const subscribeForm = document.getElementById('subscribe-form');
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', handleSubscribe);
        }
    }
});