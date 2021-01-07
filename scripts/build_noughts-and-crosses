#!/usr/bin/bash

cd ~
echo "Generating APIs for NoughtsAndCrosses"

python3.8 -m codegen protocols/NoughtsAndCrosses.scr Game Svr node -o case-studies/NoughtsAndCrosses/src

python3.8 -m codegen protocols/NoughtsAndCrosses.scr Game P1 browser -s Svr -o case-studies/NoughtsAndCrosses/client/src

python3.8 -m codegen protocols/NoughtsAndCrosses.scr Game P2 browser -s Svr -o case-studies/NoughtsAndCrosses/client/src

echo "SUCCESS: generated APIs for NoughtsAndCrosses"
echo "Building NoughtsAndCrosses application"
cd case-studies/NoughtsAndCrosses
npm run build

echo "SUCCESS: built NoughtsAndCrosses"
echo "To run the case study, you can do"
echo "  $ cd ~/case-studies/NoughtsAndCrosses"
echo "  $ npm start"
echo ""
echo "and visit http://localhost:8080"
echo ""