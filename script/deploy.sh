#!/bin/bash

# exit on error
set -e

# load env
if [ -f .env.deploy ]; then
    set -a
    source .env.deploy
    set +a
else
    echo ".env.deploy file not found. please create one with REMOTE_USER, REMOTE_HOST, and REMOTE_PATH"
    exit 1
fi

EXCLUDES=(
    --exclude "node_modules"
    --exclude ".git"
    --exclude "dist"
    --exclude ".DS_Store"
)

echo "Starting deployment to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

rsync -avz --delete "${EXCLUDES[@]}" ./ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

echo "Deployment complete."

echo ""
echo "You can now SSH into your server and run your app:"
echo "    ssh $REMOTE_USER@$REMOTE_HOST"
echo "    cd $REMOTE_PATH"
echo "    npm install"
echo "    npm run dev"