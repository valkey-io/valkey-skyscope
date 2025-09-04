#!/bin/sh
set -e

echo "Starting valkey-server (instance: ${INSTANCE_NAME:-unnamed})..."
valkey-server --loadmodule /valkey/modules/rejson.so &

VALKEY_PID=$!

timeout=30
echo "Waiting for valkey-server to start on port 6379..."
while ! nc -z localhost 6379; do
  sleep 1
  timeout=$((timeout - 1))
  if [ $timeout -le 0 ]; then
    echo "Error: valkey-server did not start within 30 seconds."
    kill $VALKEY_PID
    exit 1
  fi
done

if [ "${RUN_POPULATE:-1}" = "1" ]; then
  echo "valkey-server is up, running populate_data.py..."
  python3 /usr/local/bin/populate_data.py
else
  echo "RUN_POPULATE is 0 — skipping populate_data.py."
fi

echo "Waiting for valkey-server (PID $VALKEY_PID) to exit..."
wait $VALKEY_PID
