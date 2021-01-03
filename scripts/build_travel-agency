#!/usr/bin/bash

cd ~
echo "Generating APIs for TravelAgency"

python3.8 -m codegen protocols/TravelAgency.scr TravelAgency S node -o case-studies/TravelAgency/src

python3.8 -m codegen protocols/TravelAgency.scr TravelAgency A browser -s S -o case-studies/TravelAgency/client/src

python3.8 -m codegen protocols/TravelAgency.scr TravelAgency B browser -s S -o case-studies/TravelAgency/client/src

echo "SUCCESS: generated APIs for TravelAgency"
echo "Building TravelAgency application"
cd case-studies/TravelAgency
npm run build

echo "SUCCESS: built TravelAgency"
echo "To run the case study, you can do"
echo "  $ cd ~/case-studies/TravelAgency"
echo "  $ npm start"
echo ""
echo "and visit http://localhost:8080"
echo ""