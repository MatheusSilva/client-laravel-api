<!DOCTYPE html> 
<html lang="pt-br">
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Cat&aacute;logo de Jogos</title>
	<link rel="stylesheet" type="text/css" href="../../css/layoutadm.css" />
	
	<script type="text/javascript">
		function confirmar(codigo)
		{
			var ok = window.confirm("Você tem certeza que deseja excluir");
			if (ok)	{	
				location.href="../adaptadores/adaptador.torcedor.php?acao=3&codigo=" + codigo;
			}	
		}
	</script>
	</head>
	
	<body>
		<div id="geral">
			<div id="cabecalho">
			</div>
			
			<header>
                <nav id="menu_superior">
                    <a href="../paginas/home.php">Home</a> ::
					<a href="../paginas/cadastros.php">Cadastros</a> ::
					<a href="../paginas/administrar.php">Administrar</a> ::	
					<a href="../paginas/consultas.php">Consultas</a> ::
					<a href="../formularios/logout.php">Sair</a>
                </nav>
            </header>
			
			<div id="conteudo">
				<h2>Lista de Torcedores</h2>

				<?php
                if (isset($_GET['msg'])) {
                    echo urldecode($_GET['msg']);
                }
                ?>

				<table width="80%" class="lista">
					<tr class="primeira_linha">
						<td>C&oacute;digo</td>
						<td>Nome</td>
						<td>A&ccedil;&otilde;es</td>
					</tr>

				    <?php
                    require_once "../../api/v1/torcedor/Torcedor.php";
                    use matheus\sistemaRest\api\v1\model\Torcedor;
                    $objTorcedor = new Torcedor();
                    $vetor = $objTorcedor->listarTudo();
                    
                    if ($vetor != 0) {
                        $linha = 0;
                        foreach ($vetor as $info) {
                            if (++$linha % 2 == 0) {
                                echo '<tr class="linha_par">';
                            } else {
                                echo '<tr class="linha_impar">';
                            }
                            
                            $codigo = $info['codigo_torcedor'];
                            $nome   = $info['nome'];
                            echo "<td>$codigo</td>";
                            echo "<td>$nome</td>";
                            
                            $detalhes = "<a href=\"../consultas/detalhe.torcedor.php?id=$codigo\">[D]</a>";
                            $alterar = "<a href=\"../formularios/alterar.torcedor.htm?id=$codigo\">[A]</a>";
                            $excluir = "<a href=\"javascript:confirmar($codigo)\">[X]</a>";
                            
                            echo "<td>$detalhes $alterar $excluir</td>";
                            echo '</tr>';
                        }
                    } else {
                        echo 'Nenhuma torcedor cadastrado';
                    }
                    ?>
                    
				</table>
					
			</div>
			
			<footer id="rodape">
            </footer>       	
		</div>
	</body>
</html>
