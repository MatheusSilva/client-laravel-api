gulp concatena

uglifyjs scripts.js \
         -o scripts.min.js -c -m \
         --source-map "root='http://localhost/client-laravel-api/javascript',url='scripts.min.js.map'"
