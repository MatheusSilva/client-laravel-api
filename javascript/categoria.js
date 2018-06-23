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
