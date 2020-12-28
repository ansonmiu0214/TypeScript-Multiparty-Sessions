CLIENT="cd clients/mpst && npm start"
SERVER="npm run start-mpst -- $@"

BASEDIR=$(dirname "$0")
cd $BASEDIR/..
node_modules/.bin/concurrently -k "$CLIENT" "$SERVER"