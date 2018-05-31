"use strict";

class Util
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
}
