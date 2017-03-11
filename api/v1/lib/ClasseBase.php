<?php
//declare(strict_types=1);//nao utilizar pois qualquer tipo de dados diferente vai parar a aplicação, validar dados pelo validator

namespace matheus\sistemaRest\api\v1\lib;

use matheus\sistemaRest\api\v1\lib\Login;
use matheus\sistemaRest\api\v1\lib\Conexao;

/**
* classe ClasseBase
*
* @author    Matheus Silva
* @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
*/
abstract class ClasseBase
{
    /**
    * @access private
    * @var array Armazena todos os erros escritos sem codigos de erro
    */
    private $arrErro = array();

    /**
    * @access private
    * @var string Armazena o token de autenticação
    */
    private $token = '';

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
        require_once "../vendor/autoload.php";
        Login::verificar(false);
    }//public function __construct()
    
    /**
    * metodo acessor Get que retorna a informação da propriedade arrErro
    *
    * @access    public
    * @return    string Retorna todos os erros escritos sem codigos de erro
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getErros() : string
    {
        $strErros = "";

        if (is_array($this->arrErro) && !empty($this->arrErro)) {
            $boolPassou = false;
            foreach ($this->arrErro as $val) {
                if ($boolPassou) {
                    $strErros .= "<br />".$val;
                } else {
                    $strErros .= $val;
                    $boolPassou = true;
                }//if ($boolPassou) {
            }//foreach ($this->arrErro as $val) {
        }//if (is_array($this->arrErro) && !empty($this->arrErro)) {

        return $strErros;
    }//public function getErros() : string

    /**
    * metodo acessor Set que carrega informação na propriedade arrErro
    *
    * @access    public
    * @param     string $arrErro Armazena os erros escritos sem codigos de erro
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setErro(string $strErro)
    {
        $this->arrErro[] = $strErro;
    }//public function setErro(string $strErro)

    /**
    * metodo acessor que limpa todos os erros escritos sem codigos de erro
    *
    * @access    public
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function limpaErros()
    {
        $this->arrErro = array();
    }//public function limpaErros()

    /**
    * metodo acessor Get que retorna a informação da propriedade token
    *
    * @access    public
    * @return    string Retorna o token de autenticação
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function getToken() : string
    {
        return $this->token;
    }//public function getToken() : string

    /**
    * metodo acessor Set que carrega informação na propriedade token
    *
    * @access    public
    * @param     string $token Armazena o token de autenticação
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function setToken(string $token)
    {
        $this->token = $token;
    }//public function setToken(string $token)

    /**
    * metodo que verifica se o token e valido
    *
    * @access    public
    * @return    boolean retorna um boolean indicando se tudo esta certo ao não
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public function tokenEhValido() : bool
    {
        $strToken = $this->getToken();

        if (empty($strToken)) {
            return false;
        }

        $sql   = "\n SELECT 1";
        $sql  .= "\n FROM torcedor";
        $sql  .= "\n WHERE token = :token";

        $conexao = Conexao::getConexao();
        $stmt = $conexao->prepare($sql);
        $stmt->bindParam(":token", $strToken);
        $stmt->execute();
        $retorno =  $stmt->fetch();
        $conexao = null;
        
        if (empty($retorno)) {
            return false;
        }//if (empty($retorno)) {

        return true;
    }//public function tokenEhValido() : bool
}//class ClasseBase
