<!DOCTYPE html> 
<html lang="pt-br">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Cat&aacute;logo de Jogos</title>
		<link rel="stylesheet" type="text/css" href="../../css/layoutadm.css" />
	</head>
	
	<body>
		<div id="geral">
			<div id="cabecalho">
			</div>
			
			<header>
		    	<nav id="menu_superior">
	                <a href="../paginas/home.php">Home</a> ::
	                <a href="../paginas/cadastros.php">Cadastros</a> ::
	                <a href="../paginas/consultas.php">Consultas</a> ::
		       		<a href="../formularios/logout.php">Sair</a>
		    	</nav>
      		</header>
			
			<div id="conteudo">
				<h2 class="titulo">Detalhe de Torcedor</h2>
				<?php
                require_once "../../api/v1/torcedor/Torcedor.php";
                use matheus\sistemaRest\api\v1\model\Torcedor;
                $objTorcedor = new Torcedor();

                $codigo = $_GET['id'];
                $dados  = $objTorcedor->listarPorCodigo($codigo);
                
                if ($dados != 0) {
                    $codigo_torcedor = $dados['codigo_torcedor'];
                    $nome             = $dados['nome'];
                    $login             = $dados['login'];
                    echo "C&oacute;digo: $codigo_torcedor <br/>";
                    echo "Nome: $nome <br/>";
                    echo "Login: $login <br/>";
                } else {
                    echo 'Login n&atilde;o encontrado';
                }
                ?>
			</div>
			
			<footer id="rodape">
      		</footer>
      		    	
		</div>
	</body>
</html>
