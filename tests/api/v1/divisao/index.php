<?php
class DivisaoTest extends PHPUnit_Framework_TestCase
{
    private $token = "ba649e591465913a9d270ed1f50e0fa9e42ac298ec55faaeb3c87a758ff1a263";

    private function api($url, $data = array(), $method = "POST")
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
    
    public function testTokenInvalidoSalvarDivisao()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=4&tk=asdasd';
        $data = array('txtNome' => 'NBI');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Sua sessão expirou. Faça o login novamente.', $result["mensagem"]);
    }

    public function testTokenInvalidoAlterarDivisao()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=5&tk=asdasd';
        $data = array('txtNome' => 'NBI');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Sua sessão expirou. Faça o login novamente.', $result["mensagem"]);
    }
    
    public function testNomeEmBrancoSalvarDivisao()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=4&tk='.$this->token;
        $data = array('txtNome' => '');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('O nome da divisão deve ser alfanumérico de 2 a 25 caracteres.', $result["mensagem"]);
    }

    public function testNomeEmBrancoAlterarDivisao()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=5&id=1&tk='.$this->token;
        $data = array('txtNome' => '');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('O nome da divisão deve ser alfanumérico de 2 a 25 caracteres.', $result["mensagem"]);
    }
    
    public function testNomeValidoSalvarDivisao()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=4&tk='.$this->token;
        $rand = uniqid(rand(), true);
        $rand = str_replace(".", "", $rand);
        $rand = str_replace("0", "", $rand);
        $rand = str_replace("1", "", $rand);
        $rand = str_replace("2", "", $rand);
        $rand = str_replace("3", "", $rand);
        $rand = str_replace("4", "", $rand);
        $rand = str_replace("5", "", $rand);
        $rand = str_replace("6", "", $rand);
        $rand = str_replace("7", "", $rand);
        $rand = str_replace("8", "", $rand);
        $rand = str_replace("9", "", $rand);
        $rand .= "Z";

        $data = array('txtNome' => $rand);
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Divisão cadastrada com sucesso.', $result["mensagem"]);
    }

    public function testNomeDuplicadoSalvarDivisao()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=4&tk='.$this->token;

        $data = array('txtNome' => "ddbe");
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Divisão duplicada, escolha outro nome.', $result["mensagem"]);
    }

    public function testNomeValidoAlterarDivisao()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=5&id=1&tk='.$this->token;
        $data = array('txtNome' => 'segundona');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Divisão alterada com sucesso.', $result["mensagem"]);
    }


    public function testAlterarDivisaoInexistente()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=5&id=999&tk='.$this->token;
        $data = array('txtNome' => 'sub 25');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Código inexistente.', $result["mensagem"]);
    }


    public function testAlterarDivisaoInvalida()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=5&id=asds&tk='.$this->token;
        $data = array('txtNome' => 'sub 25');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Código inválido.', $result["mensagem"]);
    }

    public function testExcluirDivisaoInexistente()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=6&id=999&tk='.$this->token;
        $data = array();
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Código inexistente.', $result["mensagem"]);
    }

    public function testExcluirDivisaoInvalida()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=6&id=asds&tk='.$this->token;
        $data = array();
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Código inválido.', $result["mensagem"]);
    }

    public function testExcluirDivisaoVinculadaTime()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=6&id=1&tk='.$this->token;
        $data = array();
        $result = $this->api($url, $data, "POST");
        $this->assertEquals(
            'Falha ao excluir divisão. Existem um ou mais times vinculados a esta divisão.',
            $result["mensagem"]
        );
    }

    public function testExcluirDivisao()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/divisao.php?a=6&id=3&tk='.$this->token;
        $data = array();
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Divisão excluida com sucesso.', $result["mensagem"]);
    }
}
