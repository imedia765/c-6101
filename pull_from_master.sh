#!/bin/bash

# Variables
REPO_URL="https://github.com/imedia765/s-935078.git"
BRANCH="main"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Success/Failure Handler
handle_status() {
    if [ $? -eq 0 ]; then
        echo "SUCCESS: $1"
    else
        echo "FAILURE: $1"
        exit 1
    fi
}

# Step 0: Check if Git is installed
if ! command_exists git; then
    echo "Error: Git is not installed. Please install Git to use this script."
    exit 1
else
    echo "SUCCESS: Git is installed."
fi

# Step 1: Check if this is a Git repository
if [ ! -d ".git" ]; then
    echo "This directory is not a Git repository. Initializing a new Git repository..."
    git init
    handle_status "Git repository initialized."
else
    echo "SUCCESS: This is a valid Git repository."
fi

# Step 2: Check if remote is set
echo "Checking if remote 'origin' is set..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ "$REMOTE_URL" != "$REPO_URL" ]; then
    echo "Remote 'origin' is not set to the target repository. Setting it now..."
    git remote remove origin 2>/dev/null
    git remote add origin "$REPO_URL"
    handle_status "Remote 'origin' set to $REPO_URL."
else
    echo "SUCCESS: Remote 'origin' is correctly set to $REPO_URL."
fi

# Step 3: Ensure we are on the correct branch
echo "Ensuring we are on the $BRANCH branch..."
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "Switching to $BRANCH branch..."
    git checkout "$BRANCH" 2>/dev/null || {
        echo "Branch $BRANCH does not exist. Creating it now..."
        git checkout -b "$BRANCH"
    }
    handle_status "Switched to $BRANCH branch."
else
    echo "SUCCESS: Already on $BRANCH branch."
fi

# Step 4: Prompt for confirmation to delete current Codespace repo
echo "WARNING: This will delete your current Codespace repository."
echo "Are you sure you want to continue? This cannot be undone. (y/n)"
read -r DELETE_CONFIRMATION

if [[ "$DELETE_CONFIRMATION" != "y" ]]; then
    echo "Aborting. The Codespace repository will not be deleted."
    exit 0
fi

# Step 5: Delete the current repository files and clean up
echo "Deleting the current repository files and cleaning up..."
rm -rf .git
rm -rf *
handle_status "Current repository deleted (excluding the master repo)."

# Step 6: Pull the master repository (without overwriting the master)
echo "Pulling the latest changes from $REPO_URL..."
git init
git remote add origin "$REPO_URL"
git fetch origin "$BRANCH"
git reset --hard origin/"$BRANCH"
handle_status "Successfully pulled the master repository and reset the codespace."

# Final success message
echo "Codespace repository has been reset and master repo content has been pulled successfully!"