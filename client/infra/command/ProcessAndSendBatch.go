package command

import (
	"rush-mode-tracker/infra/entity"
	"rush-mode-tracker/infra/repository"
)

type ProcessAndSendBatchCommand struct {
	PlayerBatch []entity.Player
	ProgressionsBatch []entity.Progression
	FraudMailBatch []entity.Mail
	FraudTradeBatch []entity.Trade
	RushId string
}

type ProcessAndSendBatchCommandHandler struct {
	PlayerSender repository.PlayerSenderImpl
}


func (h *ProcessAndSendBatchCommandHandler) Handle(command ProcessAndSendBatchCommand) error {
	h.PlayerSender.SendBatch(command.PlayerBatch, command.ProgressionsBatch, command.FraudMailBatch, command.FraudTradeBatch, command.RushId)
	return nil
}