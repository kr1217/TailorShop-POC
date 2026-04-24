#!/bin/sh

# Start the backend in the background
echo "Starting backend..."
node /app/backend/src/server.js &
BACKEND_PID=$!

# Start the frontend in the background
echo "Starting frontend..."
node /app/frontend/server.js &
FRONTEND_PID=$!

# Function to handle shutdown
cleanup() {
    echo "Shutting down..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

trap cleanup INT TERM

# Wait for any process to exit
wait -n

# Exit with the status of the process that exited
exit $?
