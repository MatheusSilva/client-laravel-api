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
         "url": 'http://192.168.33.10/laravel-api/public/api/v1/tecnicos',
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
            detalhes = "<a href=\"../consultas/detalhe.tecnico.htm?codigo="
            + codigo
            + "\"><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>";

            alterar = "<span>  </span><a href=\"../formularios/alterar.tecnico.htm?codigo="
            + codigo
            + "\"><span class='glyphicon glyphicon-edit' aria-hidden='true'></span></a>";

            

            excluir = "<span>  </span><a href=\"javascript:Tecnico.confirmar("
            + codigo
            + ")\"><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></a>";

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
        xhr.open("GET","http://192.168.33.10/laravel-api/public/api/v1/tecnicos/"+codigo,true);
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
                xhr.open("DELETE","http://192.168.33.10/laravel-api/public/api/v1/tecnicos/"+codigo, true);
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
            xhr.open("POST","http://192.168.33.10/laravel-api/public/api/v1/tecnicos", true);
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
            xhr.open("PUT","http://192.168.33.10/laravel-api/public/api/v1/tecnicos/"+codigo,true);
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
}