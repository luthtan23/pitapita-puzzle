package storage

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"

	"cloud.google.com/go/storage"
	"google.golang.org/api/option"
)

type GCSStorage struct {
	client *storage.Client
}

func NewGCSStorage() *GCSStorage {
	ctx := context.Background()
	// Assumes GOOGLE_APPLICATION_CREDENTIALS env var is set
	client, err := storage.NewClient(ctx)
	if err != nil {
		// Fallback to credentials file if specified
		credsFile := os.Getenv("GOOGLE_CREDENTIALS_FILE")
		if credsFile != "" {
			client, err = storage.NewClient(ctx, option.WithCredentialsFile(credsFile))
		}
		if err != nil {
			log.Fatalf("Failed to initialize GCS: %v", err)
		}
	}

	return &GCSStorage{client: client}
}

func (g *GCSStorage) Upload(ctx context.Context, bucketName, objectName string, reader io.Reader, size int64, contentType string) (string, error) {
	wc := g.client.Bucket(bucketName).Object(objectName).NewWriter(ctx)
	wc.ContentType = contentType
	
	if _, err := io.Copy(wc, reader); err != nil {
		return "", err
	}
	if err := wc.Close(); err != nil {
		return "", err
	}

	return g.GetURL(ctx, bucketName, objectName)
}

func (g *GCSStorage) GetURL(ctx context.Context, bucketName, objectName string) (string, error) {
	// Simple public URL format (assumes bucket/object is public)
	// For private objects, use SignedURL
	return fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, objectName), nil
}
