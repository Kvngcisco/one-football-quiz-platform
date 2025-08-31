#!/bin/bash

# One Football (OFC) Quiz Platform Deployment Script

set -e

STACK_NAME="quiz-platform"
REGION="us-east-1"
ENVIRONMENT="prod"

echo "🚀 Starting deployment of One Football (OFC) Quiz Platform..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI is not installed. Please install it first."
    exit 1
fi

# Build and deploy backend
echo "📦 Building and deploying backend..."
cd ../backend
npm install

cd ../deployment
sam build --template-file cloudformation-template.yaml
sam deploy --stack-name $STACK_NAME --region $REGION --capabilities CAPABILITY_IAM --parameter-overrides Environment=$ENVIRONMENT --confirm-changeset

# Get API Gateway URL
API_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' --output text)
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' --output text)
CLOUDFRONT_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontUrl`].OutputValue' --output text)

echo "✅ Backend deployed successfully!"
echo "📡 API Gateway URL: $API_URL"

# Update frontend with API URL
echo "🔧 Updating frontend configuration..."
cd ../frontend/js
sed -i "s|https://your-api-gateway-url.amazonaws.com/prod|$API_URL|g" quiz.js
sed -i "s|https://your-api-gateway-url.amazonaws.com/prod|$API_URL|g" leaderboard.js

# Deploy frontend to S3
echo "📤 Deploying frontend to S3..."
cd ..
aws s3 sync . s3://$BUCKET_NAME --delete --region $REGION

echo "🎉 Deployment completed successfully!"
echo ""
echo "🌐 Your One Football (OFC) Quiz Platform is available at:"
echo "   CloudFront URL: https://$CLOUDFRONT_URL"
echo "   S3 Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "📊 API Endpoints:"
echo "   Submit Score: $API_URL/submit-score"
echo "   Get Leaderboard: $API_URL/leaderboard/{quizType}"
echo ""
echo "⚠️  Note: CloudFront distribution may take 10-15 minutes to fully deploy."