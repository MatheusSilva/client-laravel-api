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
				
				<form method="post" 
				action="../adaptadores/adaptador.login.php"
				name="frmLogin"
				id="frmLogin" onsubmit="return Login.valida()">
					<table>
						<tr>
							<td>Login:</td>
							<td>
								<input type="text" name="txtTorcedor" id="txtTorcedor" />
							</td>
						</tr>
						
						<tr>
							<td>Senha:</td>
							<td>
								<input type="password" name="txtSenha" id="txtSenha" />
							</td>
						</tr>
						
						<tr>
							<td colspan="2">
								<input type="submit" name="btnAcessar" 
									value="Acessar" id="btnAcessar" />
									
								<input type="reset" name="btnLimpar"
									value="Limpar" id="btnLimpar" />
							</td>
						</tr>
					</table>
				</form>
				
				<?php
                if (isset($_GET['msg'])) {
                    echo urldecode($_GET['msg']);
                }
                ?>
				
			</div>
			
			<footer id="rodape">
            </footer>       	
		</div>
	</body>
</html>
