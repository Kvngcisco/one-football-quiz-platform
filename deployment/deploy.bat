@echo off
setlocal enabledelayedexpansion

REM One Football (OFC) Quiz Platform Deployment Script for Windows

set STACK_NAME=quiz-platform
set REGION=us-east-1
set ENVIRONMENT=prod

echo 🚀 Starting deployment of One Football (OFC) Quiz Platform...

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS CLI is not installed. Please install it first.
    exit /b 1
)

REM Check if SAM CLI is installed
sam --version >nul 2>&1
if errorlevel 1 (
    echo ❌ SAM CLI is not installed. Please install it first.
    exit /b 1
)

REM Build and deploy backend
echo 📦 Building and deploying backend...
cd ..\backend
call npm install

cd ..\deployment
call sam build --template-file cloudformation-template.yaml
call sam deploy --stack-name %STACK_NAME% --region %REGION% --capabilities CAPABILITY_IAM --parameter-overrides Environment=%ENVIRONMENT% --confirm-changeset

REM Get API Gateway URL
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue" --output text') do set API_URL=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue" --output text') do set BUCKET_NAME=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey==`CloudFrontUrl`].OutputValue" --output text') do set CLOUDFRONT_URL=%%i

echo ✅ Backend deployed successfully!
echo 📡 API Gateway URL: %API_URL%

REM Update frontend with API URL
echo 🔧 Updating frontend configuration...
cd ..\frontend\js
powershell -Command "(gc quiz.js) -replace 'https://your-api-gateway-url.amazonaws.com/prod', '%API_URL%' | Out-File -encoding ASCII quiz.js"
powershell -Command "(gc leaderboard.js) -replace 'https://your-api-gateway-url.amazonaws.com/prod', '%API_URL%' | Out-File -encoding ASCII leaderboard.js"

REM Deploy frontend to S3
echo 📤 Deploying frontend to S3...
cd ..
aws s3 sync . s3://%BUCKET_NAME% --delete --region %REGION%

echo 🎉 Deployment completed successfully!
echo.
echo 🌐 Your One Football (OFC) Quiz Platform is available at:
echo    CloudFront URL: https://%CLOUDFRONT_URL%
echo    S3 Website URL: http://%BUCKET_NAME%.s3-website-%REGION%.amazonaws.com
echo.
echo 📊 API Endpoints:
echo    Submit Score: %API_URL%/submit-score
echo    Get Leaderboard: %API_URL%/leaderboard/{quizType}
echo.
echo ⚠️  Note: CloudFront distribution may take 10-15 minutes to fully deploy.

pause