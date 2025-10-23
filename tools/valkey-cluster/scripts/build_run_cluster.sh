#!/bin/sh
set -eu

ENV_FILE="./tools/valkey-cluster/.env"
ENV_EXAMPLE_FILE="./tools/valkey-cluster/.env.example"

if [ ! -f "$ENV_FILE" ]; then
  cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
fi

ANNOUNCE_IP=$(ipconfig getifaddr en0)
if [ -z "$ANNOUNCE_IP" ]; then
  echo "Error: Could not get IP address for en0. Please ensure 'en0' is a valid network interface." >&2
  exit 1
fi

sed -i '' "s/^ANNOUNCE_HOST = .*/ANNOUNCE_HOST = $ANNOUNCE_IP/" "$ENV_FILE"
echo "Set ANNOUNCE_HOST to $ANNOUNCE_IP in $ENV_FILE"

cd tools/valkey-cluster
docker compose --profile populate up --build
