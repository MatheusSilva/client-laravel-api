<?php
//declare(strict_types=1);//nao utilizar pois qualquer tipo de dados diferente vai parar a aplicação, validar dados pelo validator

namespace matheus\sistemaRest\api\v1\model;

use matheus\sistemaRest\api\v1\lib\ClasseBase;
use matheus\sistemaRest\api\v1\lib\Conexao;
use Respect\Validation\Validator as v;

/**
* classe Time
*
* @author    Matheus Silva
* @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
*/
class Time extends ClasseBase
{
    /**
    * @access private
    * @var integer Armazena o codigo do time
    */
    private $codigoTime;

    /**
    * @access private
    * @var string Armazena o nome do time
    */
    private $nome;

    /**
    * @access private
    * @var integer Armazena o codigo da categoria
    */
    private $codigoCategoria;

    /**
    * @access private
    * @var integer Armazena o codigo da divisão
    */
    private $codigoDivisao;

    /**
    * @access private
    * @var integer Armazena o codigo da tecnico
    */
    private $codigoTecnico;

    /**
    * @access private
    * @var string Armazena a capa do time
    */
    private $capa;

    /**
    * @access private
    * @var string Armazena o desepenho do time
    */
    private $desempenhotime;

    /**
    * @access private
    * @var string Armazena um flag indicado se tem que comprar um novo jogador
    */
    private $comprarnovojogador;

    /**
    * metodo constutor
    *
    * @access    public
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function __construct()
    {
        $this->limpaPropriedades();    
    }//public function __construct()

    /**
    * metodo limpa todas as propriedades da classe
    *
    * @access    public
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     20/08/2016
    * @version   0.1
    */
    public function limpaPropriedades()
    {
        $this->setCodigoTime(0);
        $this->setNome('');
        $this->setCodigoCategoria(0);
        $this->setCodigoDivisao(0);
        $this->setCodigoTecnico(0);
        $this->setCapa('');
        $this->setDesempenhotime('');
        $this->setComprarnovojogador('');
    }//public function limpaPropriedades()

