// --- LOGIN ---
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Check username
        if (username === "") {
            errorMsg.textContent = "Username is required!";
            return;
        }

        // Check password
        if (password === "") {
            errorMsg.textContent = "Password is required!";
            return;
        }

        // If both are entered
        errorMsg.textContent = "";
        localStorage.setItem('username', username);
        alert("Successfully logged in!");
        window.location.href = 'quiz.html';
    });
}


// --- QUIZ ---
let questions = [];
let currentQ = 0;
let score = 0;
let userAnswers = [];

if (document.getElementById('quizContainer')) {

    // Redirect if not logged in
    if (!localStorage.getItem('username')) {
        alert("Please login first!");
        window.location.href = 'login.html';
    }

    const questionEl = document.getElementById('question');
    const optionsList = document.getElementById('optionsList');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const feedback = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');

    fetch('questions.json')
    .then(res => res.json())
    .then(data => {
        questions = data;
        displayQuestion();
    });

    function displayQuestion() {
        const q = questions[currentQ];
        questionEl.textContent = `${currentQ+1}. ${q.question}`;
        optionsList.innerHTML = '';
        feedback.textContent = '';

        q.options.forEach((opt, idx) => {
            const li = document.createElement('li');
            li.textContent = opt;
            li.addEventListener('click', () => selectAnswer(opt, li));
            if (userAnswers[currentQ] && userAnswers[currentQ] === opt) {
                li.classList.add('selected');
            }
            optionsList.appendChild(li);
        });

        backBtn.style.display = currentQ === 0 ? 'none' : 'inline-block';
        nextBtn.textContent = currentQ === questions.length - 1 ? 'Finish' : 'Next';
    }

    function selectAnswer(answer, li) {
        userAnswers[currentQ] = answer;
        Array.from(optionsList.children).forEach(c => c.classList.remove('selected'));
        li.classList.add('selected');

        if (answer === questions[currentQ].answer) {
            feedback.textContent = "Correct!";
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = "Incorrect!";
            feedback.className = 'feedback incorrect';
        }
    }

    nextBtn.addEventListener('click', () => {
        if (!userAnswers[currentQ]) {
            alert("Please select an answer!");
            return;
        }
        if (currentQ < questions.length - 1) {
            currentQ++;
            displayQuestion();
        } else {
            // calculate score
            score = userAnswers.filter((ans, idx) => ans === questions[idx].answer).length;
            localStorage.setItem('score', score);
            localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
            window.location.href = 'result.html';
        }
        scoreEl.textContent = userAnswers.filter((ans, idx) => ans === questions[idx].answer).length;
    });

    backBtn.addEventListener('click', () => {
        if (currentQ > 0) {
            currentQ--;
            displayQuestion();
        }
    });
}

// --- RESULT PAGE ---
if (document.getElementById('finalScore')) {
    const finalScore = document.getElementById('finalScore');
    const reviewDiv = document.getElementById('reviewAnswers');

    const score = localStorage.getItem('score');
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    fetch('questions.json')
        .then(res => res.json())
        .then(data => {
            finalScore.textContent = score + ' / ' + data.length;

            data.forEach((q, idx) => {
                const div = document.createElement('div');
                div.innerHTML = `<p>${idx+1}. ${q.question}</p>
                                 <p>Your answer: <b>${userAnswers[idx]}</b></p>
                                 <p>Correct answer: <b>${q.answer}</b></p><hr>`;
                reviewDiv.appendChild(div);
            });
        });
}

function restartQuiz() {
    localStorage.removeItem('score');
    localStorage.removeItem('userAnswers');
    window.location.href = 'quiz.html';
}
