package command

import (
	"log"
	"path/filepath"
	"rush-mode-tracker/infra/repository"
)

type FileFullProcessingCommand struct {
	WowPath string
}

type FileFullProcessingCommandHandler struct {
	WatchFileCommandHandlers []WatchFileCommandHandler
}

func (h *FileFullProcessingCommandHandler) Handle(command FileFullProcessingCommand) error {
	findFileCommand := FindFileCommand{
		FolderPath: command.WowPath,
	}

	findFileCommandHandler := FindFileCommandHandler{}

	filePaths, err := findFileCommandHandler.Handle(findFileCommand)
	if err != nil {
		panic(err.Error())
	}
	log.Println("[RUSH-MODE-TRACKER] Found Rush_Mode.lua files : ", filePaths)

	for _, file := range filePaths {
		watchFileCommand := WatchFileCommand{
			FolderPath: filepath.Dir(file),
		}

		buildBatchFromFileCommand := BuildBatchFromFileCommand{
			FilePath: file,
		}
		
		buildBatchFromFileCommandHandler := BuildBatchFromFileCommandHandler{
			FileReader: repository.FileReaderImpl{},
		}

		watchFileCommandHandler := WatchFileCommandHandler{
			FileWatcher: repository.FileWatcherImpl{},
			HandleOnChange: func() {
				playerBatch, progressionsBatch, fraudMailsBatch, fraudTradesBatch, rushId, err := buildBatchFromFileCommandHandler.Handle(buildBatchFromFileCommand)
				if err != nil {
					panic(err)
				}
				processAndSendBatchOfDeathCommand := ProcessAndSendBatchCommand{					
					PlayerBatch: playerBatch,
					ProgressionsBatch: progressionsBatch,
					FraudMailBatch: fraudMailsBatch,
					FraudTradeBatch: fraudTradesBatch,
					RushId: rushId,
				}

				processAndSendBatchOfDeathCommandHandler := ProcessAndSendBatchCommandHandler{
					PlayerSender: repository.PlayerSenderImpl{},
				}

				err = processAndSendBatchOfDeathCommandHandler.Handle(processAndSendBatchOfDeathCommand)
				if err != nil {
					panic(err)
				}
			},
		}
		h.WatchFileCommandHandlers = append(h.WatchFileCommandHandlers, watchFileCommandHandler)
		err = watchFileCommandHandler.Handle(watchFileCommand)
		if err != nil {
			panic(err.Error())
		}
	}

	return nil
}

func (h *FileFullProcessingCommandHandler) Cancel() {
	for _, watchFileCommandHandler := range h.WatchFileCommandHandlers {
		watchFileCommandHandler.FileWatcher.Cancel()
	}
}