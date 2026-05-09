package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/luthtan23/pitapita-puzzle/backend/internal/api/handlers"
	"github.com/luthtan23/pitapita-puzzle/backend/internal/api/middleware"
	"github.com/luthtan23/pitapita-puzzle/backend/internal/repository"
	"github.com/luthtan23/pitapita-puzzle/backend/internal/service"
	"github.com/luthtan23/pitapita-puzzle/backend/internal/websocket"
	"github.com/luthtan23/pitapita-puzzle/backend/pkg/db"
	"github.com/luthtan23/pitapita-puzzle/backend/pkg/redis"
	"github.com/luthtan23/pitapita-puzzle/backend/pkg/storage"
	cors "github.com/rs/cors/wrapper/gin"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize Database
	database := db.Init()

	// Initialize Redis
	redis.Init()

	// Initialize Storage (Minio by default, could be GCS based on env)
	var store storage.Storage
	if os.Getenv("STORAGE_TYPE") == "gcs" {
		store = storage.NewGCSStorage()
	} else {
		store = storage.NewMinioStorage()
	}
	_ = store // Will be used in services

	// Initialize Repositories
	userRepo := repository.NewUserRepository(database)
	scoreRepo := repository.NewScoreRepository(database)

	// Initialize Services
	userService := service.NewUserService(userRepo)
	scoreService := service.NewScoreService(scoreRepo)

	// Initialize Handlers
	authHandler := handlers.NewAuthHandler(userService)
	scoreHandler := handlers.NewScoreHandler(scoreService)

	// Initialize WebSocket Hub
	hub := websocket.NewHub()
	go hub.Run()

	// Setup Router
	router := gin.Default()

	// CORS
	router.Use(cors.AllowAll()) // In production, restrict to allowed origins

	// API Routes
	v1 := router.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		scores := v1.Group("/scores")
		{
			scores.GET("/leaderboard", scoreHandler.GetLeaderboard)
			scores.POST("/", middleware.AuthMiddleware(), scoreHandler.Submit)
		}

		users := v1.Group("/users")
		users.Use(middleware.AuthMiddleware())
		{
			users.GET("/me", func(c *gin.Context) {
				userID := c.MustGet("userId").(uuid.UUID)
				user, err := userService.GetUserByID(userID.String())
				if err != nil {
					c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
					return
				}
				c.JSON(http.StatusOK, user)
			})
		}
	}

	// WebSocket Route
	router.GET("/ws/multiplayer", func(c *gin.Context) {
		websocket.ServeWs(hub, c)
	})

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
