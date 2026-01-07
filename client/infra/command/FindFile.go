package command

import "rush-mode-tracker/infra/repository"

type FindFileCommand struct {
	FolderPath string
}

type FindFileCommandHandler struct {
	FileFinder repository.FileFinderImpl
}

func (h *FindFileCommandHandler) Handle(command FindFileCommand) ([]string, error) {

	files, err := h.FileFinder.Find(command.FolderPath)
	if err != nil {
		return nil, err
	}
	
	return files, nil
}