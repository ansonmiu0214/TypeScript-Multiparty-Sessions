#!/usr/bin/bash

cd ~
echo "Generating APIs for Battleships"

python3.8 -m codegen protocols/Battleships.scr Battleships Svr node -o case-studies/Battleships/src

python3.8 -m codegen protocols/Battleships.scr Battleships P1 browser -s Svr -o case-studies/Battleships/client/src

python3.8 -m codegen protocols/Battleships.scr Battleships P2 browser -s Svr -o case-studies/Battleships/client/src

echo "SUCCESS: generated APIs for Battleships"
echo "Building Battleships application"
cd case-studies/Battleships
npm run build

echo "SUCCESS: built Battleships"
echo "To run the case study, you can do"
echo "  $ cd ~/case-studies/Battleships"
echo "  $ npm start"
echo ""
echo "and visit http://localhost:8080"
echo ""