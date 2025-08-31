const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'QuizScores';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        const quizType = event.pathParameters.quizType;
        
        if (!quizType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Quiz type is required' })
            };
        }
        
        // Get all scores for the quiz type
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'quizType-score-index',
            KeyConditionExpression: 'quizType = :quizType',
            ExpressionAttributeValues: {
                ':quizType': quizType
            },
            ScanIndexForward: false // Sort by score descending
        };
        
        const result = await dynamodb.query(params).promise();
        
        // Group by username and keep only the highest score for each user
        const userBestScores = {};
        result.Items.forEach(item => {
            if (!userBestScores[item.username] || userBestScores[item.username].score < item.score) {
                userBestScores[item.username] = item;
            }
        });
        
        // Convert to array and sort by score
        const leaderboard = Object.values(userBestScores)
            .sort((a, b) => b.score - a.score)
            .slice(0, 50); // Top 50 scores
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(leaderboard)
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};