package repository

import (
	"log"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
)

type FileWatcherImpl struct {
	Watcher *fsnotify.Watcher
	cancel chan struct{}
}

func (f *FileWatcherImpl) Watch(folderPath string, handleOnChange func()) {
	f.Watcher, _ = fsnotify.NewWatcher()

	f.cancel = make(chan struct{})

	err := f.Watcher.Add(folderPath)
	if err != nil {
		panic(err)
	}

	go func() {
		log.Println("[RUSH-MODE-TRACKER] Start Watching : " + folderPath + " folder")
		defer f.Watcher.Close()
		eventPending := false
		for {
			select {
				case event, ok := <-f.Watcher.Events:
					if !ok {
						return
					}

					if event.Op&fsnotify.Write == fsnotify.Write || event.Op&fsnotify.Create == fsnotify.Create {
						if (strings.HasSuffix(event.Name, "Rush_Mode.lua")) {
							if !eventPending {
								eventPending = true
								go func() {
									log.Println("[RUSH-MODE-TRACKER] Rush_Mode.lua file changed")
									time.Sleep(5000 * time.Millisecond)
									handleOnChange()
									eventPending = false
								}()
							}
						}
					}
				case err, ok := <-f.Watcher.Errors:
					if !ok {
						return
					}
					panic(err)

				case <-f.cancel:
					log.Println("[RUSH-MODE-TRACKER] FileWatcher canceled for : " + folderPath)
					return
			}
		}
	}()
}

func (f *FileWatcherImpl) Cancel() {
	close(f.cancel)
}