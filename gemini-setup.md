# Gemini API Setup for Fresh Questions

## 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## 2. Configure the API Key

Open `frontend/js/gemini-api.js` and replace:
```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
```

With your actual API key:
```javascript
const GEMINI_API_KEY = 'your-actual-api-key-here';
```

## 3. How It Works

- **Fresh Questions**: Each quiz attempt generates new questions via Gemini API
- **Fallback System**: If API fails, uses static questions from questions.js
- **Loading Indicator**: Shows "Generating fresh questions..." while API loads
- **Smart Prompts**: Tailored prompts for OFC and Football topics
- **Even Distribution**: Ensures correct answers are spread across A, B, C, D

## 4. Features

### One Football Quiz
- Mission and vision questions
- Tokenomics and utility
- Fan engagement features
- Blockchain integration
- Platform benefits

### Football Quiz
- World Cup history
- Famous players
- Club football
- Rules and basics
- Stadiums and culture

## 5. Benefits

- ✅ **Always Fresh**: New questions every time
- ✅ **Unlimited Content**: Never run out of questions
- ✅ **Smart Fallback**: Works even if API is down
- ✅ **Cost Effective**: Gemini API is free for moderate usage
- ✅ **Easy Setup**: Just add your API key

## 6. API Limits

- **Free Tier**: 60 requests per minute
- **Cost**: Free for up to 1,000 requests per day
- **Fallback**: Automatic fallback to static questions if limits exceeded

## 7. Testing

1. Add your API key to `gemini-api.js`
2. Start the quiz platform
3. Take a quiz - you should see "Generating fresh questions..." loading screen
4. Questions should be different each time you retake the quiz

## 8. Troubleshooting

- **No API Key**: Will use static questions
- **API Limit Exceeded**: Will fallback to static questions
- **Network Issues**: Will fallback to static questions
- **Invalid Response**: Will fallback to static questions

The system is designed to always work, even if the API fails!