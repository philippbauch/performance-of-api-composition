#!/bin/bash
PROTO_DIR="proto"
if [ -d $PROTO_DIR ]; then
    echo "Remove existing proto directory"
    rm -rf $PROTO_DIR
fi

echo "Create new proto directory"
mkdir $PROTO_DIR

echo "Copy proto files"
cp ../../proto/* $PROTO_DIR
