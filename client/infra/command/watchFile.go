package command

import (
	"rush-mode-tracker/infra/repository"
)

type WatchFileCommand struct {
	FolderPath string
}

type WatchFileCommandHandler struct {
	FileWatcher repository.FileWatcherImpl
	HandleOnChange func()
}

func (h *WatchFileCommandHandler) Handle(command WatchFileCommand) error {
	h.FileWatcher.Watch(command.FolderPath, h.HandleOnChange)
	return nil
}