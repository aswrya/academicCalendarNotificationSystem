# Academic Calendar Notification System

  A full-stack web application for managing and notifying users about academic calendar events.
  Built with Node.js (Express) backend + React frontend, deployed on AWS EC2 with Nginx + PM2, and automated with GitHub Actions CI/CD.

# Features

  Backend:

  REST APIs with Express.js

  JWT authentication

  MongoDB persistence (Atlas or self-hosted)

  Task management endpoints

  Tested with Mocha + Chai + Sinon

  Frontend:

  React with Bootstrap

  Axios API integration

  Responsive UI

  Build artifacts deployed via Nginx

  DevOps:

  GitHub Actions pipeline for CI/CD

  Self-hosted runner on EC2 (t2.micro)

  Deployment with PM2 (backend) + Nginx (frontend)

# Project Architecture
  academicCalendarNotificationSystem/
  ├── backend/              # Express.js API server
  │   ├── routes/           # API routes
  │   ├── controllers/      # Request handlers
  │   ├── models/           # Mongoose models
  │   ├── tests/            # Mocha/Chai/Sinon tests
  │   └── server.js         # Entry point
  │
  ├── frontend/             # React app
  │   ├── public/
  │   ├── src/
  │   └── package.json
  │
  ├── .github/workflows/ci.yml   # CI/CD workflow
  ├── .env.example          # Example environment variables
  ├── README.md             # Project docs
  └── package.json


# Branches

  dev: Development branch for feature work.

  main: Protected branch. Merging into main triggers the CI/CD pipeline and deploys to EC2.

# Environment Variables

  All secrets must be placed in a .env file inside backend/.
  The repository includes .env.example as a reference.

  backend/.env.example
# MongoDB connection string (include database name at end)
  MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/academicCalendar

# JWT secret for signing tokens
  JWT_SECRET=your_secret_here

# Backend server port
  PORT=5001


# Copy this file before running locally:

  cp backend/.env.example backend/.env


  Then fill in your own values.

## Running Locally
  1. Clone the repo
  git clone https://github.com/<your-username>/academicCalendarNotificationSystem.git
  cd academicCalendarNotificationSystem

  2. Backend setup
  cd backend
  npm install
  cp .env.example .env   # then edit with your secrets
  npm run dev            # starts on http://localhost:5001


  Test backend:

  curl http://localhost:5001/api/health

  3. Frontend setup
  cd frontend
  npm install
  npm start              # starts on http://localhost:3000


  By default the frontend proxies API calls to http://localhost:5001.

# Running Tests

  Backend tests use Mocha, Chai, Sinon.

  cd backend
  npm test

# CI/CD Workflow

  Trigger: Push or merge to main branch

  Runner: Self-hosted GitHub Actions runner on the same EC2 instance

  Steps:

  Checkout repo

  Install dependencies & run backend tests

  Build frontend

  Deploy frontend build → /var/www/academiccalendar (served via Nginx)

  Deploy backend with PM2 (academic-backend)

  Notes:

  .env in backend on EC2 is written at deploy time from GitHub Secrets (BACKEND_ENV).

  .env.example is just a template. Fill it with your own secrets locally.

  Frontend build uses FRONTEND_API_URL secret to connect to backend (http://<EC2-Public-DNS>:5001).

# Deployment

  Frontend → accessible via EC2 Public DNS / Elastic IP (http://<ec2-dns>/)

  Backend → exposed on port 5001 (http://<ec2-dns>:5001/)

  Process Manager → PM2 ensures backend auto-restarts on crash or reboot

# Secrets Management

  Local development → .env file (ignored by git)

  Production → GitHub Actions Secrets (FRONTEND_API_URL, BACKEND_ENV)

  Never commit actual .env with secrets.

# Contribution Workflow

  Create feature branch from dev

  Commit & push changes

  Open a Pull Request into dev

  Once stable → merge dev → main to deploy

# Roadmap

  Add monitoring endpoint /api/health

  Expand test coverage

  CI/CD matrix for multiple Node versions

  Dockerize frontend & backend