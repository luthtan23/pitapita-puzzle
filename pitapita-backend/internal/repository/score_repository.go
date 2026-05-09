package repository

import (
	"github.com/luthtan23/pitapita-puzzle/backend/internal/models"
	"gorm.io/gorm"
)

type ScoreRepository struct {
	db *gorm.DB
}

func NewScoreRepository(db *gorm.DB) *ScoreRepository {
	return &ScoreRepository{db: db}
}

func (r *ScoreRepository) Create(score *models.Score) error {
	return r.db.Create(score).Error
}

func (r *ScoreRepository) GetTopScores(difficulty string, limit int) ([]models.Score, error) {
	var scores []models.Score
	query := r.db.Preload("User").Order("moves ASC, time_secs ASC").Limit(limit)
	if difficulty != "" {
		query = query.Where("difficulty = ?", difficulty)
	}
	err := query.Find(&scores).Error
	return scores, err
}
