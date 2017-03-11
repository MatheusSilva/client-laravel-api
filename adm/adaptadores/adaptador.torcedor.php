<?php

$acao = $_REQUEST['acao'];
require_once "../../api/v1/torcedor/Torcedor.php";

use matheus\sistemaRest\api\v1\model\Torcedor;

$torcedor = new Torcedor();

if ($acao == 1) {
    // inserir
    $nome       = $_POST['txtNome'];
    $login      = $_POST['txtLogin'];
    $senha      = $_POST['txtSenha'];
    $email      = $_POST['txtEmail'];
    
    $torcedor->setNome($nome);
    $torcedor->setLogin($login);
    $torcedor->setSenha($senha);
    $torcedor->setEmail($email);

    if ($torcedor->inserir() == 1) {
        $msg = urlencode('Torcedor cadastrado com sucesso!');
    } else {
        $msg = urlencode('Problemas ao cadastrar torcedor!');
    }

    header("location:../formularios/cadastro.torcedor.php?msg=$msg");
} elseif ($acao == 2) {
    // alterar
    $codigo   = $_POST['codigo'];
    $senha    = $_POST['txtSenha'];
    $nome     = $_POST['txtNome'];
    $login    = $_POST['txtLogin'];
    $email    = $_POST['txtEmail'];

    $torcedor->setCodigoTorcedor($codigo);
    $torcedor->setSenha($senha);
    $torcedor->setNome($nome);
    $torcedor->setLogin($login);
    $torcedor->setEmail($email);

    if ($torcedor->alterar() == 1) {
        $msg = urlencode("Torcedor alterado com sucesso!");
    } else {
        $msg = urlencode("Problemas ao alterar torcedor!");
    }

    header("location:../admin/lista.torcedor.php?msg=$msg");
} elseif ($acao == 3) {
    // excluir
    $codigo   = $_GET['codigo'];

    if ($torcedor->excluir($codigo) == 1) {
        $msg = urlencode('Torcedor excluido com sucesso!');
    } else {
        $msg = urlencode('Problemas ao excluir torcedor!');
    }

    header("location:../admin/lista.torcedor.php?msg=$msg");
}
