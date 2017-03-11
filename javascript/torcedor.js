class Torcedor
{
    static formToJSON(form) 
    {
        var codigo        = '';
        var txtNome       = '';
        var txtLogin      = '';
        var txtEmail      = '';
        var txtSenhaAtual = '';
        var txtSenha      = '';
        var txtConfSenha  = '';

        if (form.id != undefined) {
            codigo = form.id.value;
        }

        if (form.codigo != undefined) {
            codigo = form.codigo.value;
        }

        if (form.txtNome != undefined) {
            txtNome = form.txtNome.value;
        }

        if (form.txtEmail != undefined) {
            txtEmail = form.txtEmail.value;
        }

        if (form.txtLogin != undefined) {
            txtLogin = form.txtLogin.value;
        }

        if (form.txtSenha != undefined) {
            txtSenha = form.txtSenha.value;
        }

        if (form.txtSenhaAtual != undefined) {
            txtSenhaAtual = form.txtSenhaAtual.value;
        }

        if (form.txtConfSenha != undefined) {
            txtConfSenha = form.txtConfSenha.value;
        }

        return JSON.stringify({
            "codigo":  codigo,
            "txtNome":  txtNome,
            "txtEmail":  txtEmail,
            "txtLogin":  txtLogin,
            "txtSenhaAtual" : txtSenhaAtual,
            "txtSenha":  txtSenha,
            "txtConfSenha": txtConfSenha
        });
    }

    static ativarAutenticacao2fatores()
    {
        var xhr = Ajax.createXHR();
        var ok = window.confirm("Você tem certeza que deseja ativar a autenticação de 2 fatores?");

        if (ok && xhr != undefined) {
            var token  = Login.getCookie('token');
            var consulta = "";

            if (token !== "") {
                xhr.open("GET","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=1&tk="+token,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    //Verificar pelo estado "4" de pronto.
                    if (xhr.readyState == '4') {
                        //Pegar dados da resposta json
                        var json = JSON.parse(xhr.responseText);
                        
                        if (json.torcedor != undefined) {
                            //document.getElementById("statusAutenticacao").value = 0;
                            //document.getElementById("btnCadastrar").value = 'Desativar'; // muda o texto do botao
                            //document.getElementById('btnCadastrar').style.visibility = 'hidden'; //apenas deixa invisivel o botao
                            //document.getElementById('btnCadastrar').disabled = true; //apenas disabilita botao

                            document.getElementById('btnCadastrar').remove();//remove completamente botao
                            document.getElementById("imgbase64").src = json.torcedor.imgbase64;
                            document.getElementById("aviso").innerHTML = "Baixe o app Google Authenticator.<br> Escanei o QR CODE com algum app no seu smartphone.";
                            
                            var strHtml = '<br /> <label for="codAutenticacao">Código autenticação</label>';
                            strHtml += ' <input type="text" name="codAutenticacao" id="codAutenticacao" value="" />';
                            strHtml += '<br /><br />';
                            strHtml += '<input id="btnCadastrar" type="button" value="Validar" onclick="Torcedor.validaAutenticacao2fatores()" />';

                            document.getElementById("validaAutenticacao2Fatores").innerHTML = strHtml;
                                
                        } else {
                            if (json.mensagem != undefined) {
                                alert(json.mensagem);
                            } else {
                                alert('Não foi possivel ativar a autenticação de 2 etapas.');
                            }    
                        }
                    }
                }

                xhr.send();
            } else {
                alert("Sua sessão expirou.");
            }
       }
    }

    static pegarQrCode()
    {
        var xhr = Ajax.createXHR();

        if (xhr != undefined) {
            var token  = Login.getCookie('token');

            if (token !== "") {
                xhr.open("GET","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=5&tk="+token,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    //Verificar pelo estado "4" de pronto.
                    if (xhr.readyState == '4') {
                        //Pegar dados da resposta json
                        var json = JSON.parse(xhr.responseText);
                        document.getElementById("imgbase64").src = json.torcedor.imgbase64;
                        document.getElementById("aviso").innerHTML = "Baixe o app Google Authenticator.<br> Escanei o QR CODE com algum app no seu smartphone.";
                    }
                }

                xhr.send();
            } else {
                alert("Sua sessão expirou.");
            }
       }
    }

    static desativarAutenticacao2fatores()
    {
        var xhr = Ajax.createXHR();
        var ok = window.confirm("Você tem certeza que deseja desativar a autenticação de 2 fatores?");

        if (ok && xhr != undefined) {
            var token  = Login.getCookie('token');
            var consulta = "";

            if (token !== "") {
                xhr.open("GET","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=2&tk="+token,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    //Verificar pelo estado "4" de pronto.
                    if (xhr.readyState == '4') {
                        //Pegar dados da resposta json
                        var json = JSON.parse(xhr.responseText);
                        alert(json.mensagem);                        
                        window.location.href = "../paginas/home.php";
                    }
                }

                xhr.send();
            } else {
                alert(mensagem);
            }
       }
    }

    static validaAutenticacao2fatores()
    {
        var xhr = Ajax.createXHR();

        if (xhr != undefined) {
            var token  = Login.getCookie('token');
            var consulta = "";
            var codigoAutenticacao = document.getElementById("codAutenticacao").value;

            if (codigoAutenticacao != '') {
                consulta = "&key="+codigoAutenticacao;    
            }

            if (token !== "") {
                xhr.open("GET","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=3&tk="+token+consulta,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    //Verificar pelo estado "4" de pronto.
                    if (xhr.readyState == '4') {
                        //Pegar dados da resposta json
                        var json = JSON.parse(xhr.responseText);

                        var msg = "";

                        if (json.mensagem != undefined) {
                            alert(json.mensagem);
                        } else if (json.resultado == 1) {
                            window.location.href = "../paginas/home.php";        
                        } else if (json.resultado == 0) {
                            alert("Código de autenticação invalido");        
                        }     
                    }
                }

                xhr.send();
            } else {
                alert("falha1");
            }
        } else {
            alert("falha2");
        }
    }

    static atualizar(form) 
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";  
        var xhr = Ajax.createXHR();
        var mensagem = "";

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu a técnico</b>";
        }
        
        var token  = Login.getCookie('token');
        
        var consulta = "";

        if (token !== "") {
            consulta = "&tk="+token;
        }

        if(mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=8"+consulta,true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.

                if (xhr.readyState == '4' && xhr.status == '200') {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);
                    document.getElementById("mensagem").innerHTML = "<br /><b>"+json.mensagem+"</b>";  
                }
            }
            
            xhr.send(Torcedor.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }

    static insereDadosTorcedorRetornados(codigo)  
    {
        var xhr = Ajax.createXHR();

        var token  = Login.getCookie('token');
        var consulta = "";

        if (token !== "") {
            consulta = "&tk="+token;
        }

        xhr.open("GET","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=7&id="+codigo+consulta,true);   
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            //Verificar pelo estado "4" de pronto.

            if (xhr.readyState == '4' && xhr.status == '200') {
                //Pegar dados da resposta json
                var json = JSON.parse(xhr.responseText);

                if (json.mensagem == undefined) {
                    document.getElementById("txtNome").value = json.nome;
                    document.getElementById("txtEmail").value = json.email;
                } else {
                    alert(json.mensagem);
                }
                
            }
        }

        xhr.send();
    }

    static autenticacao2fatoresEstaAtivada()
    {
        var xhr = Ajax.createXHR();

        if (xhr != undefined) {
            var token  = Login.getCookie('token');

            if (token !== "") {
                xhr.open("GET","http://localhost/sistemaRest/api/v1/controller/torcedor.php?a=4&tk="+token,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    //Verificar pelo estado "4" de pronto.
                    if (xhr.readyState == '4') {
                        //Pegar dados da resposta json
                        var json = JSON.parse(xhr.responseText);
                        var msg = "";

                        if (json.mensagem != undefined) {
                            alert(json.mensagem);
                        } else {
                            var statusAutenticacao = json.resultado;
                            document.getElementById("statusAutenticacao").value = statusAutenticacao;

                            if (statusAutenticacao == 1) {
                                document.getElementById("btnCadastrar").value = 'Desativar';
                                Torcedor.pegarQrCode();
                            } else if (statusAutenticacao == 0) {
                                document.getElementById("btnCadastrar").value = 'Ativar';
                                document.getElementById("aviso").innerHTML = "Se você já habilitou anteriormente a autenticação de 2 fatores neste site verifique se no app google autenticator existe um registro deste site e se tiver exclua.";
                            } else if (statusAutenticacao == 2) {
                                document.getElementById("btnCadastrar").value = 'Desativar';
                                Torcedor.pegarQrCode();
                                var strHtml = '<br /> <label for="codAutenticacao">Código autenticação</label>';
                                strHtml += ' <input type="text" name="codAutenticacao" id="codAutenticacao" value="" />';
                                strHtml += '<br /><br />';
                                strHtml += '<input id="btnCadastrar" type="button" value="Validar" onclick="Torcedor.validaAutenticacao2fatores()" />';

                                document.getElementById("validaAutenticacao2Fatores").innerHTML = strHtml;
                                document.getElementById("statusAutenticacao").value = 1;
                            }
                        }

                    }
                }

                xhr.send();
            } else {
                alert("falha1");
            }
        } else {
            alert("falha2");
        }
    }

    static ativarDesativarAutenticacao2fatores()
    {
        var status = document.getElementById("statusAutenticacao").value;
        
        if (status == 1) {
            Torcedor.desativarAutenticacao2fatores();
        } else if (status == 0) {
            Torcedor.ativarAutenticacao2fatores();
        }
    }
}
