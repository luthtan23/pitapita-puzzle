package models

import (
	"time"

	"github.com/google/uuid"
)

type Score struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID     uuid.UUID `gorm:"type:uuid;index" json:"userId"`
	User       User      `gorm:"foreignKey:UserID" json:"user"`
	Difficulty string    `gorm:"not null" json:"difficulty"`
	Moves      int       `gorm:"not null" json:"moves"`
	TimeSecs   int       `gorm:"not null" json:"timeSecs"`
	Date       time.Time `gorm:"not null" json:"date"`
}

func (s *Score) BeforeCreate(tx interface{}) (err error) {
	s.ID = uuid.New()
	if s.Date.IsZero() {
		s.Date = time.Now()
	}
	return
}
