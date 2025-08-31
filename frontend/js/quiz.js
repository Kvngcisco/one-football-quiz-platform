const API_BASE_URL = 'https://your-api-gateway-url.amazonaws.com/prod';

const quizData = {
    ofc: {
        title: 'One Football Quiz'
    },
    football: {
        title: 'Football Quiz'
    }
};

let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 15;

document.addEventListener('DOMContentLoaded', async function() {
    const quizType = localStorage.getItem('currentQuiz');
    if (!quizType || !quizData[quizType]) {
        window.location.href = 'index.html';
        return;
    }
    
    // Try to load fresh questions from Gemini API
    try {
        currentQuiz = await loadQuizWithFreshQuestions(quizType);
    } catch (error) {
        console.error('Failed to load fresh questions, using static ones:', error);
        // Fallback to static questions
        const questions = allQuestions[quizType];
        const shuffled = questions.sort(() => 0.5 - Math.random());
        currentQuiz = {
            title: quizData[quizType].title,
            questions: shuffled.slice(0, 10)
        };
    }
    
    document.getElementById('quiz-title').textContent = currentQuiz.title;
    
    showQuestion();
});

function showQuestion() {
    if (currentQuestionIndex >= currentQuiz.questions.length) {
        showQuizComplete();
        return;
    }
    
    const question = currentQuiz.questions[currentQuestionIndex];
    document.getElementById('question-counter').textContent = `${currentQuestionIndex + 1}/${currentQuiz.questions.length}`;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });
    
    startTimer();
}

function selectOption(selectedIndex) {
    clearInterval(timer);
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, index) => {
        option.onclick = null;
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === question.correct) {
        score++;
    }
    
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1000);
}

function startTimer() {
    timeLeft = 15;
    document.getElementById('timer').textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectOption(-1); // Auto-move to next question
        }
    }, 1000);
}

function showQuizComplete() {
    document.getElementById('question-container').classList.add('hidden');
    document.getElementById('quiz-complete').classList.remove('hidden');
    document.getElementById('final-score').textContent = `${score}/${currentQuiz.questions.length}`;
    console.log('Quiz completed with score:', score, 'out of', currentQuiz.questions.length);
}

async function submitScore() {
    const twitterHandle = document.getElementById('twitter-handle').value.trim();
    if (!twitterHandle) {
        alert('Please enter your Twitter handle');
        return;
    }
    
    const username = twitterHandle.startsWith('@') ? twitterHandle.slice(1) : twitterHandle;
    const quizType = localStorage.getItem('currentQuiz');
    
    // Try API first, fallback to localStorage
    try {
        const response = await fetch(`${API_BASE_URL}/submit-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                score,
                quizType,
                totalQuestions: currentQuiz.questions.length
            })
        });
        
        if (response.ok) {
            viewLeaderboard();
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        // Fallback to localStorage
        const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
        if (!scores[quizType]) scores[quizType] = [];
        
        // Check if user exists, always update to latest score
        const existingIndex = scores[quizType].findIndex(s => s.username === username);
        const newScore = { username, score, totalQuestions: currentQuiz.questions.length, timestamp: new Date().toISOString() };
        
        console.log('Saving score:', newScore);
        
        if (existingIndex >= 0) {
            scores[quizType][existingIndex] = newScore;
        } else {
            scores[quizType].push(newScore);
        }
        
        localStorage.setItem('quizScores', JSON.stringify(scores));
        console.log('All scores:', scores);
        viewLeaderboard();
    }
}

function retryQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('quiz-complete').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    showQuestion();
}

function goHome() {
    window.location.href = 'index.html';
}

function viewLeaderboard() {
    window.location.href = 'leaderboard.html';
}