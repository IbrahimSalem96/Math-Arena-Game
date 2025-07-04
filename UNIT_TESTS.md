# ✅ Unit Testing Plan for Math Arena (Jest + Supertest)

> This document outlines the required unit tests for each service in the Math Arena microservice architecture.

---

## 📦 1. Auth Service

**File:** `authService.test.js`

### 🔹 register()

* [ ] should register a new user and return a token
* [ ] should not register with existing username
* [ ] should fail if required fields are missing

### 🔹 login()

* [ ] should login with correct credentials and return token
* [ ] should fail with wrong password
* [ ] should fail if user doesn't exist

---

## 🎮 2. Game Service

**File:** `gameService.test.js`

### 🔹 startGame()

* [ ] should create game session and return playerId
* [ ] should generate 10 questions

### 🔹 joinGame()

* [ ] should allow player to join existing session
* [ ] should prevent duplicate names in same game
* [ ] should error on non-existent or ended game

### 🔹 submitAnswer()

* [ ] should accept correct answer
* [ ] should reject if game already ended for player
* [ ] should return next question or end

### 🔹 endGame()

* [ ] should end game session
* [ ] should not re-end already ended session

---

## 👤 3. Players Service

**File:** `playersService.test.js`

### 🔹 getPlayerResult()

* [ ] should return score, time, and question history
* [ ] should throw error if player not found

### 🔹 getGameResult()

* [ ] should return winners with correct score
* [ ] should calculate fastest correct answer

---

## 🌐 4. Orchestrator Gateway

**File:** `orchestrator.test.js`

### 🔹 /auth/register

* [ ] should register and return token

### 🔹 /auth/login

* [ ] should login with valid credentials

### 🔹 /game/start

* [ ] should create game with JWT

### 🔹 /game/\:gameId/join

* [ ] should join existing game session

### 🔹 /game/\:playerId/submit

* [ ] should submit and respond with result

### 🔹 /result/me/\:playerId

* [ ] should return personal game result

### 🔹 /player/all/\:gameId

* [ ] should return overall game result

---

## 🧪 Running Tests

Each microservice has its own test suite located inside a `test/` folder:

* `authService/test`
* `gameService/test`
* `playersService/test`
* `orchestrator/test`

### 🔹 Run tests per service:

```bash
cd authService && npm test
cd gameService && npm test
cd playersService && npm test
cd orchestrator && npm test
OR 
npm test -- project root 
```

### 🔹 Run all tests from root:

You can run all services' tests from root if configured:

```bash
npm test
```

> Requires a test runner in root `package.json` that triggers all service test scripts (via npm-workspaces or custom script).

This section will be extended in future updates to include:

* Parallel testing using Jest projects
* Test coverage reporting
* Integration with CI/CD pipelines (e.g., GitHub Actions)

---

## 📐 Design Decisions & Trade-offs

### 🔸 Microservices Architecture

* ✅ Chosen to separate concerns clearly (auth/game/players/orchestrator)
* 🔁 Trade-off: more complexity in communication, mitigated with RabbitMQ

### 🔸 RabbitMQ for Inter-Service Communication

* ✅ Decouples services and allows async messaging
* ❗ Requires local RabbitMQ setup, but enables scalable architecture

### 🔸 JWT Authentication via Orchestrator

* ✅ All requests authenticated centrally
* 🔁 Trade-off: orchestrator must validate and forward token to services

### 🔸 Same Questions per Game Session

* ✅ Ensures fairness among all players
* 🔁 All answers must be tracked per player instance (PlayerGame)

### 🔸 Question Timing and Score Calculation

* ✅ Built into `PlayerGame.answers` for per-player stats
* ❗ Trade-off: extra writes per question, handled via Mongoose

### 🔸 MongoDB Used Globally

* ✅ Shared access for simplicity
* 🔁 Would benefit from Docker in real deployment

### 🔸 Tests Use Local DB

* ✅ Avoid test data leaking to production
* 🔁 May require setup for CI/CD pipelines later
