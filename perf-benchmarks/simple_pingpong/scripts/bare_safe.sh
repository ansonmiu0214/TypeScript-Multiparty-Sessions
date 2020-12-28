#!/usr/bin/bash

CLIENT="cd clients/bare_safe && npm start"
SERVER="npm run start-bare_safe -- $@"

node_modules/.bin/concurrently -k "$CLIENT" "$SERVER"