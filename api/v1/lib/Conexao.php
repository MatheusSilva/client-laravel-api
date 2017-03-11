<?php
namespace matheus\sistemaRest\api\v1\lib;

/**
* classe Conexao
*
* @author    Matheus Silva
* @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
*/
abstract class Conexao
{
    /**
    * @access private
    * @var object Armazena o objeto de conexao do banco
    */
    private static $objConexao = null;

    /**
    * @access public
    * @var string Armazena o host do banco
    */
    public static $strHost     = "mysql:host=127.0.0.1;dbname=dbatime;charset=utf8mb4";

    /**
    * @access public
    * @var string Armazena o usuario do banco
    */
    public static $strUsuario  = "root";

    /**
    * @access public
    * @var string Armazena a senha do banco
    */
    public static $strSenha    = "root";

    /**
    * metodo que cria uma nova conexão com o banco de dados caso nao exista e retorna a conexão atual
    *
    * @access    public
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public static function getConexao()
    {
        if (!isset(self::$objConexao)) {
            self::$objConexao = new \PDO(
                self::$strHost,
                self::$strUsuario,
                self::$strSenha
            );

            self::$objConexao->setAttribute(\PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' ");
            self::$objConexao->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);    
            self::$objConexao->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            self::$objConexao->setAttribute(\PDO::ATTR_ORACLE_NULLS, \PDO::NULL_EMPTY_STRING);
        }//if (!isset(self::$objConexao)) {
            
        return self::$objConexao;
    }//public static function getConexao()

    /**
    * metodo que fecha a conexao do banco de dados
    *
    * @access    public
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public static function fechaConexao()
    {
        self::$objConexao = null;
    }//public static function fechaConexao()
}//abstract class Conexao
