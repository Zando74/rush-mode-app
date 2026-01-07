package command

import (
	"rush-mode-tracker/infra/entity"
	"rush-mode-tracker/infra/repository"
)

type BuildBatchFromFileCommand struct {
	FilePath string
}

type BuildBatchFromFileCommandHandler struct {
	FileReader repository.FileReaderImpl
}

func (h *BuildBatchFromFileCommandHandler) Handle(command BuildBatchFromFileCommand) ([]entity.Player, []entity.Progression, []entity.Mail, []entity.Trade, string, error) {
	
	players, progressions, fraudMails, fraudTrades, rushId, err := h.FileReader.ExtractPlayerData(command.FilePath)
	if err != nil {
		return nil, nil, nil, nil, "", err
	}
	
	return players, progressions, fraudMails, fraudTrades, rushId, nil
}