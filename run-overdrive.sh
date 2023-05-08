#!/usr/bin/env bash

if [[ ! -z $DESTINATION_FOLDER ]]; then
    cd $DESTINATION_FOLDER
fi

SOURCE_PREPEND=""

if [[ ! -z $SOURCE_FOLDER ]]; then
    SOURCE_PREPEND=$SOURCE_FOLDER/
fi

/usr/bin/overdrive "$1" "$SOURCE_PREPEND$2" "$3"
