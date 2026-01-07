package gui

import (
	"rush-mode-tracker/infra/command"
	"rush-mode-tracker/infra/query"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/data/binding"
	"fyne.io/fyne/v2/widget"
	"github.com/sqweek/dialog"
)

type GamePathUI struct {
	App      fyne.App
	Window   fyne.Window
	AskGamePathCommandHandler command.AskGamePathCommandHandler
	GetGamePathCommandHandler query.GetGamePathQueryHandler
	FileFullProcessingCommandHandler command.FileFullProcessingCommandHandler
	GamePathBinding binding.String
}

func (g *GamePathUI) chooseFolder() {
	folderPath, err := dialog.Directory().Title("Select the game directory").Browse()
    if err != nil {
        return
    }

	if folderPath == "" {
		return
	}

	existing, err := g.GamePathBinding.Get()
	if err != nil {
		panic(err)
	}

	if existing == folderPath {
		return
	}

    g.AskGamePathCommandHandler.Handle(command.AskGamePathCommand{
        GetUserPath: func() string {
            return folderPath
        },
    })
	g.GamePathBinding.Set(folderPath)
	g.FileFullProcessingCommandHandler.Handle(command.FileFullProcessingCommand{
		WowPath: folderPath,
	})
}

func (g *GamePathUI) getMainScreenContent(cancelWatchHandler func()) fyne.CanvasObject {
	gamePath, err := g.GetGamePathCommandHandler.Handle(query.GetGamePathQuery{})
	if err != nil {
		panic(err)
	}
	indication := widget.NewLabel("Please select the game folder to ensure accurate scanning.\nThe next line should end with: \\_classic_era_ : ")

	g.GamePathBinding.Set(gamePath.Path)
	if gamePath.Path != "" {
		g.FileFullProcessingCommandHandler.Handle(command.FileFullProcessingCommand{
			WowPath: gamePath.Path,
		})
	}
	locationLabel := widget.NewLabel("Selected Game Folder : ")
	label := widget.NewLabelWithData(g.GamePathBinding)
	row := container.NewHBox(locationLabel, label)
	refreshBtn := widget.NewButton("Change game location", func() {
		cancelWatchHandler()
		g.chooseFolder()
	})

	return container.NewVBox(indication, row, refreshBtn)
}