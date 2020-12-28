CLIENT="cd clients/bare && npm start"
SERVER="npm run start-bare -- $@"

BASEDIR=$(dirname "$0")
cd $BASEDIR/..
node_modules/.bin/concurrently -k "$CLIENT" "$SERVER"