function inicioLogin() {
  $("#botonLogin").click(function() {
    var nombre = $("#user").val();
    var contrasena = $("#contrasena").val();
    console.log("holaaa", nombre, " ", contrasena);
    $.ajax({
      url: "http://localhost:8000/api/v1/login",
      type: "POST",
      data: {
        _username: nombre,
        _password: contrasena
      },
      success: function(data, textStatus) {
        alert("success", data);
        location.href = "inicio.html";
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("fail " + textStatus, +"gola");
      }
    });
  });
}

function prueba() {
  console.log(httpRequest.status, "golaaa");
  var mi_div = document.createElement("div");
  var mi_small = document.createElement("small");
  var mensaje = document.createTextNode("Credenciales incorrectas");
  mi_small.appendChild(mensaje);
  mi_div.appendChild(mi_small);
  var form = document.getElementById("login");
  alert(httpRequest.status, "respuesta");
  form.insertBefore(mi_div, form.childNodes[5]);
  if (httpRequest.status == 200) {
    alert(httpRequest, "respuesta");
  } else {
    alert("holaa");
  }
}

function validacion() {
  //trae todos los datos
  //var datos = JSON.parse(window.localStorage.getItem("datos"));
  //trae el user y contraseña
  var nombre = document.getElementById("user").value;
  var contrasena = document.getElementById("contrasena").value;
  console.log(nombre + contrasena);
  datos = { _username: nombre, _password: contrasena };
  httpRequest = new XMLHttpRequest(); //para hacer ajax
  httpRequest.open("POST", "http://localhost:8000/api/v1/login", true);
  httpRequest.responseType = "json";
  httpRequest.onload = prueba; //cuando se carguen los datos llama a esta funcion.
  httpRequest.send("_username=admin&_password=admin");
  // var usuario = getUsuario(datos, nombre, contrasena);

  // if (usuario == null) {
  //   nombre.value = "";
  //   contrasena.value = "";
  var mi_div = document.createElement("div");
  var mi_small = document.createElement("small");
  var mensaje = document.createTextNode("Credenciales incorrectas");
  mi_small.appendChild(mensaje);
  mi_div.appendChild(mi_small);
  var form = document.getElementById("login");

  form.insertBefore(mi_div, form.childNodes[5]);
  // } else {
  //   window.localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
  var login = document.getElementById("login");
  login.action = "./login.html";
  // }

  // return usuario != null;
}

function getUsuario(datos, nombre, contrasena) {
  for (let usuario of datos.usuarios) {
    if (usuario.nombre == nombre && usuario.contrasena == contrasena) {
      return usuario;
    }
  }
  return null;
}
