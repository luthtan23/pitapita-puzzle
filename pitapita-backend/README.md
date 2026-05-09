# Pitapita Puzzle Backend

Go backend for the Pitapita Puzzle game.

## Features
- **User Management**: Registration, Login, and Profile fetching.
- **Leaderboard**: Submit scores and fetch global rankings filtered by difficulty.
- **Multiplayer**: Real-time interaction via WebSockets.

## Tech Stack
- **Go**: Primary language.
- **Gin**: Web framework.
- **GORM**: ORM for database interaction.
- **PostgreSQL**: Primary database.
- **WebSockets**: Real-time multiplayer support.
- **JWT**: Authentication.

## Getting Started

### Prerequisites
- Go 1.21+
- PostgreSQL

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   go mod download
   ```
3. Set up environment variables in `.env`:
   ```env
   PORT=8080
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=pitapita_puzzle
   DB_PORT=5432
   JWT_SECRET=your-secret-key
   ```
4. Run the server:
   ```bash
   # Using standard go command
   go run cmd/server/main.go
   
   # Or using Mage (recommended)
   mage dev
   ```

## 🛠 Automation with Mage

This project uses [Mage](https://magefile.org/) for task automation.

- `mage build`: Build the application binary to `bin/server`.
- `mage dev`: Run the application in development mode (using `go run`).
- `mage run`: Build and run the application binary.
- `mage test`: Run all tests.
- `mage clean`: Remove build artifacts.
- `mage install`: Download all dependencies.

### Auth
- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Login and receive a JWT.

### Scores
- `GET /api/v1/scores/leaderboard?difficulty=easy`: Get leaderboard.
- `POST /api/v1/scores/`: Submit a new score (Auth required).

### Multiplayer
- `GET /ws/multiplayer?userId={uuid}`: WebSocket connection.
