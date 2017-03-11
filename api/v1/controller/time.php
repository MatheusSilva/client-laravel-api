<?php
error_reporting(-1);
ini_set('display_errors', 'on');

require_once "../../../vendor/autoload.php";
use matheus\sistemaRest\api\v1\model\Time;
use matheus\sistemaRest\api\v1\lib\Upload;

$objTime  = new Time();

$objTime->setToken(isset($_REQUEST['tk']) ? $_REQUEST['tk'] : '');
$acao = isset($_REQUEST['a']) ? $_REQUEST['a'] : 0;
$id   = isset($_REQUEST['id']) ? (int) $_REQUEST['id'] : 0;
$p    = isset($_REQUEST['p']) ? $_REQUEST['p'] : '';

header('Content-Type: application/json');

if ($acao === 0) {
    $items   = $objTime->listarTudo();
    $results = array();
    $strErros = $objTime->getErros();

    if (is_array($items) && empty($items) !== true) {
        // get all results
        foreach ($items as $row) {
            $itemArray = array(
                'codigo' => $row['codigo_time'],
                'codigoDivisao' => $row['divisao_codigo_divisao'],
                'nome' => $row['nome'],
                'capa' => $row['capa'],
            );
            array_push($results, $itemArray);
        }

        $json  = "{\"times\":";
        $json .= json_encode($results);
        $json .= "}";
        echo $json;
    } elseif (!empty($strErros)) {
        $json["mensagem"] = $strErros;
        echo json_encode($json);
    } else {
        $json["mensagem"] = "Nenhum time cadastrado";
        echo json_encode($json);
    }
} elseif ($acao == 1) {
    $items  = $objTime->listarPorCodigo($id);
    $strErros = $objTime->getErros();

    if (is_array($items) && empty($items) !== true) {
        echo json_encode($items);
    } elseif (!empty($strErros)) {
        $json["mensagem"] = $strErros;
        echo json_encode($json);
    } else {
        $json["mensagem"] = "Codigo de time invalido";
        echo json_encode($json);
    }
} elseif ($acao == 2) {
    $items = $objTime->listarPorNome($p);
    $strErros = $objTime->getErros();
    
    if (is_array($items) && empty($items) !== true) {
        $json    = "{\"times\":";
        $json   .= json_encode($items);
        $json   .= "}";
        echo $json;
    } elseif (!empty($strErros)) {
        $json["mensagem"] = $strErros;
        echo json_encode($json);
    } elseif (!empty($p)) {
        $json["mensagem"] = "Nenhum time encontrado com o termo buscado";
        echo json_encode($json);
    } else {
        $json["mensagem"] = "Nenhum time cadastrado";
        echo json_encode($json);
    }
} elseif ($acao == 3) {
    $foto               = $_FILES["txtFoto"];
    $nome               = $_POST['txtNome'];
    $codigodivisao      = $_POST['cmbDivisao'];
    $codigocategoria    = $_POST['cmbCategoria'];
    $codigotecnico      = $_POST['cmbTecnico'];
    $desempenhotime     = $_POST['rDesempenhotime'];
    $comprarnovojogador = $_POST['rComprarnovojogador'];
    
    $time = "";

    $capa = Upload::enviar($nome, $foto);

    if ($capa !== '0') {
        $objTime->setNome($nome);
        $objTime->setCapa($capa);
        $objTime->setCodigoDivisao($codigodivisao);
        $objTime->setCodigoCategoria($codigocategoria);
        $objTime->setCodigoTecnico($codigotecnico);
        $objTime->setDesempenhotime($desempenhotime);
        $objTime->setComprarnovojogador($comprarnovojogador);

        $retorno  = $objTime->inserir();
        $strErros = $objTime->getErros();

        if ($retorno === true) {
            $time["mensagem"] = "Time cadastrado com sucesso.";
        } elseif (empty($strErros) === false) {
            $time["mensagem"] = $strErros;
        } else {
            $time["mensagem"] = "Falha ao cadastrar time.";
        }
    } else {
        $time["mensagem"] = "Problemas ao enviar imagem.";
    }
    
    echo json_encode($time);
} elseif ($acao == 4) {
    $foto = "";
    
    if (isset($_FILES["txtFoto"]['name'])) {
        $foto           = $_FILES["txtFoto"];
    }
   
    $nome               = $_POST['txtNome'];
    $codigodivisao      = $_POST['cmbDivisao'];
    $codigocategoria    = $_POST['cmbCategoria'];
    $codigotecnico      = $_POST['cmbTecnico'];

    //$desempenhotime     = $_REQUEST['rDesempenhotime'];
    //$comprarnovojogador = $_REQUEST['rComprarnovojogador'];
    $capa = '';

    if (!empty($nome) && !empty($foto)) {
        $capa = Upload::enviar($nome, $foto);
    }
    
    $time = "";

    if ($capa != '0') {
        $objTime->setCodigoTime($id);
        $objTime->setNome($nome);
        $objTime->setCapa($capa);
        $objTime->setCodigoDivisao($codigodivisao);
        $objTime->setCodigoCategoria($codigocategoria);
        $objTime->setCodigoTecnico($codigotecnico);
        //$objTime->setDesempenhotime($desempenhotime);
        //$objTime->setComprarnovojogador($comprarnovojogador);
        
        $retorno  = $objTime->alterar();
        $strErros = $objTime->getErros();

        if ($retorno === true) {
            $time["mensagem"] = "Time alterado com sucesso.";
        } elseif (empty($strErros) === false) {
            $time["mensagem"] = $strErros;
        } else {
            $time["mensagem"] = "Falha ao alterar time.";
        }
    } else {
        $time["mensagem"] = "Problemas ao enviar imagem.";
    }

    echo json_encode($time);
} elseif ($acao == 5) {
    $time    = "";
    $objTime->setCodigoTime($id);
    $retorno = $objTime->excluir();
    $strErros = $objTime->getErros();
    
    if ($retorno === true) {
        $time["mensagem"] = "Time excluido com sucesso.";
    } elseif (empty($strErros) === false) {
        $time["mensagem"] = $strErros;
    } else {
        $time["mensagem"] = "Falha ao excluir time";
    }
    
    echo json_encode($time);
}

$acao  = "";
$id    = "";
$p     = "";
