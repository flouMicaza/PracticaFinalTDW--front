function validacion() {
  //trae todos los datos
  var datos = JSON.parse(window.localStorage.getItem("datos"));
  //trae el user y contraseña
  var nombre = document.getElementById("user").value;
  var contrasena = document.getElementById("contrasena").value;

  var usuario = getUsuario(datos, nombre, contrasena);

  if (usuario == null) {
    nombre.value = "";
    contrasena.value = "";
    var mi_div = document.createElement("div");
    var mi_small = document.createElement("small");
    var mensaje = document.createTextNode("Credenciales incorrectas");
    mi_small.appendChild(mensaje);
    mi_div.appendChild(mi_small);
    var form = document.getElementById("login");
    form.insertBefore(mi_div, form.childNodes[5]);
  } else {
    window.localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
    var login = document.getElementById("login");
    login.action = "./inicio.html";
  }

  return usuario != null;
}

function getUsuario(datos, nombre, contrasena) {
  for (let usuario of datos.usuarios) {
    if (usuario.nombre == nombre && usuario.contrasena == contrasena) {
      return usuario;
    }
  }
  return null;
}
