class Divisao
{
    static formToJSON(form) 
    {
        var codigo = "";

        if (form.codigo != undefined) {
            codigo = form.codigo.value;
        }

        return JSON.stringify({
            "codigo_divisao": codigo,
            "nome": form.txtNome.value
        });
    }

    static detalhe(codigo)
    {
        var xhr = Util.createXHR();
        xhr.open("GET","http://localhost/laravel-api/public/api/v1/divisaos/"+codigo,true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            //Verificar pelo estado "4" de pronto.

            if (xhr.readyState == '4' && xhr.status == '200') {
                //Pegar dados da resposta json
                var data = JSON.parse(xhr.responseText);
                document.getElementById("codigo").value = data.codigo_divisao;
                document.getElementById("txtNome").value = data.nome;
            }
        }

        var jwtoken = '';
        jwtoken = Util.getCookie('token');

        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xhr.send();
    }

    static consultar(form)
    {
        var xhr = Util.createXHR();

        var url = "http://localhost/laravel-api/public/api/v1/divisaos";

        if (form != null && form.txtNome.value != undefined && form.txtNome.value != '') {
            url += "/search?key-search="+form.txtNome.value;
        }

        if(xhr != undefined) {
            //Montar requisição
            xhr.open("GET", url, true);
            xhr.onload = function(e) {
                // Pega a tabela.
                var table = document.getElementById("tabela");

                //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4') {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);

                    if (xhr.status == '200') {
                        // Limpa toda a INNER da tabela.
                        table.innerHTML = "";
                        
                        var len = 0;

                        if (json.divisaos != null) {
                            len         = json.divisaos.data.length;
                        }

                        var temRegistro = false;
                        
                        

                        var strHTML     = "<caption class='titulo'>Consulta por nome as divisoes</caption>"
                        +"<thead>"
                            +"<tr>"
                                +"<th width='70px'>A&ccedil;&otilde;es</th>"
                                +"<th width='60px'>C&oacute;digo</th>"
                                +"<th>Nome</th>"
                            +"</tr>"
                        +"</thead>"
                        +"<tbody>";
                                        
                        var codigo = "", nome = "", detalhes = "", alterar = "", excluir = "", acao = "";
                                        
                        for (var i=0; i < len; i++) {
                            codigo    = json.divisaos.data[i].codigo_divisao;
                            nome      = json.divisaos.data[i].nome;

                            detalhes = "<a href=\"../consultas/detalhe.divisao.htm?codigo="
                            + codigo
                            + "\"><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>";

                            alterar = "<span>  </span><a href=\"../formularios/alterar.divisao.htm?codigo="
                            + codigo
                            + "\"><span class='glyphicon glyphicon-edit' aria-hidden='true'></span></a>";

                            excluir = "<span>  </span><a href=\"javascript:Divisao.confirmar("
                            + codigo
                            + ")\"><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></a>";

                            acao = detalhes+alterar+excluir;

                            strHTML += "<tr>"
                            +"<td>"+acao+"</td>"
                            +"<td>"+codigo+"</td>"
                            +"<td>"+nome+"</td>"
                            + "</tr>";
                            temRegistro = true;
                        }

                        console.log(json);

                        if(temRegistro  == false) {
                            strHTML = json.mensagem;
                        } else {
                            strHTML += "</tbody>"
                            +"<tfoot>"
                            +"<tr>"
                                +"<th width='70px'>A&ccedil;&otilde;es</th>"
                                +"<th width='60px'>C&oacute;digo</th>"
                                +"<th>Nome</th>"
                            +"</tr>"
                            +"</tfoot>";
                        }



                        table.innerHTML = strHTML;
                        
                        table.style.display = "";
                    } else if (xhr.status == '422') {
                        var strErrosValidate = "";

                        if (json.validate_error !== undefined && json.json.validate_error.key-search !== undefined) {
                            strErrosValidate += json.validate_error.key-search[0];
                        }

                        if (strErrosValidate !== '') {
                            table.innerHTML = "<br /><b>"+strErrosValidate+"</b>";    
                        } else {
                            table.innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else if (xhr.status == '500') {                 
                        if (json.error !== undefined && json.error === 'token_invalid') {
                            table.innerHTML = "<br /><b>Token inválido. Faça o login novamente.</b>";
                        } else {
                            table.innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else if (xhr.status == '401') {
                        if (json.error !== undefined && json.error === 'token_expired') {
                            table.innerHTML = "<br /><b>Token expirado. Faça o login novamente.</b>";
                        } else {
                            table.innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else {
                        table.innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                    }

                }
            }

            //Enviar

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send();
        }
    }
    
    static callbackCadAltDel(xhr, op)
    {
        var msg = "";

        if (op === 'cad') {
            msg = "Divisão cadastrada com sucesso.";
        } else if (op === 'alt') {
            msg = "Divisão alterada com sucesso.";
        }

        //Verificar pelo estado "4" de pronto.
        if (xhr.readyState == '4') {
            //Pegar dados da resposta json
            var json = JSON.parse(xhr.responseText);

            if (xhr.status == '200' || xhr.status == '201') {

                if (op == 'cad') {
                    document.getElementById("txtNome").value = "";
                }

                if (op !== 'exc') {
                    document.getElementById("mensagem").innerHTML = msg;
                }
                
            } else if (xhr.status == '422') {
                var strErrosValidate = "";

                if (json.validate_error !== undefined && json.json.validate_error.nome !== undefined) {
                    strErrosValidate += json.validate_error.nome[0];
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

    static confirmar(codigo)
    {
        var xhr = Util.createXHR();
        var ok = window.confirm("Voce tem certeza que deseja excluir?");

        if (ok && xhr != undefined) {
            var mensagem = "";

            if (codigo == "") {
                mensagem += "Código invalido";
            }

            if(mensagem == "") {
                xhr.open("DELETE","http://localhost/laravel-api/public/api/v1/divisaos/"+codigo, true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    Tecnico.callbackCadAltDel(xhr, 'exc');
                    location.reload();
                }

                var jwtoken = '';
                jwtoken = Util.getCookie('token');

                xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
                xhr.send();
            } else {
                alert(mensagem);
            } 
        }
    }

    static cadastrar(form) 
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        var xhr = Util.createXHR();
        var mensagem = "";

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu a divisão</b>";
        }

        if (Util.getCookie('token') == "") {
            mensagem += "Token inválido";
        }
                
        if (mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://localhost/laravel-api/public/api/v1/divisaos",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Divisao.callbackCadAltDel(xhr, 'cad');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Divisao.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        }
    }

    static atualizar(form) 
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        
        var codigo = form.codigo.value;
        var mensagem = "";

        if (Util.getCookie('token') == "") {
            mensagem += "Token invalido";
        }

        if (codigo == "" || codigo == undefined) {
            mensagem += "Código invalido";
        }
        
        if (document.getElementById("txtNome").value == "") {
            mensagem += "<br /><b>Você não preencheu a Divisão</b>";
        }
        
        var consulta = "";

        var xhr = Util.createXHR();

        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://localhost/laravel-api/public/api/v1/divisaos/"+codigo,true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Divisao.callbackCadAltDel(xhr, 'alt');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Divisao.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }
}
