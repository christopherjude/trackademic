#!/bin/bash

# Azure App Service startup script for TrackAdemic backend
echo "Starting TrackAdemic backend..."

# Ensure we're using the right Python version
python3 --version

# Install dependencies if not already installed
echo "Installing dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Start the application
echo "Starting Gunicorn server..."
python3 -m gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
