#!/bin/bash

echo "Pulling latest code..."
git pull

echo "Building new Docker image..."
docker build -t kpi-cms:latest .

echo "Ensuring overlay network exists..."
docker network create -d overlay kpi_network 2>/dev/null || true

echo "Deploying stack..."
export $(grep -v '^#' .env | xargs)
docker stack deploy -c docker.cms.yml kpi_cms

echo "Forcing service update to apply new image..."
docker service update --force kpi_cms_cms

echo "Deploy CMS completed!"
