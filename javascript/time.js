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
            + "\"><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>";

            alterar = "<span>  </span><a href=\"../formularios/alterar.time.htm?codigo="
            + codigo
            + "\"><span class='glyphicon glyphicon-edit' aria-hidden='true'></span></a>";

            

            excluir = "<span>  </span><a href=\"javascript:Time.confirmar("
            + codigo
            + ")\"><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></a>";

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