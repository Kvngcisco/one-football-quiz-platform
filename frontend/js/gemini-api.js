const GEMINI_API_KEY = 'AIzaSyDcVqODoJ0XS796I6xLd4TF6ngiXdEUsLE'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function generateFreshQuestions(quizType, count = 10) {
    const prompts = {
        ofc: `Generate ${count} multiple-choice quiz questions about One Football (OFC) platform covering:
        - Mission and vision for football fans
        - Tokenomics and OFC token utility
        - Fan engagement and community features
        - Blockchain technology integration
        - Use cases and platform benefits
        
        Format each question as JSON with: question, options (array of 4), correct (index 0-3).
        Distribute correct answers evenly across options A, B, C, D.
        Make questions engaging and varied in difficulty.
        Return only valid JSON array.`,
        
        football: `Generate ${count} multiple-choice quiz questions about football covering:
        - World Cup history and records
        - Famous players and their achievements
        - Club football and leagues
        - Football rules and basics
        - Stadiums and football culture
        
        Format each question as JSON with: question, options (array of 4), correct (index 0-3).
        Distribute correct answers evenly across options A, B, C, D.
        Make questions engaging and varied in difficulty.
        Return only valid JSON array.`
    };

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompts[quizType]
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const questions = JSON.parse(jsonMatch[0]);
            return questions.slice(0, count); // Ensure we get exactly the requested count
        }
        
        throw new Error('Could not parse generated questions');
        
    } catch (error) {
        console.error('Error generating questions:', error);
        // Fallback to static questions
        return allQuestions[quizType].slice(0, count);
    }
}

async function loadQuizWithFreshQuestions(quizType) {
    try {
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = '<div class="loading">Generating fresh questions...</div>';
        loadingDiv.className = 'quiz-loading';
        document.body.appendChild(loadingDiv);
        
        // Try to generate fresh questions
        const freshQuestions = await generateFreshQuestions(quizType, 10);
        
        // Remove loading indicator
        document.body.removeChild(loadingDiv);
        
        return {
            title: quizType === 'ofc' ? 'One Football Quiz' : 'Football Quiz',
            questions: freshQuestions
        };
        
    } catch (error) {
        console.error('Failed to load fresh questions:', error);
        
        // Remove loading indicator if it exists
        const loadingDiv = document.querySelector('.quiz-loading');
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
        
        // Fallback to static questions
        const questions = allQuestions[quizType];
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return {
            title: quizType === 'ofc' ? 'One Football Quiz' : 'Football Quiz',
            questions: shuffled.slice(0, 10)
        };
    }
}