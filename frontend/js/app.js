// Mobile-first initialization
document.addEventListener('DOMContentLoaded', function() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Show intro animation then main content
    setTimeout(() => {
        const intro = document.getElementById('intro-animation');
        const main = document.getElementById('main-content');
        if (intro && main) {
            intro.classList.add('hidden');
            main.classList.remove('hidden');
        }
    }, 1500);
    
    // Add touch event listeners for mobile
    const quizButtons = document.querySelectorAll('.quiz-btn');
    quizButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

function startQuiz(quizType) {
    try {
        localStorage.setItem('currentQuiz', quizType);
        window.location.href = 'quiz.html';
    } catch (error) {
        console.error('Error starting quiz:', error);
        // Fallback for mobile browsers with localStorage issues
        window.location.href = `quiz.html?type=${quizType}`;
    }
}