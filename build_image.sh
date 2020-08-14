#!/bin/bash

PACKAGES="curl git default-jdk maven python3-pip python3.7 unzip graphviz"

# Get latest packages
echo "Getting latest packages..."
apt-get -y update
apt-get -y install ${PACKAGES}

# Install Node
echo "Installing Node and npm..."
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt-get -y install nodejs build-essential

# Install Node dependencies
echo "Installing Node packages..."
npm i -g npm
npm i -g typescript typescript-formatter

# Install Python dependencies
echo "Installing Python packages..."
python3.7 -m pip install -r requirements.txt
rm requirements.txt

# Build Scribble
echo "Building Scribble-Java..."
pushd $(pwd)
git clone https://github.com/scribble/scribble-java
cd scribble-java
./mvnw install
cd scribble-dist/target/
unzip scribble-dist-0.4.4-SNAPSHOT.zip
chmod +x scribblec.sh
popd