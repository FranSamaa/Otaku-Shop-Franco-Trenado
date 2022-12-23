function Login(){ 
    
    const usuario=document.login.usuario.value; 
    const password=document.login.password.value; 

    if (usuario=="" || password=="") {
        alert("Por favor ingrese su usuario y contraseña"); 
        return false;
    }
    localStorage.setItem("user",JSON.stringify({usuario,password}))

    window.location.href = "./index.html"; 
}




    