package backend

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"mime"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type ConvertedImage struct {
	Name string    `json:"name"`
	ModTime  time.Time `json:"modTime"`
	Size int64 `json:"size"`
	Path string `json:"path"`
}

type ImageService struct{}

func NewImageService() *ImageService {
	return &ImageService{}
}


// Get
func (i *ImageService) GetConvertedImageBase64(filename string) (string, error) {
  path := filepath.Join("output", filename)

  data, err := os.ReadFile(path)
  if err != nil {
    return "", err
  }

  mimeType := mime.TypeByExtension(filepath.Ext(filename))
  base64Data := base64.StdEncoding.EncodeToString(data)

  // Retorna como data URL
  return fmt.Sprintf("data:%s;base64,%s", mimeType, base64Data), nil
}

func (i *ImageService) GetConvertedImages() ([]ConvertedImage, error) {
  files, err := os.ReadDir("output")
  if err != nil {
    return nil, err
  }

  var convertedImages []ConvertedImage

  for _, file := range files {
    if file.IsDir() {
      continue
    }

    fullPath := filepath.Join("output", file.Name())

    info, err := os.Stat(fullPath)
    if err != nil {
      continue
    }

    content, err := os.ReadFile(fullPath)
    if err != nil {
      continue
    }

    mimeType := mime.TypeByExtension(filepath.Ext(file.Name()))
    base64Data := base64.StdEncoding.EncodeToString(content)
    path := "data:" + mimeType + ";base64," + base64Data

    convertedImages = append(convertedImages, ConvertedImage{
      Name: file.Name(),
      ModTime:  info.ModTime(),
      Size:     info.Size(),
      Path:  path,
    })
  }

  return convertedImages, nil
}

// Delete
func (i *ImageService) DeleteConvertedImage(filename string) error {
	err := os.Remove(filepath.Join("output", filename))
	if err != nil {
		return fmt.Errorf("error when deleting file: %w", err)
	}

	return nil
}

// Convert
func (i *ImageService) ConvertBase64Image(filename string, base64Data string, format string, quality int) (string, error) {
	if quality < 1 || quality > 100 {
		return "", fmt.Errorf("error: invalid quality value. quality must be within 0 and 100")
	}

	decoded, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return "", fmt.Errorf("error when decondig base64: %w", err)
	}

	img, _, err := image.Decode(bytes.NewReader(decoded))
	if err != nil {
		return "", fmt.Errorf("error when decoding image: %s", err)
	}

	err = os.MkdirAll("output", 0755)
	if err != nil {
		return "", fmt.Errorf("error when creating output dir: %w", err)
	}

	nameWithoutExt := strings.TrimSuffix(filename, filepath.Ext(filename))
	name := nameWithoutExt + "." + format
	outPath := filepath.Join("output", name)

	outFile, err := os.Create(outPath)
	if err != nil {
		return "", fmt.Errorf("error when creating output file: %w", err)
	}
	defer outFile.Close()

	fmt.Println("awdawdawd", format)
	switch strings.ToLower(format) {
	case "png":
		err = png.Encode(outFile, img)
	case "jpg", "jpeg":
		err = jpeg.Encode(outFile, img, &jpeg.Options{Quality: quality})
	default:
		return "", fmt.Errorf("format '%s' not suported", format)
	}

	if err != nil {
		return "", fmt.Errorf("error when encoding image: %w", err)
	}

	return outPath, nil
}
