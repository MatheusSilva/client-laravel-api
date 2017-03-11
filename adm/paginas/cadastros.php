<?php
    require_once "../../vendor/autoload.php";
    use matheus\sistemaRest\api\v1\lib\Login;
    
    Login::verificar();
?>

<!DOCTYPE html> 
<html lang="pt-br">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Cat&aacute;logo de Times</title>
		<link rel="stylesheet" type="text/css" href="../../css/layoutadm.css" />
	</head>
	
	<body>
		<div id="geral">
			<div id="cabecalho">
			</div>
			
			<header>
		    	<nav id="menu_superior">
					<a href="home.php">Home</a> ::
					<a href="cadastros.php">Cadastros</a> ::
					<a href="administrar.php">Administrar</a> ::
					<a href="consultas.php">Consultas</a> ::
					<a href="../formularios/logout.php">Sair</a>
		    	</nav>
      		</header>
			
			<div id="conteudo">
				<ul>
					<li><a href="../formularios/cadastro.tecnico.htm">Cadastrar Tecnico</a></li>
					<li><a href="../formularios/cadastro.time.htm">Cadastrar Time</a></li>
					<li><a href="../formularios/cadastro.categoria.htm">Cadastrar categoria</a></li>
					<li><a href="../formularios/cadastro.divisao.htm">Cadastrar divisao</a></li>
				</ul>
			</div>
			
			<footer id="rodape">
      		</footer>      	
		</div>
	</body>
</html>
