<?php
require_once "../../vendor/autoload.php";
use matheus\sistemaRest\api\v1\lib\Login;

Login::entrar($_POST['txtTorcedor'], $_POST['txtSenha']);
