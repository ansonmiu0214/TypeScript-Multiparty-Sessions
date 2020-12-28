for dir in */; do
    pushd .
    cd $dir
    npm i
    npm run build
    popd
done
