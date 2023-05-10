#!/usr/bin/env bash

# This checks the remote repository for potential updates. This script is
# called via GitHub Action.

REMOTE_REPO=linuxserver/docker-baseimage-alpine

VERSION_FILE=./version
DOCKERFILE=./Dockerfile
BASEFILE_VERSION_TEXT="baseimage=lsiobase/alpine:"
IMAGE_VERSION_PREFIX="ls"

# shellcheck disable=SC2005
RELEASE_JSON=$(echo "$(curl "https://api.github.com/repos/$REMOTE_REPO/releases/latest" -s)")
# shellcheck disable=SC2086
RELEASE_TAG=$(echo $RELEASE_JSON | jq -r '.tag_name')
RELEASE_VERSION=$(echo "$RELEASE_TAG" | grep -oE "$IMAGE_VERSION_PREFIX.+?$" | sed "s/$IMAGE_VERSION_PREFIX//")

FILE_TAG=$(grep -E "^$BASEFILE_VERSION_TEXT.+?$" "$VERSION_FILE" | sed "s~^${BASEFILE_VERSION_TEXT}~~")
FILE_VERSION=$( echo "$FILE_TAG" | grep -oE "$IMAGE_VERSION_PREFIX.+?$" | sed "s/$IMAGE_VERSION_PREFIX//")

echo "Existing/local version: $FILE_VERSION ($FILE_TAG) | Remote version: $RELEASE_VERSION ($RELEASE_TAG)"

if [[ $FILE_VERSION != "$RELEASE_VERSION" ]]; then
    echo "Overdrive version update. Updating..."

    # Update the Version File
    sed -i -e "s~$FILE_TAG~$RELEASE_TAG~g" "$VERSION_FILE"
    # Update the Dockerfile
    sed -i -e "s~$FILE_TAG~$RELEASE_TAG~g" "$DOCKERFILE"

    echo "Updated Version file and Dockerfile."
else
    echo "Overdrive is already up-to-date."
fi
