const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'QuizScores';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        const { username, score, quizType, totalQuestions } = JSON.parse(event.body);
        
        if (!username || score === undefined || !quizType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }
        
        const timestamp = new Date().toISOString();
        const id = `${quizType}_${username}_${Date.now()}`;
        
        // Check if user already has a score for this quiz type
        const existingScoreParams = {
            TableName: TABLE_NAME,
            IndexName: 'username-quizType-index',
            KeyConditionExpression: 'username = :username AND quizType = :quizType',
            ExpressionAttributeValues: {
                ':username': username,
                ':quizType': quizType
            },
            ScanIndexForward: false,
            Limit: 1
        };
        
        const existingScore = await dynamodb.query(existingScoreParams).promise();
        
        // Only update if new score is better
        if (existingScore.Items.length > 0 && existingScore.Items[0].score >= score) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    message: 'Score not updated - existing score is higher or equal',
                    currentBest: existingScore.Items[0].score
                })
            };
        }
        
        // Save new score
        const params = {
            TableName: TABLE_NAME,
            Item: {
                id,
                username,
                score,
                quizType,
                totalQuestions: totalQuestions || 10,
                timestamp
            }
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Score submitted successfully' })
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