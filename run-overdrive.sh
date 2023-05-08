#!/usr/bin/env bash

if [[ -n $DESTINATION_FOLDER ]]; then
    cd "$DESTINATION_FOLDER" || (echo "Directory does not exist" && return)
fi

SOURCE_PREPEND=""

if [[ -n $SOURCE_FOLDER ]]; then
    SOURCE_PREPEND=$SOURCE_FOLDER/
fi

/usr/bin/overdrive "$1" "$SOURCE_PREPEND$2" "$3"
