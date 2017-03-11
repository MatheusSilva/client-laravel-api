class Login
{
    static createCookie(nome, valor, dias) 
    {
        var expires;
        
        if (dias) {
            var date = new Date();
            date.setTime(date.getTime() + (dias * 24 * 60 * 60 * 1000));
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
        
        var xhr = Ajax.createXHR();

        if (mensagem == "" && xhr != undefined) {
            xhr.open("POST","http://localhost/laravel-api/public/api/v1/auth", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                 //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4') {
                    //Pegar dados da resposta json
                    
                    var json = JSON.parse(xhr.responseText);

                    if (xhr.status == '200') {
                        Login.createCookie('token', json.token, '1'); 
                        window.location = "http://localhost/client-laravel-api/adm/paginas/home.php";
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
            jwtoken = Login.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send(Login.formToJSON(form));
        } else {
            document.getElementById("mensagem").innerHTML = mensagem;
        } 
    }

    static logado()
    {
        var mensagem = "";
        
        var xhr = Ajax.createXHR();

        if (xhr != undefined) {
            xhr.open("GET","http://localhost/laravel-api/public/api/v1/logado", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                 //Verificar pelo estado "4" de pronto.
                if (xhr.readyState == '4' && xhr.status != '200') {
                    window.location = "http://localhost/client-laravel-api/adm/formularios/form.login.php"; 
                }
            }

            var jwtoken = '';
            jwtoken = Login.getCookie('token');

            xhr.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
            xhr.send();
        } else {
            window.location = "http://localhost/client-laravel-api/adm/formularios/form.login.php";
        }
    }

}
