package service

import (
	"github.com/google/uuid"
	"github.com/luthtan23/pitapita-puzzle/backend/internal/models"
	"github.com/luthtan23/pitapita-puzzle/backend/internal/repository"
)

type ScoreService struct {
	repo *repository.ScoreRepository
}

func NewScoreService(repo *repository.ScoreRepository) *ScoreService {
	return &ScoreService{repo: repo}
}

func (s *ScoreService) SubmitScore(userID uuid.UUID, difficulty string, moves, timeSecs int) (*models.Score, error) {
	score := &models.Score{
		UserID:     userID,
		Difficulty: difficulty,
		Moves:      moves,
		TimeSecs:   timeSecs,
	}

	if err := s.repo.Create(score); err != nil {
		return nil, err
	}

	return score, nil
}

func (s *ScoreService) GetLeaderboard(difficulty string) ([]models.Score, error) {
	return s.repo.GetTopScores(difficulty, 50)
}
