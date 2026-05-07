#!/bin/sh
echo "Running migrations..."
npm run migrate:up
echo "Starting server..."
node dist/index.js
