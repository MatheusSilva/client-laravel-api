<?php
//declare(strict_types=1);//nao utilizar pois qualquer tipo de dados diferente vai parar a aplicação, validar dados pelo validator

namespace matheus\sistemaRest\api\v1\lib;

/**
* classe UploadTexto
*
* @author    Matheus Silva
* @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
*/
abstract class UploadTexto
{
    /**
    * metodo que valida o arquivo baseado no minetype
    *
    * @access    public
    * @param     string $tipo Armazena o minetype do arquivo
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public static function validarTipo(string $tipo) : bool
    {
        if ($tipo == 'application/msword'
            || $tipo == 'application/pdf'
            || $tipo == 'text/plain'
            || $tipo == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return true;
        } else {
            return false;
        }
    }//public static function validarTipo($tipo) : bool
    
    /**
    * metodo que valida o arquivo baseado no tamanho
    *
    * @access    public
    * @param     integer $tamanho Armazena o tamanho do arquivo
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public static function validarTamanho(int $tamanho) : bool
    {
        if ($tamanho <= 409600) {
            return true;
        } else {
            return false;
        }//if ($tamanho <= 409600) {
    }//public static function validarTamanho($tamanho) : bool
    
    /**
    * metodo que faz o upload do arquivo
    *
    * @access    public
    * @param     string $nome Armazena o nome do arquivo
    * @param     file $arquivo Armazena o arquivo pego pelo php
    * @author    Matheus Silva
    * @copyright © Copyright 2010-2016 Matheus Silva. Todos os direitos reservados.
    * @since     14/12/2010
    * @version   0.2
    */
    public static function enviar(string $nome, $arquivo) : string
    {
        //faz upload para o servidor
        $extensao = substr($arquivo['name'], strlen($arquivo['name'])-4, 4);
        
        if (substr($extensao, 0, 1) !='.') {
            $extensao = '.'.$extensao;
        }//if (substr($extensao, 0, 1) !='.') {
    
        $caminho = "../arquivos/textos/$nome$extensao";
        
        if ($arquivo['error'] == 0) {
            copy($arquivo['tmp_name'], $caminho);
            return $caminho;
        } else {
            return '0';
        }//if ($arquivo['error'] == 0) {
    }//public static function enviar($nome, $arquivo)
}//abstract class UploadTexto
