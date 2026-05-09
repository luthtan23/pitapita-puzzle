//go:build mage
// +build mage

package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/magefile/mage/mg"
)

// Default target to run when none is specified
var Default = Run

// Build the application binary
func Build() error {
	fmt.Println("Building...")
	if err := os.MkdirAll("bin", 0755); err != nil {
		return err
	}
	cmd := exec.Command("go", "build", "-o", "bin/server", "cmd/server/main.go")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// Run the application
func Run() error {
	mg.Deps(Build)
	fmt.Println("Starting server...")
	cmd := exec.Command("./bin/server")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// Dev runs the application using go run (faster for development)
func Dev() error {
	fmt.Println("Starting server (dev mode)...")
	cmd := exec.Command("go", "run", "cmd/server/main.go")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// Test runs the project tests
func Test() error {
	fmt.Println("Running tests...")
	cmd := exec.Command("go", "test", "./...")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// Install downloads the dependencies
func Install() error {
	fmt.Println("Installing dependencies...")
	cmd := exec.Command("go", "mod", "download")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// Clean removes build artifacts
func Clean() {
	fmt.Println("Cleaning...")
	os.RemoveAll("bin")
}

// DockerBuild builds a docker image
func DockerBuild() error {
	fmt.Println("Building Docker image...")
	cmd := exec.Command("docker", "build", "-t", "pitapita-backend", ".")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
