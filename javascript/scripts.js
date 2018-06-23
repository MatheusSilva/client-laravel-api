"use strict";

class Util
{
    static createCookie(nome, valor, tempo, opcao = 'dias') 
    {
        var expires;
        
        if (tempo) {
            var date = new Date();

            if (opcao == 'dias') {
                date.setTime(date.getTime() + (tempo * 24 * 60 * 60 * 1000));
            } else if (opcao == 'horas') {
                date.setTime(date.getTime() + (tempo * 60 * 60 * 1000));
            } else if (opcao == 'minutos') {
                date.setTime(date.getTime() + (tempo * 60 * 1000));
            }

            //var offset = '+3';  // e.g. if the timeZone is -3
            //var MyDateWithOffset = new Date( date.toGMTString() + offset );
            //os cookies trabalhao com timeZone/GMT 0, nao adianta converter, mas o cookie fica ativo corretamente por X dias
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        
        document.cookie = nome + "=" + valor + expires + "; path=/";
    }

    static getCookie(c_name) 
    {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }


    static queryString() 
    {
        location.queryString = {};
        location.search.substr(1).split("&").forEach(function (pair) {
            if (pair === "") return;
            var parts = pair.split("=");
            location.queryString[parts[0]] = parts[1] &&
                decodeURIComponent(parts[1].replace(/\+/g, " "));
        });
    }

    static createXHR()
    {
        var xhr = false;

        try {
            xhr = new XMLHttpRequest();
        } catch (trymicrosoft) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (othermicrosoft) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (failed) {
                    xhr = false;
                }
            }
        }

        if (!xhr) {
            alert("Error initializing XMLHttpRequest!");
        } else {
            return xhr;
        }
    }

    static logado()
    {
        var mensagem = "";
        
        var xhr = Util.createXHR();

        if (xhr != undefined) {
            xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/logado", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                 //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4' && xhr.status != '200') {
                    window.location = "http://127.0.0.1/client-laravel-api/adm/formularios/form.login.htm"; 
                } else {
                    Util.createCookie('token', Util.getCookie('token'), '10', 'minutos');
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            if (jwtoken != '') {
                xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
                xhr.send();
            } else {
                window.location = "http://127.0.0.1/client-laravel-api/adm/formularios/form.login.htm";
            }
        } else {
            window.location = "http://127.0.0.1/client-laravel-api/adm/formularios/form.login.htm";
        }
    }

    static logout()
    {
        var mensagem = "";
        
        var xhr = Util.createXHR();

        if (xhr != undefined) {
            xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/logout", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                 //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4') {
                    Util.createCookie('token', '', -1);
                    window.location = "http://127.0.0.1/client-laravel-api/site/paginas/home.htm";
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            if (jwtoken != '') {
                xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
                xhr.send();
            }

            window.location = "http://127.0.0.1/client-laravel-api/site/paginas/home.htm";
        } else {
            Util.createCookie('token', '', -1);
            window.location = "http://127.0.0.1/client-laravel-api/site/paginas/home.htm";
        }
    }

    static alterbgmenu(op) 
    {
        document.getElementById("menuprincipal").classList.remove('bg-primary', 'bg-success', 'bg-warning', 'bg-info', 'bg-danger', 'bg-dark');

        if (op == 1) {
            document.getElementById("menuprincipal").classList.add('bg-primary');
        } else if (op == 2) {
            document.getElementById("menuprincipal").classList.add('bg-success');
        } else if (op == 3) {
            document.getElementById("menuprincipal").classList.add('bg-warning');
        } else if (op == 4) {
            document.getElementById("menuprincipal").classList.add('bg-info');
        } else if (op == 5) {
            document.getElementById("menuprincipal").classList.add('bg-danger');
        } else {
            document.getElementById("menuprincipal").classList.add('bg-dark');
        }
    }

    static goBack() 
    {
        window.history.back();
    }
}

