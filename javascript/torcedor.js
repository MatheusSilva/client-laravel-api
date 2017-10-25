class Torcedor
{
    static formToJSON(form) 
    {
        var codigo        = '';
        var txtNome       = '';
        var txtEmail      = '';
        var txtSenha      = '';
        var txtSenhaAtual = '';
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
            "name":  txtNome,
            "email":  txtEmail,
            "password":  txtSenha,
            "password_confirmation":  txtConfSenha
        });
    }

    static ativarAutenticacao2fatores()
    {
        var xhr = Util.createXHR();
        var ok = window.confirm("Você tem certeza que deseja ativar a autenticação de 2 fatores?");

        if (ok && xhr != undefined) {
            var token  = Util.getCookie('token');
            var consulta = "";

            if (token !== "") {
                xhr.open("GET","http://127.0.0.1/sistemaRest/api/v1/controller/torcedor.php?a=1&tk="+token,true);
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
        var xhr = Util.createXHR();

        if (xhr != undefined) {
            var token  = Util.getCookie('token');

            if (token !== "") {
                xhr.open("GET","http://127.0.0.1/sistemaRest/api/v1/controller/torcedor.php?a=5&tk="+token,true);
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
        var xhr = Util.createXHR();
        var ok = window.confirm("Você tem certeza que deseja desativar a autenticação de 2 fatores?");

        if (ok && xhr != undefined) {
            var token  = Util.getCookie('token');
            var consulta = "";

            if (token !== "") {
                xhr.open("GET","http://127.0.0.1/sistemaRest/api/v1/controller/torcedor.php?a=2&tk="+token,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    //Verificar pelo estado "4" de pronto.
                    if (xhr.readyState == '4') {
                        //Pegar dados da resposta json
                        var json = JSON.parse(xhr.responseText);
                        alert(json.mensagem);                        
                        window.location.href = "../paginas/home.htm";
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
        var xhr = Util.createXHR();

        if (xhr != undefined) {
            var token  = Util.getCookie('token');
            var consulta = "";
            var codigoAutenticacao = document.getElementById("codAutenticacao").value;

            if (codigoAutenticacao != '') {
                consulta = "&key="+codigoAutenticacao;    
            }

            if (token !== "") {
                xhr.open("GET","http://127.0.0.1/sistemaRest/api/v1/controller/torcedor.php?a=3&tk="+token+consulta,true);
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
                            window.location.href = "../paginas/home.htm";        
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

    static callbackCadAlt(xhr, op)
    {
        var msg = "";

        if (op === 'cad') {
            msg = "Torcedor cadastrado com sucesso.";
        } else if (op === 'alt') {
            msg = "Torcedor alterado com sucesso.";
        }

        //Verificar pelo estado "4" de pronto.
        if (xhr.readyState == '4') {
            //Pegar dados da resposta json
            var json = JSON.parse(xhr.responseText);

            if (xhr.status == '200' || xhr.status == '201') {
               
                if (op == 'cad') {
                    document.getElementById("txtNome").value = "";
                    document.getElementById("txtEmail").value = "";
                    document.getElementById("txtSenha").value = "";
                    document.getElementById("txtConfSenha").value = "";
                }

                if (op == 'cad' || op == 'alt') {
                    document.getElementById("mensagem").innerHTML = msg;
                }

            } else if (xhr.status == '422') {
                var strErrosValidate = "";

                if (json.validate_error.name !== undefined) {
                    strErrosValidate += json.validate_error.name[0];
                }

                if (json.validate_error.email !== undefined) {
                    strErrosValidate += json.validate_error.email[0];
                }

                if (json.validate_error.password !== undefined) {
                    strErrosValidate += json.validate_error.password[0];
                }

                if (strErrosValidate !== '') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>"+strErrosValidate+"</b>";    
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
            } else if (xhr.status == '500') {
                if (json.error !== undefined && json.error === 'token_invalid') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Token inválido. Faça o login novamente.</b>";
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
            } else if (xhr.status == '401') {
                if (json.error !== undefined && json.error === 'token_expired') {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Token expirado. Faça o login novamente.</b>";
                } else {
                    document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                }
            } else {
                document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
            }
        }
    }

    static cadastrar(form) 
    {
        //verificar cadastro
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";  
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu o nome</b>";
        }

        if (form.txtEmail.value == "") {
            mensagem += "<br /><b>Você não preencheu o email</b>";
        }

        if (form.txtSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a senha</b>";
        }

        
        if (form.txtConfSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a confirmação da senha</b>";
        }

        if (form.txtSenha.value !== form.txtConfSenha.value) {
            mensagem += "<br /><b>As senhas não conferem</b>";
        }
        

        if(mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://127.0.0.1/laravel-api/public/api/v1/cadusuario",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Torcedor.callbackCadAlt(xhr, 'cad');
            }
            
            xhr.send(Torcedor.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }

    static atualizar(form) 
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";  
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu a técnico</b>";
        }
        
        var token  = Util.getCookie('token');
        
        var consulta = "";

        if (token !== "") {
            consulta = "&tk="+token;
        }

        if(mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://127.0.0.1/sistemaRest/api/v1/controller/torcedor.php?a=8"+consulta,true);
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
    
    static alterarMinhaSenhaLogado(form)
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a senha</b>";
        }

        if (form.txtConfSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a confirmação da nova senha</b>";
        }

        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://127.0.0.1/laravel-api/public/api/v1/altsenhalog",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.

                if (xhr.readyState == '4') {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);

                    if (xhr.status == '200' || xhr.status == '201') {
                        document.getElementById("mensagem").innerHTML = "Senha alterada com sucesso.";
                    } else if (xhr.status == '422') {
                        var strErrosValidate = "";

                        if (json.validate_error.hasOwnProperty('password_current_invalid') == false) {
                            strErrosValidate += "<br /><b>Senha atual inválida.</b>";
                        }

                        if (json.validate_error.password !== undefined) {
                            strErrosValidate += json.validate_error.password[0];
                        }

                        if (json.validate_error.password_confirmation !== undefined) {
                            strErrosValidate += json.validate_error.password_confirmation[0];
                        }

                        if (strErrosValidate !== '') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>"+strErrosValidate+"</b>";    
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else if (xhr.status == '500') {
                        if (json.error !== undefined && json.error === 'token_invalid') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Token inválido. Faça o login novamente.</b>";
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else if (xhr.status == '401') {
                        if (json.error !== undefined && json.error === 'token_expired') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Token expirado. Faça o login novamente.</b>";
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else {
                        document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                    }
                }
            }
            
            var form = JSON.stringify({
                "password_current":  form.txtSenhaAtual.value,
                "password":  form.txtSenha.value,
                "password_confirmation":  form.txtConfSenha.value;
            });

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(form);
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        }
    }
    
    static esqueciMinhaSenha(form)
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtEmail.value == "") {
            mensagem += "<br /><b>Você não preencheu o E-mail</b>";
        }

        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://127.0.0.1/laravel-api/public/api/v1/esquecisenha",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.

                if (xhr.readyState == '4') {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);

                    if (xhr.status == '200' || xhr.status == '201') {
                        document.getElementById("mensagem").innerHTML = "Link de redefinição enviado com sucesso.";
                    } else if (xhr.status == '422') {
                        var strErrosValidate = "";

                        if (json.validate_error.email !== undefined) {
                            strErrosValidate += json.validate_error.email[0];
                        }

                        if (strErrosValidate !== '') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>"+strErrosValidate+"</b>";    
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else {
                        document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                    }
                }
            }
            
            var form = JSON.stringify({
                "email":  form.txtEmail.value
            });

            xhr.send(form);
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        }
    }
    
    static alterarMinhaSenha(form)
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a senha</b>";
        }

        if (form.txtConfSenha.value == "") {
            mensagem += "<br /><b>Você não preencheu a confirmação da nova senha</b>";
        }

        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://127.0.0.1/laravel-api/public/api/v1/altsenha",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.

                if (xhr.readyState == '4') {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);

                    if (xhr.status == '200' || xhr.status == '201') {
                        document.getElementById("mensagem").innerHTML = "Senha alterada com sucesso.";
                    } else if (xhr.status == '422') {
                        var strErrosValidate = "";

                        if (json.validate_error.hasOwnProperty('forgot_token')) {
                            strErrosValidate += "<br /><b>Link de redefinição inválido ou expirado.</b>";
                        }

                        if (json.validate_error.password !== undefined) {
                            strErrosValidate += json.validate_error.password[0];
                        }

                        if (json.validate_error.password_confirmation !== undefined) {
                            strErrosValidate += json.validate_error.password_confirmation[0];
                        }

                        if (strErrosValidate !== '') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>"+strErrosValidate+"</b>";    
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else if (xhr.status == '500') {
                        if (json.error !== undefined && json.error === 'token_invalid') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Token inválido. Faça o login novamente.</b>";
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else if (xhr.status == '401') {
                        if (json.error !== undefined && json.error === 'token_expired') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Token expirado. Faça o login novamente.</b>";
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else {
                        document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                    }
                }
            }
            
            var form = JSON.stringify({
                "forgot_token":  form.txtForgotToken.value,
                "password":  form.txtSenha.value,
                "password_confirmation":  form.txtConfSenha.value;
            });

            xhr.send(form);
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        }
    }

    static insereDadosTorcedorRetornados(codigo)  
    {
        var xhr = Util.createXHR();

        var token  = Util.getCookie('token');
        var consulta = "";

        if (token !== "") {
            consulta = "&tk="+token;
        }

        xhr.open("GET","http://127.0.0.1/sistemaRest/api/v1/controller/torcedor.php?a=7&id="+codigo+consulta,true);   
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
        var xhr = Util.createXHR();

        if (xhr != undefined) {
            var token  = Util.getCookie('token');

            if (token !== "") {
                xhr.open("GET","http://127.0.0.1/sistemaRest/api/v1/controller/torcedor.php?a=4&tk="+token,true);
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
