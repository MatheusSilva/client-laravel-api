<?php
class TimeTest extends PHPUnit_Framework_TestCase
{
    private $token = "c53f326588db3c3242c1abb786e09a62049f3bc9caba3b650342faaad45ec527";
    
    private function apiJson($url, $data = array(), $method = "POST")
    {
        $data_string = json_encode($data);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data_string)
            )
        );
        
        $result = curl_exec($ch);
        $result = json_decode($result, true);
        return $result;
    }


    private function apiHtml($url, $data = array(), $method = "POST")
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                //'Content-Type: application/json',
                //'Content-Length: ' . strlen($parans)
            )
        );
        
        $result = curl_exec($ch);
        $result = json_decode($result, true);
        return $result;
    }
    
    public function testAlterarTimeValido()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/time.php?a=4&id=1&tk='.$this->token;

        $data = array(
             'txtNome'      => "timeco123"
            ,'cmbDivisao'   => '1'
            ,'cmbCategoria' => '1'
            ,'cmbTecnico'   => '1'
        );
        
        $result = $this->apiHtml($url, $data, "POST");
        $this->assertEquals('Time alterado com sucesso.', $result["mensagem"]);
    }

    public function testExcluirTimeInexistente()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/time.php?a=5&id=999&tk='.$this->token;
        $data = array();
        $result = $this->apiHtml($url, $data, "POST");
        $this->assertEquals('Código inválido.', $result["mensagem"]);
    }

    public function testExcluirTimeInvalida()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/time.php?a=5&id=asds&tk='.$this->token;
        $data = array();
        $result = $this->apiHtml($url, $data, "POST");
        $this->assertEquals('Código inválido.', $result["mensagem"]);
    }

    /*
    public function testExcluirTime()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/time.php?a=5&id=1&tk='.$this->token;
        $data = array();
        $result = $this->apiJson($url, $data, "POST");
        $this->assertEquals('Time excluido com sucesso.', $result["mensagem"]);
    }
    */
}