    /**
    * metodo acessor Get que retorna a informação da propriedade codigoTime
    *
    * @access    public
    * @return    integer Retorna o codigo do time
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getCodigoTime() : int
    {
        return $this->codigoTime;
    }//public function getCodigoTime() : int

    /**
    * metodo acessor Set que carrega informação na propriedade codigoTime
    *
    * @access    public
    * @param     integer $codigoTime Armazena o codigo atual
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setCodigoTime(int $codigoTime)
    {
        $this->codigoTime = $codigoTime;
    }//public function setCodigoTime(int $codigoTime)

    /**
    * metodo acessor Get que retorna a informação da propriedade nome
    *
    * @access    public
    * @return    string Retorna o nome do time
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getNome() : string
    {
        return $this->nome;
    }//public function getNome() : string

    /**
    * metodo acessor Set que carrega informação na propriedade nome
    *
    * @access    public
    * @param     string $nome Armazena o nome do time
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setNome(string $nome)
    {
        $this->nome = $nome;
    }//public function setNome(string $nome)

    /**
    * metodo acessor Get que retorna a informação da propriedade codigoCategoria
    *
    * @access    public
    * @return    integer Retorna o codigo da categoria
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getCodigoCategoria() : int
    {
        return $this->codigoCategoria;
    }//public function getCodigoCategoria() : int

    /**
    * metodo acessor Set que carrega informação na propriedade categoria
    *
    * @access    public
    * @param     integer $codigoCategoria Armazena o codigo da categoria
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setCodigoCategoria(int $codigoCategoria)
    {
        $this->codigoCategoria = $codigoCategoria;
    }//public function setCodigoCategoria(int $codigoCategoria)

    /**
    * metodo acessor Get que retorna a informação da propriedade codigoDivisao
    *
    * @access    public
    * @return    integer Retorna o codigo da divisão
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getCodigoDivisao() : int
    {
        return $this->codigoDivisao;
    }//public function getCodigoDivisao() : int

    /**
    * metodo acessor Set que carrega informação na propriedade divisão
    *
    * @access    public
    * @param     integer $codigoDivisao Armazena o codigo da divisão
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setCodigoDivisao(int $codigoDivisao)
    {
        $this->codigoDivisao = $codigoDivisao;
    }//public function setCodigoDivisao(int $codigoDivisao)

    /**
    * metodo acessor Get que retorna a informação da propriedade codigoTecnico
    *
    * @access    public
    * @return    integer Retorna o codigo do tecnico
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getCodigoTecnico() : int
    {
        return $this->codigoTecnico;
    }//public function getCodigoTecnico() : int

    /**
    * metodo acessor Set que carrega informação na propriedade tecnico
    *
    * @access    public
    * @param     integer $codigoTecnico Armazena o codigo do tecnico
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setCodigoTecnico(int $codigoTecnico)
    {
        $this->codigoTecnico = $codigoTecnico;
    }//public function setCodigoTecnico(int $codigoTecnico)

    /**
    * metodo acessor Get que retorna a informação da propriedade capa
    *
    * @access    public
    * @return    string Retorna a capa do time
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getCapa() : string
    {
        return $this->capa;
    }//public function getCapa() : string

    /**
    * metodo acessor Set que carrega informação na propriedade capa
    *
    * @access    public
    * @param     string $capa Armazena a capa do time
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setCapa(string $capa)
    {
        $this->capa = $capa;
    }//public function setCapa(string $capa)

    /**
    * metodo acessor Get que retorna a informação da propriedade desempenhotime
    *
    * @access    public
    * @return    string Retorna o desepenho do time
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getDesempenhotime() : string
    {
        return $this->desempenhotime;
    }//public function getDesempenhotime() : string

    /**
    * metodo acessor Set que carrega informação na propriedade desempenhotime
    *
    * @access    public
    * @param     string $desempenhotime Armazena o desepenho do time
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setDesempenhotime(string $desempenhotime)
    {
        $this->desempenhotime = $desempenhotime;
    }//public function setDesempenhotime(string $desempenhotime)

    /**
    * metodo acessor Get que retorna a informação da propriedade comprarnovojogador
    *
    * @access    public
    * @return    string Retorna a flag que indica se tem que comprar novo jogador
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getComprarnovojogador() : string
    {
        return $this->comprarnovojogador;
    }//public function getComprarnovojogador() : string

    /**
    * metodo acessor Set que carrega informação na propriedade comprarnovojogador
    *
    * @access    public
    * @param     string $comprarnovojogador Armazena a flag que indica se tem que comprar novo jogador
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setComprarnovojogador(string $comprarnovojogador)
    {
        $this->comprarnovojogador = $comprarnovojogador;
    }//public function setComprarnovojogador(string $comprarnovojogador)
     
     /**
    * metodo que tem função de verificar se ja existe outro time com mesmo nome
    *
    * @access    public
    * @return    boolean retorna um valor indicando se tudo ocorreu bem ou não
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function validaNomeTime() : bool
    {
        try {
            $sql   = "\n SELECT DISTINCT 1 AS resultado";
            $sql  .= "\n FROM time AS tim";
            $sql  .= "\n WHERE tim.nome = :nome";
            $sql  .= "\n AND tim.divisao_codigo_divisao = :id_divisao";
            $sql  .= "\n AND tim.categoria_codigo_categoria = :id_categoria";
            $sql  .= "\n AND tim.tecnico_codigo_tecnico = :id_tecnico";

            $stmt            = Conexao::getConexao()->prepare($sql);
            $nome            = $this->getNome();
            $codigoDivisao   = $this->getCodigoDivisao();
            $codigoCategoria = $this->getCodigoCategoria();
            $codigoTecnico   = $this->getCodigoTecnico();

            $stmt->bindParam(":nome", $nome, \PDO::PARAM_STR);
            $stmt->bindParam(":id_divisao", $codigoDivisao, \PDO::PARAM_INT);
            $stmt->bindParam(":id_categoria", $codigoCategoria, \PDO::PARAM_INT);
            $stmt->bindParam(":id_tecnico", $codigoTecnico, \PDO::PARAM_INT);
            $stmt->execute();
            $retorno =  $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($retorno["resultado"] != 1) {
                return true;
            }//if ($retorno["resultado"] != 1) {

            $this->setErro("Time duplicado, escolha outro nome.");
            return false;
        } catch (\PDOException $e) {
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return false;
        }
    }//public function validaNomeTime() : bool
        
    /**
    * metodo que tem função de inserir o time
    *
    * @access    public
    * @return    boolean|integer retorna um valor indicando se tudo ocorreu bem ou não
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function inserir()
    {
        try {
            if ($this->tokenEhValido() !== true) {
                $this->setErro("Sua sessão expirou. Faça o login novamente.");
                return 999;
            }//if ($this->tokenEhValido() !== true) {
                
            $nome               = $this->getNome();
                
            if (!(v::alnum()->length(2, 35)->validate($nome))) {
                $this->setErro("O nome do time deve ser alfanumérico de 2 a 35 caracteres.");
                return 998;
            }

            $retorno = $this->validaNomeTime();

            if ($retorno !== true) {
                return $retorno;
            }//if (!$retorno) {

            $capa               = $this->getCapa();
            $codigo_divisao     = $this->getCodigoDivisao();
            $codigo_categoria   = $this->getCodigoCategoria();
            $codigo_tecnico     = $this->getCodigoTecnico();
            $desempenhotime     = $this->getDesempenhotime();
            $comprarnovojogador = $this->getComprarnovojogador();

            $sql     = "\n INSERT INTO time(";
            $sql    .= "\n nome";
            $sql    .= "\n ,capa";
            $sql    .= "\n ,divisao_codigo_divisao";
            $sql    .= "\n ,categoria_codigo_categoria";
            $sql    .= "\n ,tecnico_codigo_tecnico";
            $sql    .= "\n ,desempenho_time";
            $sql    .= "\n ,comprar_novo_jogador";
            $sql    .= "\n ) VALUES (";
            $sql    .= "\n  :nome";
            $sql    .= "\n ,:capa";
            $sql    .= "\n ,:codigo_divisao";
            $sql    .= "\n ,:codigo_categoria";
            $sql    .= "\n ,:codigo_tecnico";
            $sql    .= "\n ,:desempenhotime";
            $sql    .= "\n ,:comprarnovojogador";
            $sql    .= "\n )";

            $conexao = Conexao::getConexao();
            $conexao->beginTransaction();
            $stmt = $conexao->prepare($sql);
            $stmt->bindParam(":nome", $nome, \PDO::PARAM_STR, 35);
            $stmt->bindParam(":capa", $capa, \PDO::PARAM_STR, 100);
            $stmt->bindParam(":codigo_divisao", $codigo_divisao, \PDO::PARAM_INT);
            $stmt->bindParam(":codigo_categoria", $codigo_categoria, \PDO::PARAM_INT);
            $stmt->bindParam(":codigo_tecnico", $codigo_tecnico, \PDO::PARAM_INT);
            $stmt->bindParam(":desempenhotime", $desempenhotime, \PDO::PARAM_STR, 5);
            $stmt->bindParam(":comprarnovojogador", $comprarnovojogador, \PDO::PARAM_STR, 3);
            $retorno = $stmt->execute();
            $conexao->commit();
            $conexao = null;
            return $retorno;
        } catch (\PDOException $e) {
            $conexao = null;
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return false;
        }
    }//public function inserir()
    
    /**
    * metodo que tem função de fazer validacao da restricao de integridade
    *
    * @access    public
    * @param     integer $codigo Armazena o codigo do time
    * @param     bool $validaToken Armazena uma flag que indica se vai ou nao verificar se o token é valido
    * @return    boolean|integer retorna um valor indicando se tudo ocorreu bem ou não
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function validaCodigoTime(int $codigo, bool $validaToken = true)
    {
        try {
            if ($validaToken === true && $this->tokenEhValido() === false) {
                $this->setErro("Sua sessão expirou. Faça o login novamente.");
                return 999;
            }//if ($validaToken === true && $this->tokenEhValido() === false) {

            $sql     = "\n SELECT DISTINCT 1 AS retorno";
            $sql    .= "\n FROM time";
            $sql    .= "\n WHERE codigo_time = :codigo";

            $stmt = Conexao::getConexao()->prepare($sql);
            $stmt->bindParam(":codigo", $codigo, \PDO::PARAM_INT);
            $stmt->execute();
            $retorno =  $stmt->fetch(\PDO::FETCH_ASSOC);

            if (is_numeric($codigo) === false || $retorno["retorno"] != true) {
                $this->setErro("Código inválido.");
                return 997;
            }//if (is_numeric($codigo) === false || $retorno["retorno"] != true) {
                
            return true;
        } catch (\PDOException $e) {
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return false;
        }
    }//public function validaCodigoTime(int $codigo)


    /**
    * metodo que tem função de alterar o time
    *
    * @access    public
    * @return    boolean|integer retorna um valor indicando se tudo ocorreu bem ou não
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function alterar()
    {
        try {
            $codigo  = $this->getCodigoTime();
            $retorno = $this->validaCodigoTime($codigo);

            if ($retorno !== true) {
                return $retorno;
            }//if ($retorno !== true) {

            $nome               = $this->getNome();

            if (v::alnum()->length(2, 35)->validate($nome) != true) {
                $this->setErro("O nome do time deve ser alfanumérico de 2 a 35 caracteres.");
                return 996;
            }

            $codigo_divisao     = $this->getCodigoDivisao();
            $codigo_categoria   = $this->getCodigoCategoria();
            $codigo_tecnico     = $this->getCodigoTecnico();
            $capa               = $this->getCapa();

            $sql     = "\n UPDATE time";
            $sql    .= "\n SET nome                     = :nome";
            
            if (!empty($capa)) {
                $sql    .= "\n , capa 			    = :capa";
            }//if (!empty($capa)) {
            
            $sql    .= "\n , divisao_codigo_divisao     = :codigo_divisao";
            $sql    .= "\n , categoria_codigo_categoria = :codigo_categoria";
            $sql    .= "\n , tecnico_codigo_tecnico     = :codigo_tecnico";
            $sql    .= "\n WHERE codigo_time            = :codigo_time";

            $conexao = Conexao::getConexao();
            $conexao->beginTransaction();
            $stmt = $conexao->prepare($sql);

            $stmt->bindParam(":nome", $nome, \PDO::PARAM_STR, 35);
            
            if (!empty($capa)) {
                $stmt->bindParam(":capa", $capa, \PDO::PARAM_STR, 100);
                $arrRetorno = $this->listarPorCodigo($codigo);
                unlink("../".$arrRetorno["capa"]);
            }//if (!empty($capa)) {
            
            $stmt->bindParam(":codigo_divisao", $codigo_divisao, \PDO::PARAM_INT);
            $stmt->bindParam(":codigo_categoria", $codigo_categoria, \PDO::PARAM_INT);
            $stmt->bindParam(":codigo_tecnico", $codigo_tecnico, \PDO::PARAM_INT);
            $stmt->bindParam(":codigo_time", $codigo, \PDO::PARAM_INT);
            $retorno = $stmt->execute();
            $conexao->commit();
            $conexao = null;
            return $retorno;
        } catch (\PDOException $e) {
            $conexao = null;
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return false;
        }
    }//public function alterar()
    
    /**
    * metodo que tem função de excluir o time
    *
    * @access    public
    * @return    boolean|integer retorna um valor indicando se tudo ocorreu bem ou não
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function excluir()
    {
        try {
            $codigo = $this->getCodigoTime();
            $retorno = $this->validaCodigoTime($codigo);

            if ($retorno !== true) {
                return $retorno;
            }//if ($retorno !== true) {

            $arrRetorno = $this->listarPorCodigo($codigo);
            unlink("../".$arrRetorno["capa"]);

            $sql     = "\n DELETE FROM time";
            $sql    .= "\n WHERE codigo_time = :codigo";

            $conexao = Conexao::getConexao();
            $conexao->beginTransaction();
            $stmt = $conexao->prepare($sql);
            $stmt->bindParam(":codigo", $codigo, \PDO::PARAM_INT);

            $retorno = $stmt->execute();

            if ($retorno !== true) {
                $this->setErro("Não foi possivel excluir este time.");
                $retorno = false;
            } else {
                $conexao->commit();
            }//if ($retorno !== true) {
            
            $conexao = null;
            return $retorno;
        } catch (\PDOException $e) {
            $conexao = null;
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return false;
        }
    }//public function excluir($codigo)

    /**
    * metodo que tem função de listar todos os times.
    *
    * @access    public
    * @return    array retorna as informacoes
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function listarTudo()
    {
        try {
            $sql     = "\n SELECT codigo_time";
            $sql    .= "\n ,divisao_codigo_divisao";
            $sql    .= "\n ,nome";
            $sql    .= "\n ,capa";
            $sql    .= "\n FROM time";

            $stmt = Conexao::getConexao()->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return false;
        }
    }//public function listarTudo()
     
    /**
    * metodo que tem função de listar o time pelo código.
    *
    * @access    public
    * @param     integer $codigo Armazena o codigo do time.
    * @return    array retorna as informacoes
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function listarPorCodigo(int $codigo)
    {
        try {
            $retorno = $this->validaCodigoTime($codigo, false);

            if ($retorno !== true) {
                return $retorno;
            }//if ($retorno !== true) {

            $sql     = "\n SELECT tim.codigo_time AS codigotime";
            $sql    .= "\n ,tim.nome AS nomeTime";
            $sql    .= "\n ,tim.tecnico_codigo_tecnico AS codigoTecnico";
            $sql    .= "\n ,tim.capa";
            $sql    .= "\n ,dvi.codigo_divisao AS codigoDivisao";
            $sql    .= "\n ,dvi.nome AS nomeDivisao";
            $sql    .= "\n ,tec.nome AS nomeTecnico";
            $sql    .= "\n ,cat.codigo_categoria AS codigoCategoria";
            $sql    .= "\n ,cat.nome AS nomeCategoria";

            $sql    .= "\n ,(CASE tim.desempenho_time";
            $sql    .= "\n     WHEN '1' THEN 'Ruim'";
            $sql    .= "\n     WHEN '2' THEN 'Regular'";
            $sql    .= "\n     WHEN '3' THEN 'Otimo'";
            $sql    .= "\n END) AS nomeDesempenhoTime";

            $sql    .= "\n ,(CASE tim.comprar_novo_jogador";
            $sql    .= "\n     WHEN '0' THEN 'Não'";
            $sql    .= "\n     WHEN '1' THEN 'Sim'";
            $sql    .= "\n END) AS NomeComprarNovoJogador";

            $sql    .= "\n FROM time AS tim";
            $sql    .= "\n , divisao AS dvi";
            $sql    .= "\n , tecnico AS tec";
            $sql    .= "\n , categoria AS cat";
            $sql    .= "\n WHERE tim.divisao_codigo_divisao   = dvi.codigo_divisao";
            $sql    .= "\n AND tim.tecnico_codigo_tecnico     = tec.codigo_tecnico";
            $sql    .= "\n AND tim.categoria_codigo_categoria = cat.codigo_categoria";
            $sql    .= "\n AND tim.codigo_time 			 	  = :codigo";

            $stmt = Conexao::getConexao()->prepare($sql);
            $stmt->bindParam(":codigo", $codigo, \PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return false;
        }
    }//public function listarPorCodigo(int $codigo)
    
    /**
    * metodo que tem função de listar o time por nome.
    *
    * @access    public
    * @param     string $nome Armazena o nome do time.
    * @return    array retorna as informacoes
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function listarPorNome(string $nome)
    {
        try {
            //$nome = mb_substr(trim($nome),0,35,mb_detect_encoding($nome));

            if ($this->tokenEhValido() === false) {
                $this->setErro("Sua sessão expirou. Faça o login novamente.");
                return array();
            }//if ($this->tokenEhValido() === false) {
                
            $sql     = "\n SELECT codigo_time AS codigo";
            $sql    .= "\n ,nome AS nome";
            $sql    .= "\n FROM time";
            
            if (!empty($nome)) {
                $sql  .= "\n WHERE nome LIKE :nome";
            }//if (!empty($nome)) {

            $stmt = Conexao::getConexao()->prepare($sql);

            if (!empty($nome)) {
                $nome = trim($nome)."%";
                $stmt->bindParam(":nome", $nome, \PDO::PARAM_STR, 35);
            }//if (!empty($nome)) {

            $stmt->execute();
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return false;
        }
    }//public function listarPorNome(string $nome)
}//class Time extends ClasseBase
