<!DOCTYPE html> 
<html lang="pt-br">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Cat&aacute;logo de Jogos</title>
		<link rel="stylesheet" type="text/css" href="../../css/layoutadm.css" />
		<script  src="../../javascript/scripts.min.js"></script>
	</head>
	
	<body>
		<div id="geral">
			<div id="cabecalho">
			</div>
			
			<header>
                <nav id="menu_superior">
                    <a href="../../site/paginas/home.html">Home</a> ::
	            	<a href="../formularios/cadastro.torcedor.php">Cadastrar-se</a> ::
	           	 	<a href="../../site/consultas/lista.time.html">Consultas</a> ::   
					<a href="../../adm/paginas/home.php">Entrar</a>
                </nav>
            </header>
			
			<div id="conteudo" class="form">
				<h2 class="titulo">Login</h2>
				
				<form name="frmLogin" id="frmLogin" >
					<table>
						<tr>
							<td>Login:</td>
							<td>
								<input type="text" name="email" id="email" />
							</td>
						</tr>
						
						<tr>
							<td>Senha:</td>
							<td>
								<input type="password" name="password" id="password" />
							</td>
						</tr>
						
						<tr>
							<td colspan="2">
								<input type="button" name="btnAcessar" 
									value="Acessar" id="btnAcessar" onclick="Login.entrar(frmLogin)" />
									
								<input type="reset" name="btnLimpar"
									value="Limpar" id="btnLimpar" />
							</td>
						</tr>
					</table>
				</form>
				
				<div id="mensagem"></div>
				
			</div>
			
			<footer id="rodape">
            </footer>       	
		</div>
	</body>
</html>
