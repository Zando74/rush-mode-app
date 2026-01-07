package query

import (
	"rush-mode-tracker/infra/entity"
	"rush-mode-tracker/infra/repository"
)

type GetGamePathQuery struct {}

type GetGamePathQueryHandler struct {
	GamePathRepository repository.JSONGamePathRepository
}

func (h *GetGamePathQueryHandler) Handle(query GetGamePathQuery) (*entity.GamePath, error) {

	gamePath, err := h.GamePathRepository.Find()
	if err != nil {
		return &entity.GamePath{ Path: ""}, nil
	}

	return gamePath, nil
}