#!/bin/bash
set -e

echo "=== Pulling latest changes from Git ==="
git pull origin main

echo "=== Rebuilding and restarting containers ==="
docker compose up -d --build

echo "=== Pruning unused images ==="
docker image prune -f

echo "=== Maxwell Website & Admin successfully updated! ==="
