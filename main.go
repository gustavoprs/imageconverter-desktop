package main

import (
	"embed"
	"wails-test/backend"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	imageService := backend.NewImageService()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "ImageConverter",
		MinWidth:  640,
		MinHeight: 550,
		Width:     800,
		Height:    550,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 250, G: 250, B: 250, A: 0},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			imageService,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}

}
