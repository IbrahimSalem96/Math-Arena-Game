# 📘 Math Arena Backend

A **multiplayer math challenge platform** built using **Node.js**, **Express**, **MongoDB**, **RabbitMQ**, and a **microservices architecture**. Players compete in real-time by answering randomly generated math questions with varying difficulty levels.

---

## ⚙️ Technologies Used

* **Node.js**, **Express** – REST API and service logic
* **MongoDB**, **Mongoose** – Data persistence
* **RabbitMQ (amqplib)** – Message broker between services
* **JWT** – Authentication
* **Jest**, **Supertest** – Unit & integration testing

---

## 📁 Project Structure
// Structure: Organized Multiplayer Math Arena System (Node.js + Microservices)

// Root project folder structure:

```bash
math-arena-backend/
├── auth-service/
│   ├── config/connectToDb.js
│   ├── models/user.model.js
│   ├── rabbitmq/consumer.js
│   ├── routes/auth.routes.js
│   ├── services/auth.service.js
│   ├── validators/auth.validator.js
│   ├── test/
│   │   ├── auth.service.test.js
│   │   └── auth.validator.test.js
│   │   └── auth.routes.test.js
│   ├── .env
│   ├── app.js
│   └── .server.js
│
├── game-service/
│   ├── models/
│   │   ├── game.model.js
│   │   └── gameSession.model.js
│   │   └── playerGame.model.js
│   ├── rabbitmq/consumer.js
│   ├── services/auth.service.js
│   ├── test/
│   │   ├── game.model.test.js
│   │   ├── game.service.test.js
│   │   └── game.routes.test.js
│   ├── .env
│   ├── app.js
│   └── .server.js
│
├── orchestrator/
│   ├── middlewares/auth.middleware.js
│   ├── routes/main.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── game.service.js
│   │   └── player.service.js
│   ├── test/
│   │   ├── auth.service.test.js
│   │   ├── game.service.test.js
│   │   ├── orchestrator.middleware.test.js
│   │   ├── orchestrator.routes.test.js
│   │   └── player.service.test.js
│   ├── .env
│   ├── app.js
│   └── .server.js
│
├── players-service/
│   ├── models/
│   │   ├── game.model.js
│   │   └── gameSession.model.js
│   │   └── playerGame.model.js
│   ├── rabbitmq/consumer.js
│   ├── services/result.service.js
│   ├── test/
│   │   ├── playerGame.model.test.js
│   │   └── result.service.test.js
│   ├── .env
│   └── .server.js
│
├── Math Arena Game.postman_collection.json (sample requests)
├── README.md
└── .gitignore
```

// Notes:
// - Each microservice can be started independently with `npm install && npm start`
// - MongoDB is used across services, RabbitMQ required for communication
// - `.env` files must contain RABBITMQ_URL and MONGO_URI for each service
// - Each model/service file contains the logic discussed in the previous messages
// - Orchestrator acts as API Gateway and routes requests to appropriate services using RabbitMQ
// - Auth uses JWT to protect game routes
// - Multiplayer logic is implemented by having a shared GameSession with multiple PlayerGame records


---
# 📘 Math Arena - Documentation

> Multiplayer Math Challenge Platform using Node.js, MongoDB, RabbitMQ, and Microservices.

---

## 🧱 Project Overview

**Math Arena** is a real-time multiplayer game where players compete by answering math questions. The system is built using a microservices architecture, and each service handles a specific part of the system.

---

## 📦 Microservices Structure

### 1. **Auth Service** (`/authService`)

* Manages user registration and login
* JWT-based authentication

### 2. **Game Service** (`/gameService`)

* Handles game sessions, player joining, answering questions, and ending games
* Generates math questions

### 3. **Players Service** (`/playersService`)

* Calculates individual player results
* Aggregates full game results and determines winners

### 4. **Orchestrator (API Gateway)** (`/orchestrator`)

* Routes requests to respective services via RabbitMQ
* Authenticates requests using JWT

---

## ⚙️ Technologies Used

* Node.js + Express
* MongoDB + Mongoose
* RabbitMQ (via amqplib)
* JWT for authentication
* Jest + Supertest for testing

---

## 🔐 Authentication (JWT)

* After registration or login, a JWT is returned.
* Add this token to headers in protected routes:

```
Authorization: Bearer <access_token>
```

---

## 📡 API Endpoints (via Orchestrator)

### ✅ Auth

| Method | Endpoint         | Body                           | Description         |
| ------ | ---------------- | ------------------------------ | ------------------- |
| POST   | `/auth/register` | `{ name, username, password }` | Register a new user |
| POST   | `/auth/login`    | `{ username, password }`       | Login, get JWT      |

---

### 🎮 Game

| Method | Endpoint                 | Header       | Body                   | Description              |
| ------ | ------------------------ | ------------ | ---------------------- | ------------------------ |
| POST   | `/game/start`            | Bearer Token | `{ name, difficulty }` | Start a new game session |
| POST   | `/game/:gameId/join`     | Bearer Token | `{ name }`             | Join an existing game    |
| POST   | `/game/:playerId/submit` | Bearer Token | `{ answer }`           | Submit an answer         |
| POST   | `/game/:gameId/end`      | Bearer Token | —                      | End game session         |

---

### 📊 Results

| Method | Endpoint               | Header       | Description                     |
| ------ | ---------------------- | ------------ | ------------------------------- |
| GET    | `/result/me/:playerId` | Bearer Token | Get individual player result    |
| GET    | `/player/all/:gameId`  | Bearer Token | Get full game results + winners |

---

## 🧪 Testing

Run all tests:

```bash
cd authService && npm test
cd gameService && npm test
cd playersService && npm test
cd orchestrator && npm test
```
Or for the full test
```bash
npm test
```

* Test files are located under `/test`
* Services are tested using Jest and Supertest

👉 See 📄 Full Unit Test Plan and Design Decisions
[Jump to Design Decisions](./UNIT_TESTS.md#-design-decisions--trade-offs)

## 🗃️ Database Models (Simplified)

### User

```js
{
  name: String,
  username: String,
  password: String // Hashed
}
```

### GameSession

```js
{
  difficulty: Number,
  questions: [
    { question: String, correctAnswer: Number }
  ],
  timeStarted: Date,
  timeEnded: Date
}
```

### PlayerGame

```js
{
  gameId: ObjectId,
  playerName: String,
  currentQuestionIndex: Number,
  answers: [
    {
      question: String,
      correctAnswer: Number,
      submittedAnswer: Number,
      timeTaken: Number,
      answeredAt: Date
    }
  ],
  joinedAt: Date,
  endedAt: Date
}
```

 

## 🧠 Game Logic

* Game starts with 10 generated questions
* Each player receives same questions in a session
* Answer correctness and response time tracked per player
* Game can have multiple players per session
* Results calculated at end via `players-service`

---

## 🏁 Run the App

Ensure MongoDB and RabbitMQ are running, then start services:

```bash
cd authService && npm start
cd gameService && npm start
cd playersService && npm start
cd orchestrator && npm start
```

## Option 2: Start all services at once (from the root directory)
you can start all services at once by running:
```bash
npm start
```
---

## 📬 Contact
* Developed by: **Ibrahim Salem**  
* Email: [ibrahim.m.salem96@gmail.com](mailto:ibrahim.m.salem96@gmail.com)
* LinkedIn: [linkedin.com/in/ibrahimsalem](https://www.linkedin.com/in/ibrahimsalem96)  
* Phone: +962 789 468 554
---


