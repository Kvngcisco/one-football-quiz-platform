const API_BASE_URL = 'https://your-api-gateway-url.amazonaws.com/prod';

let currentLeaderboard = 'ofc';

document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard('ofc');
});

function showLeaderboard(type) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide leaderboard sections
    document.getElementById('ofc-leaderboard').classList.toggle('hidden', type !== 'ofc');
    document.getElementById('football-leaderboard').classList.toggle('hidden', type !== 'football');
    
    currentLeaderboard = type;
    loadLeaderboard(type);
}

async function loadLeaderboard(quizType) {
    const scoresContainer = document.getElementById(`${quizType}-scores`);
    scoresContainer.innerHTML = '<div class="loading">Loading scores...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard/${quizType}`);
        
        if (response.ok) {
            const scores = await response.json();
            displayScores(scores, scoresContainer);
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        // Fallback to localStorage
        const localScores = JSON.parse(localStorage.getItem('quizScores') || '{}');
        const scores = (localScores[quizType] || [])
            .sort((a, b) => b.score - a.score)
            .slice(0, 50);
        displayScores(scores, scoresContainer);
    }
}

function displayScores(scores, container) {
    if (!scores || scores.length === 0) {
        container.innerHTML = '<div class="loading">No scores yet</div>';
        return;
    }
    
    container.innerHTML = '';
    
    
    scores.forEach((scoreData, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        
        const rankDisplay = index < 3 ? 
            `<div class="rank-badge rank-${index + 1}">#${index + 1}</div>` : 
            `<div class="rank">#${index + 1}</div>`;
        
        scoreItem.innerHTML = `
            ${rankDisplay}
            <div class="username">
                <a href="https://x.com/${scoreData.username}" target="_blank">@${scoreData.username}</a>
            </div>
            <div class="score">${scoreData.score}/${scoreData.totalQuestions || 10}</div>
        `;
        
        if (index < 3) {
            scoreItem.classList.add('podium-position');
        }
        
        container.appendChild(scoreItem);
    });
}