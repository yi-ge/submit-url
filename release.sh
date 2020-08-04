#!/bin/bash
PACKAGE_VERSION=$(grep 'version' package.json | cut -d '"' -f4)

yarn build

docker build -t wy373226722/submit-url:$PACKAGE_VERSION .
docker tag wy373226722/submit-url:$PACKAGE_VERSION wy373226722/submit-url:latest
docker push wy373226722/submit-url:$PACKAGE_VERSION
docker push wy373226722/submit-url:latest
