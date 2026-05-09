package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/luthtan23/pitapita-puzzle/backend/internal/service"
)

type ScoreHandler struct {
	scoreService *service.ScoreService
}

func NewScoreHandler(scoreService *service.ScoreService) *ScoreHandler {
	return &ScoreHandler{scoreService: scoreService}
}

type SubmitScoreRequest struct {
	Difficulty string `json:"difficulty" binding:"required"`
	Moves      int    `json:"moves" binding:"required"`
	TimeSecs   int    `json:"timeSecs" binding:"required"`
}

func (h *ScoreHandler) Submit(c *gin.Context) {
	var req SubmitScoreRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userId").(uuid.UUID)

	score, err := h.scoreService.SubmitScore(userID, req.Difficulty, req.Moves, req.TimeSecs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, score)
}

func (h *ScoreHandler) GetLeaderboard(c *gin.Context) {
	difficulty := c.Query("difficulty")
	scores, err := h.scoreService.GetLeaderboard(difficulty)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, scores)
}
