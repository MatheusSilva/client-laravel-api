<?php
require_once "../../vendor/autoload.php";

use MatthiasMullie\Minify;

$basePathJs     = "/var/www/html/client-laravel-api/javascript/";
$minifiedPathJs = $basePathJs.'scripts.min.js';

$minifier = new Minify\JS($basePathJs.'util.js');
$minifier->add($basePathJs.'login.js');
$minifier->add($basePathJs.'categoria.js');
$minifier->add($basePathJs.'divisao.js');
$minifier->add($basePathJs.'tecnico.js');
$minifier->add($basePathJs.'time.js');
$minifier->add($basePathJs.'torcedor.js');
$minifier->minify($minifiedPathJs);
chmod($minifiedPathJs, 0777);
echo "arquivos unificados e minificados.";
