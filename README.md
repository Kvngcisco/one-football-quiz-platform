# One Football (OFC) Quiz Platform

A web-based quiz platform with two sections: One Football Quiz and Football Quiz. Features include timed questions, leaderboards, and Twitter integration.

## Features

### Frontend
- **Homepage**: Two quiz options (One Football & Football) with 3-second football avatar intro animation
- **Quiz Pages**: 
  - 15-second timer per question
  - Multiple-choice questions
  - Auto-advance to next question
  - Score tracking
- **Leaderboard**: 
  - Separate sections for One Football and Football quizzes
  - Twitter-linked usernames
  - Top 50 scores displayed
- **Mobile Responsive**: Works on all devices

### Backend
- **Serverless Architecture**: AWS Lambda + API Gateway
- **Database**: DynamoDB for storing scores
- **CORS Enabled**: Cross-origin requests supported
- **Score Management**: Only keeps best score per user per quiz

## Project Structure

```
quiz-platform/
├── frontend/
│   ├── index.html          # Homepage with intro animation
│   ├── quiz.html           # Quiz interface
│   ├── leaderboard.html    # Leaderboard display
│   ├── css/
│   │   └── style.css       # Responsive styles
│   └── js/
│       ├── app.js          # Homepage logic
│       ├── quiz.js         # Quiz functionality
│       └── leaderboard.js  # Leaderboard logic
├── backend/
│   ├── lambda/
│   │   ├── submit-score.js     # Score submission
│   │   └── get-leaderboard.js  # Leaderboard retrieval
│   └── package.json        # Dependencies
├── deployment/
│   ├── cloudformation-template.yaml  # AWS infrastructure
│   ├── deploy.sh           # Linux/Mac deployment
│   └── deploy.bat          # Windows deployment
└── README.md
```

## Quiz Content

### One Football Quiz (10 Questions)
- One Football (OFC) mission and goals
- Blockchain technology
- Token economics
- Roadmap and features
- Community focus

### Football Quiz (10 Questions)
- UEFA Champions League
- World Cup history
- Legendary players
- Famous stadiums
- Club achievements

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **SAM CLI** installed
4. **Node.js** (for backend dependencies)

### Installation Links
- [AWS CLI](https://aws.amazon.com/cli/)
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Node.js](https://nodejs.org/)

## Deployment Instructions

### Option 1: Automated Deployment

#### For Windows:
```bash
cd deployment
deploy.bat
```

#### For Linux/Mac:
```bash
cd deployment
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

#### Step 1: Deploy Backend
```bash
cd backend
npm install

cd ../deployment
sam build --template-file cloudformation-template.yaml
sam deploy --stack-name quiz-platform --region us-east-1 --capabilities CAPABILITY_IAM --parameter-overrides Environment=prod --confirm-changeset
```

#### Step 2: Get API URL
```bash
aws cloudformation describe-stacks --stack-name quiz-platform --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' --output text
```

#### Step 3: Update Frontend
Replace `https://your-api-gateway-url.amazonaws.com/prod` in:
- `frontend/js/quiz.js`
- `frontend/js/leaderboard.js`

#### Step 4: Deploy Frontend
```bash
# Get bucket name
aws cloudformation describe-stacks --stack-name quiz-platform --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' --output text

# Upload files
aws s3 sync frontend/ s3://YOUR-BUCKET-NAME --delete
```

## AWS Resources Created

- **DynamoDB Table**: `QuizScores` with GSI indexes
- **Lambda Functions**: 
  - `quiz-submit-score-prod`
  - `quiz-get-leaderboard-prod`
- **API Gateway**: RESTful API with CORS
- **S3 Bucket**: Static website hosting
- **CloudFront**: CDN distribution
- **IAM Roles**: Lambda execution permissions

## API Endpoints

### Submit Score
```
POST /submit-score
Content-Type: application/json

{
  "username": "johndoe",
  "score": 8,
  "quizType": "ofc",
  "totalQuestions": 10
}
```

### Get Leaderboard
```
GET /leaderboard/{quizType}
```

## Configuration

### Environment Variables (Lambda)
- `TABLE_NAME`: DynamoDB table name

### Frontend Configuration
Update API_BASE_URL in:
- `frontend/js/quiz.js`
- `frontend/js/leaderboard.js`

## Features in Detail

### Timer System
- 15-second countdown per question
- Visual timer display
- Auto-advance when time expires

### Score Management
- Only best score per user is kept
- Prevents score inflation
- Real-time leaderboard updates

### Twitter Integration
- Clickable usernames link to Twitter profiles
- Format: `https://x.com/username`

### Mobile Responsive
- Optimized for all screen sizes
- Touch-friendly interface
- Responsive grid layouts

## Customization

### Adding Questions
Edit the `quizData` object in `frontend/js/quiz.js`:

```javascript
const quizData = {
    ofc: {
        title: 'One Football Quiz',
        questions: [
            {
                question: 'Your question here?',
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                correct: 0 // Index of correct answer
            }
        ]
    }
};
```

### Styling
Modify `frontend/css/style.css` for custom themes and layouts.

### Timer Duration
Change timer duration in `frontend/js/quiz.js`:
```javascript
let timeLeft = 15; // Change to desired seconds
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure API Gateway has CORS enabled
2. **Lambda Timeout**: Increase timeout in CloudFormation template
3. **DynamoDB Access**: Check IAM permissions
4. **CloudFront Caching**: Wait 10-15 minutes for distribution

### Logs
Check CloudWatch logs for Lambda functions:
```bash
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/quiz
```

## Cost Estimation

### AWS Services (Monthly)
- **Lambda**: ~$0.20 (1M requests)
- **DynamoDB**: ~$1.25 (25 GB storage)
- **API Gateway**: ~$3.50 (1M requests)
- **S3**: ~$0.50 (50 GB storage)
- **CloudFront**: ~$1.00 (100 GB transfer)

**Total**: ~$6.45/month for moderate usage

## Security

- CORS properly configured
- No sensitive data in frontend
- IAM roles with minimal permissions
- HTTPS enforced via CloudFront

## Support

For issues or questions:
1. Check CloudWatch logs
2. Verify AWS permissions
3. Ensure all prerequisites are installed
4. Review deployment outputs

## License

MIT License - Feel free to modify and distribute.