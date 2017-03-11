function valida(form)
{
	var filepatch = "<img src='http://localhost/time/sistema/img/erro.png'>";
	var erro_nome="<p style='color:#ff0000'> "+filepatch+" Preencha o campo Nome</p>"
	var erro_login="<p style='color:#ff0000'> "+filepatch+" Preencha o campo Login</p>"
	var erro_senha="<p style='color:#ff0000'> "+filepatch+" Preencha o campo Senha</p>"
	var erro_senha_min="<p style='color:#ff0000'> "+filepatch+" o campo Senha deve ter no minimo 6 digitos</p>"
	var erro_senha_conf="<p style='color:#ff0000'> "+filepatch+" Preencha o campo  Confirma Senha</p>"
	var erro_senha_conf_min="<p style='color:#ff0000'> "+filepatch+" o campo Confirma Senha deve ter no minimo 6 digitos</p>"
	var erro_senha_dif="<p style='color:#ff0000'> "+filepatch+" As senhas devem ser iguais</p>"
	var boolRetorno = true;

	if (form.txtNome.value == "") {
		//form.txtNome.focus();
		//form.txtNome.style.backgroundColor='#FF0000';
		document.getElementById('erro_nome').innerHTML=erro_nome;
		boolRetorno = false;
	} else {
		document.getElementById('erro_nome').innerHTML="";
	}
	
	if (form.txtLogin.value == "") {
		document.getElementById('erro_login').innerHTML=erro_login;
		boolRetorno = false;
	} else {
		document.getElementById('erro_login').innerHTML="";
	}
	
	if (form.txtSenha.value == "") {
		document.getElementById('erro_senha').innerHTML=erro_senha;
		boolRetorno = false;
	} else {
		document.getElementById('erro_senha').innerHTML="";
	}
	
	if (form.txtSenha.value.length < 6) {
		document.getElementById('erro_senha').innerHTML=erro_senha_min;
		boolRetorno = false;
	} else {
		document.getElementById('erro_senha').innerHTML="";
	}
	
	if (form.txtConfSenha.value == "") {
		document.getElementById('erro_Conf_senha').innerHTML=erro_senha_conf;
		boolRetorno = false;
	} else {
		document.getElementById('erro_Conf_senha').innerHTML="";
	}

	if (form.txtConfSenha.value.length < 6) {
		document.getElementById('erro_Conf_senha').innerHTML=erro_senha_conf_min;
		boolRetorno = false;
	} else {
		document.getElementById('erro_Conf_senha').innerHTML="";
	}
	
	if (form.txtConfSenha.value != form.txtSenha.value) {
		document.getElementById('erro_senha').innerHTML=erro_senha_dif;
		boolRetorno = false;
	} else {
		document.getElementById('erro_senha').innerHTML="";
	}

	return boolRetorno;
}
