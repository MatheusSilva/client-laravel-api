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
					<li><a href="../consultas/consulta.nometime.htm">Consultar Time por nome</a></li>
					<li><a href="../consultas/consulta.nometecnico.htm">Consultar Tecnico por nome</a></li>
					<li><a href="../consultas/consulta.nomecategoria.htm">Consultar categoria por nome</a></li>
					<li><a href="../consultas/consulta.nomedivisao.htm">Consultar divisao  por nome</a></li>
				</ul>
			</div>
			
			<footer id="rodape">
      		</footer>
		</div>
	</body>
</html>
