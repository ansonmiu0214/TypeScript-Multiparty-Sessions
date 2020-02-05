#!/bin/bash

PACKAGES="git default-jdk maven python3-pip python3.7 unzip"

# Get latest packages
echo "Getting latest packages..."
apt-get -y update
apt-get -y install ${PACKAGES}

# Install Python dependencies
echo "Installing Python packages..."
python3.7 -m pip install -r requirements.txt
rm requirements.txt

# Build Scribble
echo "Building Scribble-Java..."
git clone https://github.com/scribble/scribble-java
cd scribble-java
./mvnw install
cd scribble-dist/target/
unzip scribble-dist-0.4.4-SNAPSHOT.zip
chmod +x scribblec.sh