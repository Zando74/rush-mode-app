package command

import (
	"rush-mode-tracker/infra/entity"
	"rush-mode-tracker/infra/repository"
)

type AskGamePathCommand struct {
	GetUserPath func() string
}

type AskGamePathCommandHandler struct {
	GamePathRepository repository.JSONGamePathRepository
}

func (h *AskGamePathCommandHandler) Handle(command AskGamePathCommand) error {
	path := command.GetUserPath()

	err := h.GamePathRepository.Save(entity.GamePath{ Path: path})
	if err != nil {
		return err
	}
	return nil
}