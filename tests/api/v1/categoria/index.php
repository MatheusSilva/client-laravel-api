<?php
class CategoriaTest extends PHPUnit_Framework_TestCase
{
    private $token = "ba649e591465913a9d270ed1f50e0fa9e42ac298ec55faaeb3c87a758ff1a263";

    private function api($url, $data = array(), $method = "POST")
    {
        try {
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
        } catch (\PDOException $e) {
            $fp = fopen('34hsGAxZSgdfwksz1356.log', 'a');
            fwrite($fp, $e);
            fclose($fp);
            return "";
        }
    }
    
    public function testTokenInvalidoSalvarCategoria()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=4&tk=asdasd';
        $data = array('txtNome' => 'NBI');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Sua sessão expirou. Faça o login novamente.', $result["mensagem"]);
    }

    public function testTokenInvalidoAlterarCategoria()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=5&tk=asdasd';
        $data = array('txtNome' => 'NBI');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Sua sessão expirou. Faça o login novamente.', $result["mensagem"]);
    }
    
    public function testNomeEmBrancoSalvarCategoria()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=4&tk='.$this->token;
        $data = array('txtNome' => '');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('O nome da categoria deve ser alfanumérico de 2 a 30 caracteres.', $result["mensagem"]);
    }

    public function testNomeEmBrancoAlterarCategoria()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=5&id=1&tk='.$this->token;
        $data = array('txtNome' => '');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('O nome da categoria deve ser alfanumérico de 2 a 30 caracteres.', $result["mensagem"]);
    }
    
    public function testNomeValidoSalvarCategoria()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=4&tk='.$this->token;
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
        $this->assertEquals('Categoria cadastrada com sucesso.', $result["mensagem"]);
    }

    public function testNomeDuplicadoSalvarCategoria()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=4&tk='.$this->token;

        $data = array('txtNome' => "ddbe");
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Categoria duplicada, escolha outro nome.', $result["mensagem"]);
    }

    public function testNomeValidoAlterarCategoria()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=5&id=18&tk='.$this->token;
        //$rand = uniqid(rand(), true);
        $data = array('txtNome' => "sdasdasdsad11111");
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Categoria alterada com sucesso.', $result["mensagem"]);
    }


    public function testAlterarCategoriaInexistente()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=5&id=999&tk='.$this->token;
        $data = array('txtNome' => 'sub 25');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Código inexistente.', $result["mensagem"]);
    }


    public function testAlterarCategoriaInvalida()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=5&id=asds&tk='.$this->token;
        $data = array('txtNome' => 'sub 25');
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Código inválido.', $result["mensagem"]);
    }

    public function testExcluirCategoriaInexistente()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=6&id=999&tk='.$this->token;
        $data = array();
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Código inexistente.', $result["mensagem"]);
    }

    public function testExcluirCategoriaInvalida()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=6&id=asds&tk='.$this->token;
        $data = array();
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Código inválido.', $result["mensagem"]);
    }

    public function testExcluirCategoriaVinculadaTime()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=6&id=1&tk='.$this->token;
        $data = array();
        $result = $this->api($url, $data, "POST");
        $this->assertEquals(
            'Falha ao excluir categoria. Existem um ou mais times vinculados a esta categoria.',
            $result["mensagem"]
        );
    }

    public function testExcluirCategoria()
    {
        $url = 'http://localhost/sistemaRest/api/v1/controller/categoria.php?a=6&id=27&tk='.$this->token;
        $data = array();
        $result = $this->api($url, $data, "POST");
        $this->assertEquals('Categoria excluida com sucesso.', $result["mensagem"]);
    }
}
