🏦 Smart Wallet

A comprehensive Full Stack FinTech application designed to simulate a digital banking experience. Smart Wallet enables users to securely manage funds, perform peer-to-peer (P2P) money transfers, track transaction history in real-time, and manage their contacts.

(Replace this placeholder with an actual screenshot of your dashboard)

🚀 Project Overview

Smart Wallet was built to demonstrate production-ready architecture and mastery of secure, scalable web development. It moves beyond simple CRUD operations to handle atomic financial transactions, role-based security, and real-time data visualization.

Key Features

🔐 Enterprise-Grade Security:

Stateless Authentication using JWT (JSON Web Tokens).

Role-Based Access Control (RBAC) with separate Admin and User portals.

Password encryption using BCrypt.

💸 Core Banking Logic:

Atomic Transactions: Uses @Transactional to ensure data integrity (ACID compliance) during money transfers.

Money Management: Deposit, Withdraw, and Transfer funds seamlessly.

Request System: Users can request money from others, with a Pay/Decline workflow.

📊 Professional Dashboard:

Interactive Charts: Visual analytics of transaction history using Recharts.

Contact Management: Save beneficiaries for quick transfers.

Responsive UI: Built with React + Tailwind CSS for a modern, mobile-first experience.

⚙️ DevOps & Infrastructure:

Dockerized Environment: The entire backend and database stack runs in Docker containers.

PostgreSQL: Uses a robust relational database for data persistence.

🛠️ Tech Stack

Backend (Java Spring Boot)

Framework: Spring Boot 3 (Java 17+)

Security: Spring Security 6, JWT (io.jsonwebtoken)

Database: Spring Data JPA (Hibernate), PostgreSQL Driver

Build Tool: Maven

Frontend (React)

Core: React 18 (Vite)

Styling: Tailwind CSS, Lucide React (Icons)

State & API: React Hooks, Axios (with Interceptors)

Visualization: Recharts

Routing: React Router DOM 6

Infrastructure

Database: PostgreSQL 16 (Alpine)

Containerization: Docker, Docker Compose

🏃‍♂️ Getting Started

Follow these steps to run the project locally.

Prerequisites

Docker Desktop (Running)

Node.js & npm

Java JDK 17+

1. Clone the Repository

git clone [https://github.com/your-username/smart-wallet.git](https://github.com/your-username/smart-wallet.git)
cd smart-wallet


2. Start the Backend Infrastructure

We use Docker Compose to spin up the PostgreSQL database and the Spring Boot backend together.

cd wallet
# This builds the JAR file and starts the containers
docker-compose up --build -d


The backend will be available at http://localhost:8080.

3. Start the Frontend

Open a new terminal window.

cd smart-wallet-ui
npm install
npm run dev


The frontend will be available at http://localhost:5173.

🧪 Testing the Application

The database starts empty. You can populate it using the UI or Postman.

👤 User Roles

1. Super Admin

Username: admin

Password: admin123

Capabilities: View all users, delete users, view global transaction ledger.

2. Regular User

Register a new account via the Sign Up page.

Capabilities: Deposit, withdraw, transfer, add contacts, view personal analytics.

🔌 API Endpoints (Quick Reference)

Method

Endpoint

Description

POST

/api/auth/login

Authenticate user & get Token

POST

/api/users/register

Create a new account

GET

/api/wallet/{id}/balance

Get current balance

POST

/api/wallet/transfer

Send money to another user

POST

/api/wallet/deposit

Add funds to account

POST

/api/requests/create

Request money from a user

📸 Gallery

Login Screen

User Dashboard

Admin Panel

🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any feature updates.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.
