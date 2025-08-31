# GitHub Deployment Guide for One Football Quiz Platform

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. Repository name: `one-football-quiz-platform`
4. Description: `One Football (OFC) Quiz Platform with leaderboard and AI questions`
5. Set to **Public**
6. Check "Add a README file"
7. Click "Create repository"

## Step 2: Upload Files to GitHub

### Method 1: Web Interface (Recommended)
1. In your new repository, click "uploading an existing file"
2. Drag and drop these folders/files:
   - `frontend/` (entire folder)
   - `vercel.json`
   - `package.json`
   - `README.md`
3. Commit message: "Initial commit - One Football Quiz Platform"
4. Click "Commit changes"

### Method 2: GitHub Desktop
1. Download GitHub Desktop
2. Clone your repository
3. Copy all project files to the cloned folder
4. Commit and push

## Step 3: Deploy to Vercel from GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your email
3. Click "New Project"
4. Click "Import Git Repository"
5. Select your `one-football-quiz-platform` repository
6. Configure:
   - Framework Preset: **Other**
   - Root Directory: `frontend`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
7. Click "Deploy"

## Step 4: Custom Domain (Optional)
After deployment, you can add a custom domain in Vercel dashboard.

## Files to Upload Structure:
```
one-football-quiz-platform/
├── frontend/
│   ├── index.html
│   ├── quiz.html
│   ├── leaderboard.html
│   ├── css/style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── quiz.js
│   │   ├── leaderboard.js
│   │   ├── questions.js
│   │   └── gemini-api.js
│   └── images/
├── vercel.json
├── package.json
└── README.md
```

Your live URL will be: `https://one-football-quiz-platform.vercel.app`