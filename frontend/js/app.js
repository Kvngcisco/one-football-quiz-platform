// Show intro animation for 3 seconds then display main content
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('intro-animation').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
    }, 1500);
});

function startQuiz(quizType) {
    localStorage.setItem('currentQuiz', quizType);
    window.location.href = 'quiz.html';
}