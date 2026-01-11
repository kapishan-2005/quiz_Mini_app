let questions = [];
let currentIdx = 0;
let userAnswers = [];
let timerInterval;

const landingPage = document.getElementById('landing-page');
const loginModal = document.getElementById('login-modal');
const quizContainer = document.getElementById('quiz-container');
const resultPage = document.getElementById('result-page');

fetch('questions.json')
    .then(res => res.json())
    .then(data => questions = data);

document.getElementById('start-btn').onclick = () => {
    loginModal.style.display = 'block';
};

document.getElementById('login-form').onsubmit = (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('pass-error');

    // NORMAL WEBSITE PASSWORD VALIDATION
    const passRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passRegex.test(password)) {
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';
    loginModal.style.display = 'none';
    landingPage.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    startQuiz();
};

function startQuiz() {
    showQuestion();
}

function showQuestion() {
    if (currentIdx >= questions.length) {
        showResults();
        return;
    }

    const q = questions[currentIdx];
    document.getElementById('question-text').innerText = q.question;

    const optionsDiv = document.getElementById('options-container');
    optionsDiv.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectAnswer(opt);
        optionsDiv.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    let timeLeft = 60;

    document.getElementById('timer').innerText = '01:00';

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText =
            `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectAnswer('Timed Out');
        }
    }, 1000);
}

function selectAnswer(ans) {
    clearInterval(timerInterval);

    userAnswers.push({
        question: questions[currentIdx].question,
        selected: ans,
        correct: questions[currentIdx].answer
    });

    currentIdx++;
    showQuestion();
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultPage.classList.remove('hidden');

    let score = 0;
    const summary = document.getElementById('score-summary');
    const detailed = document.getElementById('detailed-results');

    detailed.innerHTML = '';

    userAnswers.forEach((item, i) => {
        const correct = item.selected === item.correct;
        if (correct) score++;

        detailed.innerHTML += `
            <div class="result-item">
                <p><strong>${i + 1}. ${item.question}</strong></p>
                <p style="color:${correct ? '#00ff88' : '#ff6b6b'}">
                    Your Answer: ${item.selected}
                </p>
                ${!correct ? `<p style="color:#00ff88">Correct Answer: ${item.correct}</p>` : ''}
            </div>
        `;
    });

    summary.innerHTML = `<h3>Final Score: ${score} / ${questions.length}</h3>`;
}
