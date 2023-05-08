#!/usr/bin/env bash

# This checks the remote repository for potential updates. This script is
# called via GitHub Action.

REMOTE_REPO=chbrown/overdrive

VERSION_FILE=./version
DOCKERFILE=./Dockerfile
OVERDRIVE_VERSION_TEXT="overdrive="

TAG_JSON=$(curl "https://api.github.com/repos/$REMOTE_REPO/tags" -s)
TAG_VERSION=$(echo "$TAG_JSON" | jq -r '.[0].name')
ZIP_FILE=$(echo "$TAG_JSON" | jq -r '.[0].zipball_url')

FILE_VERSION=$(grep -E "^$OVERDRIVE_VERSION_TEXT.+?$" "$VERSION_FILE" | sed "s/^${OVERDRIVE_VERSION_TEXT}//")

ZIP_ROOT=${ZIP_FILE%"$TAG_VERSION"}

echo "Existing/local version: $FILE_VERSION | Remote version: $TAG_VERSION"

if [[ $FILE_VERSION != "$TAG_VERSION" ]]; then
    echo "Overdrive version update. Updating..."

    # Update the Version File
    sed -i -e "s/$OVERDRIVE_VERSION_TEXT$FILE_VERSION/$OVERDRIVE_VERSION_TEXT$TAG_VERSION/g" "$VERSION_FILE"
    # Update the Dockerfile
    sed -i -e "s~$ZIP_ROOT$FILE_VERSION~$ZIP_ROOT$TAG_VERSION~g" "$DOCKERFILE"

    echo "Updated Version file and Dockerfile."
else
    echo "Overdrive is already up-to-date."
fi