class Login
{
    static valida(form)
    {
        var strErro = ""; 

        if (form.email  == undefined || form.email  === "") {
            strErro = strErro + "\nVoce Nao Preencheu o Login";
        }

        if (form.password == undefined || form.password === "") {
            strErro = strErro + "\nVoce Nao Preencheu a Senha";
        }

        if(strErro !== "") {
            document.getElementById("mensagem").innerHTML = "<br /><b>"+strErro+"</b>";  
            return false;
        }
    }

    static formToJSON(form) 
    {
        var email  = '';
        var password = '';

        if (form.email != undefined) {
            email = form.email.value;
        }

        if (form.password != undefined) {
            password = form.password.value;
        }

        return JSON.stringify({
            "email": email,
            "password": password
        });
    }

    static entrar(form)
    {
        if (Login.valida(form) == false) {
            return false;
        }
        
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        var mensagem = "";
        
        var xhr = Util.createXHR();

        if (mensagem == "" && xhr != undefined && 'withCredentials' in xhr) {
            xhr.open("POST","http://127.0.0.1/laravel-api/public/api/v1/auth", true);
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                 //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4') {
                    //Pegar dados da resposta json
                    
                    var json = JSON.parse(xhr.responseText);

                    if (xhr.status == '200') {
                        Util.createCookie('token', json.token, '10', 'minutos');
                        window.location = "http://127.0.0.1/client-laravel-api/adm/paginas/home.htm";
                    } else if (xhr.status == '422') {
                        var strErrosValidate = "";

                        if (json.json.validate_error.email !== undefined) {
                            strErrosValidate += json.validate_error.email[0];
                        }

                        if (json.json.validate_error.password !== undefined) {
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
                        if (json.error !== undefined && json.error === 'invalid_credentials') {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Senha ou usuário inválidos.</b>";
                        } else {
                            document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                        }
                    } else {
                        document.getElementById("mensagem").innerHTML = "<br /><b>Algum erro desconhecido ocorreu.</b>";
                    }
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

           //xhr.withCredentials = true;
            //xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Login.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }
}

class Categoria
{
    static formToJSON(form) 
    {
        var codigo = "", nome = "";

        if (form.codigo != undefined) {
            codigo = form.codigo.value;
        }

        if (form.txtNome != undefined) {
            nome = form.txtNome.value;
        }

        return JSON.stringify({
            "codigo_categoria": codigo,
            "nome": nome
        });
    }

    static listar()
    {
        var jwtoken,codigo,detalhes,alterar,excluir;

        jwtoken = Util.getCookie('token');

        var table = jQuery('#tabela01').dataTable( {
        processing: true,
        serverSide: true,
        dom: "Bfrtip",        
        ajax : {
         "url": 'http://127.0.0.1/laravel-api/public/api/v1/categorias',
         "dataType": 'json',
         "type": "GET",
         "beforeSend": function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
         }
        },
        columns: [
        {
        "class": "details-control",
        "orderable": false,
        "searchable": false,
        "searchable": false,
        "data": null, 
        render: function ( data, type, row ) {

            codigo = data.codigo_categoria;

            // Combine the first and last names into a single table field
            detalhes = "<a href=\"../formularios/categoria.htm?op=2&codigo="
            + codigo
            + "\"><i class='fas fa-info' aria-hidden='true'></i></a>";

            alterar = "<span>  </span><a href=\"../formularios/categoria.htm?op=1&codigo="
            + codigo
            + "\"><i class='fas fa-edit'></i></a>";

            excluir = "<span>  </span><a href=\"javascript:Categoria.confirmar("
            + codigo
            + ")\"><i class='fas fa-trash'></i></a>";

            //console.log(row);
            return detalhes+alterar+excluir;
        }, 
        "defaultContent": "",
        },

        { "data": "codigo_categoria" , name: "codigo_categoria", "width": "60px" },
        { "data": "nome" },

        ],
        select: true,
        'language': {
        'url': '../../javascript/Portuguese-Brasil.json'
        }

        });
    }


    static detalhe(codigo)
    {
        var xhr = Util.createXHR();
        xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/categorias/"+codigo,true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            //Verificar pelo estado "4" de pronto.

            if (xhr.readyState == '4' && xhr.status == '200') {
                //Pegar dados da resposta json
                var data = JSON.parse(xhr.responseText);
                document.getElementById("codigo").value = data.codigo_categoria;
                document.getElementById("txtNome").value = data.nome;
            }
        }

        var jwtoken = '';
        jwtoken = Util.getCookie('token');

        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xhr.send();
    }

    static callbackCadAltDel(xhr, op)
    {
        var msg = "";

        if (op === 'cad') {
            msg = "Categoria cadastrada com sucesso.";
        } else if (op === 'alt') {
            msg = "Categoria alterada com sucesso.";
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
        var ok = window.confirm("Você tem certeza que deseja excluir esta categoria?");

        if (ok) { 	 
            var mensagem = "";

            if (Util.getCookie('token') == "") {
                mensagem += "Token invalido";
            }

            if (codigo == "") {
                mensagem += "Código invalido";
            }
                    
            if (mensagem == "" && xhr != undefined) {
                xhr.open("DELETE","http://127.0.0.1/laravel-api/public/api/v1/categorias/"+codigo,true);
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
            mensagem += "<br /><b>Você não preencheu a categoria</b>";
        }

        if (Util.getCookie('token') == "") {
            mensagem += "Token invalido";
        }

        if (mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://127.0.0.1/laravel-api/public/api/v1/categorias",true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Categoria.callbackCadAltDel(xhr, 'cad');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Categoria.formToJSON(form));
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
            mensagem += "<br /><b>Você não preencheu a Categoria</b>";
        }
        
        var consulta = "";

        var xhr = Util.createXHR();

        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://127.0.0.1/laravel-api/public/api/v1/categorias/"+codigo,true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Categoria.callbackCadAltDel(xhr, 'alt');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Categoria.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }
}

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

    static listar()
    {
        var jwtoken,codigo,detalhes,alterar,excluir;

        jwtoken = Util.getCookie('token');

        var table = jQuery('#tabela01').dataTable( {
        processing: true,
        serverSide: true,
        dom: "Bfrtip",        
        ajax : {
         "url": 'http://127.0.0.1/laravel-api/public/api/v1/divisoes',
         "dataType": 'json',
         "type": "GET",
         "beforeSend": function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
         }
        },
        columns: [
        {
        "class": "details-control",
        "orderable": false,
        "searchable": false,
        "searchable": false,
        "data": null, 
        render: function ( data, type, row ) {

            codigo = data.codigo_divisao;

            // Combine the first and last names into a single table field
            detalhes = "<a href=\"../formularios/divisao.htm?op=2&codigo="
            + codigo
            + "\"><i class='fas fa-info' aria-hidden='true'></i></a>";

            alterar = "<span>  </span><a href=\"../formularios/divisao.htm?op=1&codigo="
            + codigo
            + "\"><i class='fas fa-edit'></i></a>";

            excluir = "<span>  </span><a href=\"javascript:Divisao.confirmar("
            + codigo
            + ")\"><i class='fas fa-trash'></i></a>";

            //console.log(row);
            return detalhes+alterar+excluir;
        }, 
        "defaultContent": "",
        },

        { "data": "codigo_divisao" , name: "codigo_divisao", "width": "60px" },
        { "data": "nome" },

        ],
        select: true,
        'language': {
        'url': '../../javascript/Portuguese-Brasil.json'
        }

        });
    }

    static detalhe(codigo)
    {
        var xhr = Util.createXHR();
        xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/divisoes/"+codigo,true);
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
        var ok = window.confirm("Você tem certeza que deseja excluir esta divisão?");

        if (ok && xhr != undefined) {
            var mensagem = "";

            if (codigo == "") {
                mensagem += "Código invalido";
            }

            if(mensagem == "") {
                xhr.open("DELETE","http://127.0.0.1/laravel-api/public/api/v1/divisoes/"+codigo, true);
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
            xhr.open("POST","http://127.0.0.1/laravel-api/public/api/v1/divisoes",true);
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
            xhr.open("PUT","http://127.0.0.1/laravel-api/public/api/v1/divisoes/"+codigo,true);
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

class Time
{
    static valida(form)
    {
        var strErro = "";

        if (document.getElementById("txtNome").value == "") {
            strErro = strErro + "\nVoce Nao Preencheu o Nome";
        }

        if (document.getElementById("txtFoto").value == "") {
            strErro = strErro + "\nVoce Nao selecionou uma foto";
        }

        if(strErro != "") {
            alert(strErro);
            return false;
        }
    }

    static limpacamposCadastro()
    {
        document.getElementById("txtFoto").value = '';
        document.getElementById("txtNome").value = '';
        document.getElementById("cmbDivisao").options.length = 0;
        document.getElementById("cmbCategoria").options.length = 0;
        document.getElementById("cmbTecnico").options.length = 0;
        
        var rDesempenhotime = document.getElementsByName("rDesempenhotime");
        rDesempenhotime[0].checked = true;

        var rComprarnovojogador = document.getElementsByName("rComprarnovojogador");
        rComprarnovojogador[0].checked = true;
    }
    
    static cadastrar(form) 
    {
        //if (Time.valida() == false) {
           // return false;
        //}

        /* mesmo codigo utilizando jquery
        jQuery.ajax({
            url: 'http://127.0.0.1/sistemaRest/api/v1/controller/time.php?a=3'+consulta,
            type: 'POST',
            data: jForm,
            dataType: 'json',
            mimeType: 'application/json',
            contentType: false,
            cache: false,
            processData: false
        }).always(function(returndata) {
            limpacamposCadastro();
            alert(returndata.mensagem);
            location.reload();
        });
        */
        
        var xhr = Util.createXHR();

        if (xhr != undefined) {
            var e = document.getElementById("cmbDivisao");
            var cmbDivisao = e.options[e.selectedIndex].value;

            var e = document.getElementById("cmbCategoria");
            var cmbCategoria = e.options[e.selectedIndex].value;

            var e = document.getElementById("cmbTecnico");
            var cmbTecnico = e.options[e.selectedIndex].value;

            var txtNome = document.getElementById("txtNome").value;

            var file = document.getElementById("txtFoto").files[0];

            var jForm = new FormData();
            jForm.append("capa", file);
            jForm.append("nome", txtNome);
            jForm.append("codigo_divisao", cmbDivisao);
            jForm.append("codigo_categoria", cmbCategoria);
            jForm.append("codigo_tecnico", cmbTecnico);
            jForm.append("desempenho_time", document.querySelector('input[name="rDesempenhotime"]:checked').value);
            jForm.append("comprar_novo_jogador", document.querySelector('input[name="rComprarnovojogador"]:checked').value);
        
            //Montar requisição
            xhr.open("POST","http://127.0.0.1/laravel-api/public/api/v1/times");

            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);
                    alert(json.mensagem);
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(jForm);
        }

        return false;
    }

    static atualizar(form)
    {
        /* mesmo codigo utilizando jquery
        jQuery.ajax({
            url: 'http://127.0.0.1/sistemaRest/api/v1/controller/time.php?a=4'+codigo+consulta,
            type: 'POST',
            data: jForm,
            async: false,
            contentType: false,
            cache: false,
            processData: false
        }).fail(function( jqXHR, textStatus, errorThrown ) {
            alert("Falha ao alterar time.");
        }).always(function (data, textStatus, jqXHRP) {
            alert(data.mensagem);
        });
        */

        var codigo = document.getElementById("codigo").value;  

        if (codigo == "") {
            mensagem += "Código invalido";
        } else {
            codigo = "/"+codigo;
        }
        
        var xhr = Util.createXHR();

        if (xhr != undefined) {
            var e = document.getElementById("cmbDivisao");
            var cmbDivisao = e.options[e.selectedIndex].value;

            var e = document.getElementById("cmbCategoria");
            var cmbCategoria = e.options[e.selectedIndex].value;

            var e = document.getElementById("cmbTecnico");
            var cmbTecnico = e.options[e.selectedIndex].value;

            var txtNome = document.getElementById("txtNome").value;

            var file = document.getElementById("txtFoto").files[0];

            var jForm = new FormData();

            jForm.append("capa", file);
            jForm.append("nome", txtNome);
            jForm.append("codigo_divisao", cmbDivisao);
            jForm.append("codigo_categoria", cmbCategoria);
            jForm.append("codigo_tecnico", cmbTecnico);

            var token  = Util.getCookie('token');

            var assincrono = true; // true para assincrono e false para sincrono
        
            //Montar requisição
            xhr.open("POST","http://127.0.0.1/laravel-api/public/api/v1/times"+codigo, assincrono);

            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //Pegar dados da resposta json
                    var json = JSON.parse(xhr.responseText);
                    document.getElementById("mensagem").innerHTML = "Time alterado com sucesso.";
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(jForm);
        }
    }
        
    static confirmar(codigo)
    {
        var ok = window.confirm("Você tem certeza que deseja excluir este time?");

        if (ok) {	
            var mensagem = "";

            if (codigo == "") {
                mensagem += "Código invalido";
            } else {
                codigo = "/"+codigo;
            }
            
            var xhr = Util.createXHR();
            
            if (mensagem === "" && xhr != undefined) {
                xhr.open("DELETE","http://127.0.0.1/laravel-api/public/api/v1/times"+codigo,true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.onreadystatechange = function() {
                    //Verificar pelo estado "4" de pronto.
                    if (xhr.readyState == '4') {
                        //Pegar dados da resposta json
                        var json = JSON.parse(xhr.responseText);
                        alert(json.mensagem);
                        location.reload();  
                    }
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

    static listar()
    {
        var jwtoken,codigo,detalhes,alterar,excluir;

        jwtoken = Util.getCookie('token');

        var table = jQuery('#tabela01').dataTable( {
        processing: true,
        serverSide: true,
        dom: "Bfrtip",        
        ajax : {
         "url": 'http://127.0.0.1/laravel-api/public/api/v1/times',
         "dataType": 'json',
         "type": "GET",
         "beforeSend": function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
         }
        },
        columns: [
        {
        "class": "details-control",
        "orderable": false,
        "searchable": false,
        "searchable": false,
        "data": null, 
        render: function ( data, type, row ) {

            codigo = data.codigo_time;

            // Combine the first and last names into a single table field
            detalhes = "<a href=\"../consultas/detalhe.time.htm?codigo="
            + codigo
            + "\"><i class='fas fa-info' aria-hidden='true'></i></a>";

            alterar = "<span>  </span><a href=\"../formularios/alterar.time.htm?codigo="
            + codigo
            + "\"><i class='fas fa-edit'></i></a>";

            

            excluir = "<span>  </span><a href=\"javascript:Time.confirmar("
            + codigo
            + ")\"><i class='fas fa-trash'></i></a>";

            //console.log(row);
            return detalhes+alterar+excluir;
        }, 
        "defaultContent": "",
        },

        { "data": "codigo_time" , name: "codigo_time", "width": "60px" },
        { "data": "nome" },

        ],
        select: true,
        'language': {
        'url': '../../javascript/Portuguese-Brasil.json'
        }

        });
    }

    static detalhe(codigo, selecionarcombos = false)
    {
        var xhr = Util.createXHR();
        xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/times/"+codigo);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            //Verificar pelo estado "4" de pronto.

            if (xhr.readyState == '4' && xhr.status == '200') {
                //Pegar dados da resposta json
                var data = JSON.parse(xhr.responseText);
                document.getElementById("codigo").value = data.codigo_time;

                if (selecionarcombos) {
                    document.getElementById("cdiv"+data.codigo_divisao).selected   = "true";
                    document.getElementById("ccat"+data.codigo_categoria).selected = "true";
                    document.getElementById("ctec"+data.codigo_tecnico).selected   = "true";
                }

                document.getElementById("txtNome").value = data.nome;
            }
        }

        var jwtoken = '';
        jwtoken = Util.getCookie('token');

        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xhr.send();
    }

    static carregaDivisao()
    {
        var xhr = Util.createXHR();

        if(xhr != undefined) {
            //Montar requisição

            xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/divisoes/listar-tudo");
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4') {
                    var json = JSON.parse(xhr.responseText);
                    var len         = json.divisaos.length;
                    var temRegistro = false;
                    var strHTML     = '';

                    for (var i=0; i < len; i++) {
                        var codigo  = json.divisaos[i].codigo_divisao;
                        var nome    = json.divisaos[i].nome;
                        
                        strHTML =  strHTML + "<option id=\"cdiv"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";

                        temRegistro = true;	
                    }

                    if (temRegistro == false) {
                        strHTML = "<option value=\"\">Nenhuma categoria cadastrada</option>";
                    }  

                    document.getElementById("cmbDivisao").innerHTML = strHTML;
                    Util.prototype.ajaxcount++;
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(); 
        }     
    }

    static carregaCategoria()
    {
        var xhr = Util.createXHR();

        if(xhr != undefined) {

            //Montar requisição
            xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/categorias/listar-tudo");
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4') {
                    var json = JSON.parse(xhr.responseText);    
                    var len         = json.categorias.length;
                    var temRegistro = false;
                    var strHTML     = '';

                    for (var i=0; i < len; i++) {
                        var codigo   = json.categorias[i].codigo_categoria;
                        var nome     = json.categorias[i].nome;
                        
                        strHTML =  strHTML + "<option id=\"ccat"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";
                        

                        temRegistro = true;	
                    }

                    if (temRegistro  === false) {
                        strHTML = "<option value=\"\">Nenhuma categoria cadastrada</option>";
                    }   

                    document.getElementById("cmbCategoria").innerHTML = strHTML;
                    Util.prototype.ajaxcount++;
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(); 
        }
    }

    static carregaTecnico()
    {
        var xhr = Util.createXHR();

        if(xhr != undefined) {

            //Montar requisição
            xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/tecnicos/listar-tudo");
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4') {
                    var json = JSON.parse(xhr.responseText);
                    var len         = json.tecnicos.length;
                    var temRegistro = false;
                    var strHTML     = '';

                    for (var i=0; i < len; i++) {
                        var codigo   = json.tecnicos[i].codigo_tecnico;
                        var nome     = json.tecnicos[i].nome;
                        
                        strHTML =  strHTML + "<option id=\"ctec"+codigo+"\" value=\""+codigo+"\">"+nome+"</option>";

                        temRegistro = true;	
                    }

                    if(temRegistro  === false) {
                        strHTML = "<option value=\"\">Nenhuma tecnico cadastrado</option>";
                    }   

                    document.getElementById("cmbTecnico").innerHTML = strHTML;
                    Util.prototype.ajaxcount++;
                }
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send();
        }
    }

    static tudoParaDestino()
    {
        var select  = document.getElementById("origem");
        var tamanho = select.options.length;
        var dhtml   = "";
        var valor   = "";
        var texto   = "";

        for (i=0; i< tamanho; i++) {
            valor = select.options[i].value;
            texto = select.options[i].text;	
            dhtml = dhtml + "\n<option value=\""+valor+"\">"+texto+"</option>";
        }

        document.getElementById("destino").innerHTML = dhtml;
    }

    static selecionadoParaDestino()
    {
        var select  = document.getElementById("origem");
        var tamanho = select.options.length;
        var valor   = "";
        var texto   = "";
        var dhtml   = "";

        for (i=0; i < tamanho; i++) {
            if (select.options[i].selected === true) { 
                valor = select.options[i].value;
                texto = select.options[i].text;
                dhtml = dhtml + "\n<option value=\""+valor+"\">"+texto+"</option>";	
            }
        }

        document.getElementById("destino").innerHTML = dhtml;
    }

    static limpaDestino()
    {
        document.getElementById("destino").innerHTML = "";
    }

    static limpaSelecionadosDestino()
    {
        var select  = document.getElementById("destino");
        var tamanho = select.options.length;
        var dhtml   = "";
        var valor   = "";
        var texto   = "";

        for (i=0; i < tamanho; i++) {
            if ( select.options[i].selected !== true) {
                valor = select.options[i].value;
                texto = select.options[i].text;
                dhtml = dhtml + "\n<option value=\""+valor+"\">"+texto+"</option>";	
            }
        }
        
        document.getElementById("destino").innerHTML = dhtml;
    }

}
class Tecnico
{   
    static valida()
    {
        var strErro = '';

        var txtDataNascimento = document.getElementById("txtDataNascimento").value;
        txtDataNascimento = txtDataNascimento.split("/");

        if (document.getElementById("txtNome").value == "") {
            strErro = strErro + "\nVocê não preencheu o nome.";
        }
        
        if (txtDataNascimento[0] == "Dia") {
            strErro = strErro + "\nVocê não preencheu o dia.";
        }
        
        if (txtDataNascimento[1] == "Mes") {
            strErro = strErro + "\nVocê não preencheu o mes.";
        }
        
        if (txtDataNascimento[2] == "Ano") {
            strErro = strErro + "\nVocê não preencheu o ano.";
        }
        
        if (txtDataNascimento[0] == "31" && (
            txtDataNascimento[1] == "04" 
            || txtDataNascimento[1]  == "06" 
            || txtDataNascimento[1]  == "09" 
            || txtDataNascimento[1]  == "11")
        ) {
            strErro = strErro + "\no mês que você escolheu não possui mais de 30 dias.";
        }
         
        if ((txtDataNascimento[0] == "29") && (txtDataNascimento[1] == "02") && (
        (txtDataNascimento[2]%4 != "0") || (txtDataNascimento[2]%100 != "0") || (txtDataNascimento[2]%400 != "0")
        )) {
            strErro = strErro + "\nEste ano não é bissexto.";
        }
        
        if (txtDataNascimento[0] > 29 && txtDataNascimento[1] == "02") {
            strErro = strErro + "\nfevereiro não tem mais que 29 dias.";
        }

        if(strErro != "") {
            alert(strErro);
            return false;
        }
    }

    static listar()
    {
        var jwtoken,codigo,detalhes,alterar,excluir;

        jwtoken = Util.getCookie('token');

        var table = jQuery('#tabela01').dataTable( {
        processing: true,
        serverSide: true,
        dom: "Bfrtip",        
        ajax : {
         "url": 'http://127.0.0.1/laravel-api/public/api/v1/tecnicos',
         "dataType": 'json',
         "type": "GET",
         "beforeSend": function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
         }
        },
        columns: [
        {
        "class": "details-control",
        "orderable": false,
        "searchable": false,
        "searchable": false,
        "data": null, 
        render: function ( data, type, row ) {

            codigo = data.codigo_tecnico;

            // Combine the first and last names into a single table field
            detalhes = "<a href=\"../formularios/tecnico.htm?op=2&codigo="
            + codigo
            + "\"><i class='fas fa-info' aria-hidden='true'></i></a>";

            alterar = "<span>  </span><a href=\"../formularios/tecnico.htm?op=1&codigo="
            + codigo
            + "\"><i class='fas fa-edit'></i></a>";

            excluir = "<span>  </span><a href=\"javascript:Tecnico.confirmar("
            + codigo
            + ")\"><i class='fas fa-trash'></i></a>";

            //console.log(row);
            return detalhes+alterar+excluir;
        }, 
        "defaultContent": "",
        },

        { "data": "codigo_tecnico" , name: "codigo_tecnico", "width": "60px" },
        { "data": "nome" },

        ],
        select: true,
        'language': {
        'url': '../../javascript/Portuguese-Brasil.json'
        }

        });
    }

    static detalhe(codigo)
    {
        var xhr = Util.createXHR();
        xhr.open("GET","http://127.0.0.1/laravel-api/public/api/v1/tecnicos/"+codigo,true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            //Verificar pelo estado "4" de pronto.

            if (xhr.readyState == '4' && xhr.status == '200') {
                //Pegar dados da resposta json
                var data = JSON.parse(xhr.responseText);
                document.getElementById("codigo").value = data.codigo_tecnico;
                document.getElementById("txtNome").value = data.nome;

                var data_nascimento = data.data_nascimento.split("-");
                data_nascimento = data_nascimento[2]+"/"+data_nascimento[1]+"/"+data_nascimento[0]

                document.getElementById("txtDataNascimento").value = data_nascimento;
            }
        }

        var jwtoken = '';
        jwtoken = Util.getCookie('token');

        xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xhr.send();
    }

    static formToJSON(form) 
    {
        var codigo  = '';
        var txtNome = '';
        var dataNascimento  = '';

        if (form.codigo != undefined) {
            codigo = form.codigo.value;
        }

        if (form.txtNome != undefined) {
            txtNome = form.txtNome.value;
        }

        if (form.txtDataNascimento != undefined) {
            dataNascimento = form.txtDataNascimento.value;
            dataNascimento = dataNascimento.split("/");
            dataNascimento = dataNascimento[2]+'-'+dataNascimento[1]+'-'+dataNascimento[0];
        }

        return JSON.stringify({
            "codigo_tecnico": codigo,
            "nome": txtNome,
            "data_nascimento": dataNascimento
        });
    }

    static callbackCadAltDel(xhr, op)
    {
        var msg = "";

        if (op === 'cad') {
            msg = "Técnico cadastrado com sucesso.";
        } else if (op === 'alt') {
            msg = "Técnico alterado com sucesso.";
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

                if (json.json.validate_error.nome !== undefined) {
                    strErrosValidate += json.validate_error.nome[0];
                }

                if (json.json.validate_error.data_nascimento !== undefined) {
                    strErrosValidate += json.validate_error.data_nascimento[0];
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
        var ok = window.confirm("Você tem certeza que deseja excluir este técnico?");

        if (ok && xhr != undefined) {		
            var mensagem = "";

            if (codigo == "") {
                mensagem += "Código invalido";
            }
            
            if(mensagem == "") {
                xhr.open("DELETE","http://127.0.0.1/laravel-api/public/api/v1/tecnicos/"+codigo, true);
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
        if (Tecnico.valida() == false) {
            return false;
        }
        
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";
        var mensagem = "";

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu a técnico.</b>";
        }
        
        var xhr = Util.createXHR();

        if (mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://127.0.0.1/laravel-api/public/api/v1/tecnicos", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Tecnico.callbackCadAltDel(xhr, 'cad');
                location.reload();
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Tecnico.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }

    static atualizar(form) 
    {
        document.getElementById("mensagem").innerHTML = "<br /><b>Aguarde...</b>";  
        
        var codigo = form.codigo.value;
        var mensagem = "";

        if (codigo == "") {
            mensagem += "Código invalido";
        }

        if (form.txtNome.value == "") {
            mensagem += "<br /><b>Você não preencheu a técnico</b>";
        }

        var xhr = Util.createXHR();
        
        if(mensagem == "" && xhr != undefined) {
            xhr.open("PUT","http://127.0.0.1/laravel-api/public/api/v1/tecnicos/"+codigo,true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                Tecnico.callbackCadAltDel(xhr, 'alt');
            }

            var jwtoken = '';
            jwtoken = Util.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Tecnico.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }

    static adicionadatepicker() 
    {
        jQuery("#txtDataNascimento").datepicker({
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
            dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
            dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
            monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
            nextText: 'Próximo',
            prevText: 'Anterior'
        });
    }
}