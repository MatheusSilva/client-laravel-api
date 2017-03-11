<?php
//declare(strict_types=1);//nao utilizar pois qualquer tipo de dados diferente vai parar a aplicaчуo, validar dados pelo validator

namespace matheus\sistemaRest\api\v1\lib;

/**
* classe Upload
*
* @author  Matheus Silva
* @copyright Љ Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
*/
abstract class Upload
{
    /**
    * metodo que verifica se arquivo tem extensao valida
    *
    * @access    public
    * @param     file $arquivo Armazena o arquivo pego pelo php
    * @param     array $extensoes_permitidas Armazena todas as extensoes permitidas
    * @return    boolean Retorna um boolean que indica se o arquivo tem uma extensao valida
    * @author    Matheus Silva
    * @since     13/07/2015
    * @version   0.1
    */
    public static function validarExtensao($arquivo, array $extensoes_permitidas = array('.jpg', '.png')) : bool
    {
        // Faz a verificaчуo da extensуo do arquivo enviado
        $extensao = strrchr($arquivo['name'], '.');

        // Faz a validaчуo do arquivo enviado
        if (in_array($extensao, $extensoes_permitidas) !== true) {
            return false;
        }//if(in_array($extensao, $extensoes_permitidas) !== true)

        return true;
    }//public static function validarExtensao($arquivo, $extensoes_permitidas = array('.jpg', '.png'))

    /**
    * metodo que verifica se arquivo tem minetype valido
    *
    * @access    public
    * @param     file $arquivo Armazena o arquivo pego pelo php
    * @param     array $arrMineTypes Armazena todos os minetypes validos
    * @return    boolean Retorna um boolean que indica se o arquivo tem um minetype valido
    * @author    Matheus Silva
    * @since     13/07/2015
    * @version   0.1
    */
    public static function validarTipo($arquivo, array $arrMineTypes = array("image/jpeg", "image/jpg", "image/png")) : bool
    {
        $boolPassou = false;

        foreach ($arrMineTypes as $valor) {
            if ($valor == $arquivo['type']) {
                $boolPassou = true;
            }//if ($valor == $arquivo['type']) {
        }//foreach ($arrMineTypes as $valor ) {

        return $boolPassou;
    }//public static function validarTipo($arquivo, $arrMineTypes = array("image/jpeg","image/jpg", "image/png"))

    /**
    * metodo que verifica se arquivo tem tamanho valido
    *
    * @access    public
    * @param     $arquivo Armazena o arquivo pego pelo php
    * @param     $tamanho Armazena o tamanho do arquivo em megaByte
    * @return    boolean Retorna um boolean que indica se o arquivo tem um tamanho valido
    * @author    Matheus Silva
    * @since     13/07/2015
    * @version   0.1
    */
    public static function validarTamanho($arquivo, int $tamanho = 5) : bool
    {
        if ($arquivo['size'] <= ($tamanho*1024*1024)) {
            return true;
        } else {
            return false;
        }//if ($arquivo['size'] <= ($tamanho*1024*1024)) {
    }//public static function validarTamanho($arquivo, $tamanho = 5) : bool


    /**
    * metodo que envia o arquivo selecionado para a pasta do servidor
    *
    * @access    public
    * @param     string Armazena o nome do arquivo
    * @param     file Armazena arquivo pego pelo php
    * @param     string Armazena o caminho do arquivo
    * @return    string Retorna um string que contem o caminho relativo do arquivo
    * @author    Matheus Silva
    * @since     13/07/2015
    * @version   0.1
    */
    public static function enviar(string $nome, $arquivo, string $caminho = "../../img/") : string
    {
        //faz upload para o servidor

        $tamanho = strlen($arquivo['name'])-4;
        $extensao = substr($arquivo['name'], $tamanho, 4);
        
        if (substr($extensao, 0, 1) !== '.') {
            $extensao = '.'.$extensao;
        }//if (substr($extensao, 0, 1) !== '.') {

        $nome = md5(uniqid($nome.rand(), true));
        $nome = trim(substr($nome, 13, 10));
        $caminho = $caminho.$nome.$extensao;

        if ($arquivo['error'] == 0) {
            copy($arquivo['tmp_name'], "../".$caminho);
            return $caminho;
        } else {
            return '0';
        }//if ($arquivo['error'] == 0) {
    }//public static function enviar($nome, $arquivo, $caminho = "../../image/" )
}//abstract class Upload
