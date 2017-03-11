<!DOCTYPE html> 
<html lang="pt-br">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Cat&aacute;logo de Times</title>
		<link rel="stylesheet" type="text/css" href="../../css/layoutadm.css" />
		<script type="text/javascript" src="../../javascript/scripts.min.js"> </script>
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
				<h2 class="titulo">Cadastro de Torcedores</h2>
					
				<form method="post" 
				action="../adaptadores/adaptador.torcedor.php"
				name="frmCadastro"
				id="frmCadastro" onSubmit="">
					<table>
						<tr>
							<td>Nome:</td>
							<td>
								<input type="text" name="txtNome" id="txtNome" />
							</td>
						</tr>
						
						<tr>
							<td>Login:</td>
							<td>
								<input type="text" name="txtLogin" id="txtLogin" />
							</td>
						</tr>

						<tr>
							<td>E-mail:</td>
							<td>
								<input type="text" name="txtEmail" id="txtEmail" />
							</td>
						</tr>
						
						<tr>
							<td>Senha:</td>
							<td>
								<input type="password" name="txtSenha" id="txtSenha" />
							</td>
						</tr>
						
						<tr>
							<td> Confirma Senha:</td>
							<td>
								<input type="password" name="txtConfSenha" id="txtConfSenha"/>
							</td>
						</tr>
						
						<tr>
							<td colspan="2">
								<input type="hidden" name="acao" value="1" />
								
								
								<input type="submit" name="btnCadastrar" 
									value="Cadastrar" id="btnCadastrar"/>
									
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
