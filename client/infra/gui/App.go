package gui

import (
	"log"
	"os"
	"rush-mode-tracker/infra/command"
	"rush-mode-tracker/infra/query"
	"rush-mode-tracker/infra/repository"

	_ "embed"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/data/binding"
	"fyne.io/fyne/v2/widget"
	"fyne.io/systray"
)

//go:embed icon.ico
var iconData []byte

type App struct {
	App        fyne.App
	Window     fyne.Window
	GamePathUI GamePathUI
	Started     binding.Bool
	GamePathBinding binding.String
}

func (a *App) Run() {

	a.ShowMainScreen()

	a.Window.Resize(fyne.NewSize(800, 600))

	go func() {
        systray.Run(onReady, onExit)
    }()

	a.Window.SetIcon(fyne.NewStaticResource("icon.ico", iconData))

	a.Window.ShowAndRun()
}

func (a *App) ShowMainScreen() {
	gamePathLabel := widget.NewLabelWithData(a.GamePathUI.GamePathBinding)

	content := container.NewBorder(
		container.NewVBox(
			a.GamePathUI.getMainScreenContent(func() {}),
			container.NewHBox(widget.NewLabel("Game Folder: "), gamePathLabel),
		),      
		NewLogView(),
		nil,      
		nil,      
		nil,
	)

	log.Println("[RUSH-MODE-TRACKER] Application started")



	a.Window.SetContent(content)
}

func NewApp() *App {
	a := app.NewWithID("RUSH-MODE-tracker")
	w := a.NewWindow("RUSH-MODE Tracker")

	repo, err := repository.NewJSONGamePathRepository("RUSH-MODE-tracker")
	if err != nil {
		panic(err)
	}

	gamePath := binding.NewString()

	return &App{
		App:    a,
		Window: w,
		GamePathBinding: gamePath,
		GamePathUI: GamePathUI{
			App: a,
			Window: w,
			AskGamePathCommandHandler: command.AskGamePathCommandHandler{
				GamePathRepository: *repo,
			},
			GetGamePathCommandHandler: query.GetGamePathQueryHandler{
				GamePathRepository: *repo,
			},
			GamePathBinding: gamePath,
		},
		Started: binding.NewBool(),
	}
}

func onReady() {
    systray.SetTitle("RUSH-MODE Tracker")
    systray.SetTooltip("RUSH-MODE Tracker")
	systray.SetIcon(iconData)

    mShow := systray.AddMenuItem("Open", "Open the window")
    mQuit := systray.AddMenuItem("Quit", "Quit the application")

    go func() {
        for {
            select {
            case <-mShow.ClickedCh:
				fyne.Do(func() {
					fyne.CurrentApp().Driver().AllWindows()[0].Show()
				})
            case <-mQuit.ClickedCh:
                systray.Quit()
                return
            }
        }
    }()
}

func onExit() {
	os.Exit(0)
}
