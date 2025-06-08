#!/bin/bash

set -e

echo "Building project..."
if ! npm run build; then
  echo "❌ Build failed! Aborting deployment."
  exit 1
fi

echo "✅ Build successful!"

# Verify build output exists
if [ ! -d "dist" ]; then
  echo "❌ Build output directory 'dist' not found! Aborting deployment."
  exit 1
fi

echo "Removing old docs folder..."
rm -rf docs

echo "Moving build output to docs..."
mv dist docs

# Verify docs folder was created successfully
if [ ! -d "docs" ]; then
  echo "❌ Failed to create docs folder! Aborting deployment."
  exit 1
fi

echo "Adding docs to Git..."
git add docs

echo "Checking git status..."
if git diff --cached --quiet; then
  echo "ℹ️  No changes to commit."
  echo "✅ Deployment complete (no changes)."
  exit 0
else
  echo "Committing changes..."
  if ! git commit -m "deploy build to Github Pages"; then
    echo "❌ Git commit failed! Aborting deployment."
    exit 1
  fi
fi

echo "Pushing to remote..."
if ! git push; then
  echo "❌ Git push failed! Your changes are committed locally but not pushed."
  echo "   You may need to resolve conflicts or check your remote repository."
  exit 1
fi

echo "✅ Publish complete! Your site should be live shortly."