package storage

import (
	"context"
	"io"
)

type Storage interface {
	Upload(ctx context.Context, bucketName, objectName string, reader io.Reader, size int64, contentType string) (string, error)
	GetURL(ctx context.Context, bucketName, objectName string) (string, error)
}
