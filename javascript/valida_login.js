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

    static valida()
    {
        var strErro = ""; 
        var usuario = document.getElementById("txtTorcedor").value;
        var senha   = document.getElementById("txtSenha").value;

        if (usuario === "") {
            strErro = strErro + "\nVoce Nao Preencheu o Login";
        }

        if (senha === "") {
            strErro = strErro + "\nVoce Nao Preencheu a Senha";
        }

        if(strErro !== "") {
            alert(strErro);
            return false;
        }
    }
}
