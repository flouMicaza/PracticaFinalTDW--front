function cargar_cuestiones() {
  var datos = JSON.parse(window.localStorage.getItem("datos"));
  var usuario = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
  var cuestiones = datos.cuestiones;
  var main_cuestiones = document.getElementById("cuestiones");

  //crear la lista de cuestiones
  for (let cuestion of cuestiones) {
    var nueva_cuestion = crear_cuestion(cuestion, usuario.tipo);
    main_cuestiones.appendChild(nueva_cuestion);
  }

  //si es alumno elimino del dom el elemento para agregar cuestiones
  if (usuario.tipo == "aprendiz") {
    var container = document.getElementById("container");
    var div_agregar_cuestion = document.getElementById("agregar_cuestion");
    container.removeChild(div_agregar_cuestion);
  }
}

function crear_link_cuestion(cuestion, tipo) {
  var link;
  if (tipo == "maestro") {
    link = "pagina_cuestion_profesor.html";
  } else {
    link = "pagina_cuestion_alumno.html";
  }
  var link_cuestion = document.createElement("a");
  link_cuestion.id = "link_clave" + cuestion.clave;
  link_cuestion.href = link;
  var mensaje = document.createTextNode(cuestion.enunciado);
  link_cuestion.appendChild(mensaje);
  link_cuestion.onclick = () => {
    window.localStorage.setItem("cuestion_actual", JSON.stringify(cuestion));
  };

  return link_cuestion;
}

function crear_boton_eliminar(cuestion) {
  var span_eliminar = document.createElement("span");
  span_eliminar.className = "delete-btn";
  var boton_eliminar = document.createElement("a");
  boton_eliminar.id = "eliminar_" + cuestion.clave;
  boton_eliminar.href = "inicio.html";
  boton_eliminar.className = "btn btn-danger";
  boton_eliminar.onclick = eliminar_cuestion;
  var mensaje_boton = document.createTextNode("Eliminar");
  boton_eliminar.appendChild(mensaje_boton);
  span_eliminar.appendChild(boton_eliminar);

  return span_eliminar;
}

function crear_cuestion(cuestion, tipo) {
  var card_div = document.createElement("div");
  card_div.className = "card";

  var card_body = document.createElement("div");
  card_body.className = "card-body";

  let link_cuestion = crear_link_cuestion(cuestion, tipo);
  card_body.appendChild(link_cuestion);

  //esto es solo si es un maestro.
  if (tipo == "maestro") {
    var span_eliminar = crear_boton_eliminar(cuestion);
    card_body.appendChild(span_eliminar);
  }

  card_div.appendChild(card_body);

  return card_div;
}

//eliminar_cuestion: funcion que eliminar una cuestion completa del localStorage.
//Se edita el json y se vuelve a setear.
function eliminar_cuestion() {
  var datos = JSON.parse(window.localStorage.getItem("datos"));
  var id_cuestion = this.id.split("_")[1];
  var nuevas_cuestiones = encontrar_cuestion(datos.cuestiones, id_cuestion);

  datos.cuestiones = nuevas_cuestiones;
  window.localStorage.setItem("datos", JSON.stringify(datos));
}

function encontrar_cuestion(cuestiones, id) {
  var nuevas_cuestiones = [];
  for (let cuestion of cuestiones) {
    if (cuestion.clave != id) {
      nuevas_cuestiones.push(cuestion);
    }
  }
  return nuevas_cuestiones;
}

function agregar_cuestion() {
  var datos = JSON.parse(window.localStorage.getItem("datos"));
  var nombre = document.getElementById("id_nueva_cuestion");
  var cuestiones = datos.cuestiones;

  var ultima_cuestion = cuestiones[cuestiones.length - 1];

  var nueva_clave = "c" + (parseInt(ultima_cuestion.clave[1]) + 1);
  var nueva_cuestion = {
    clave: nueva_clave,
    disponible: false,
    enunciado: nombre.value,
    soluciones: []
  };

  cuestiones.push(nueva_cuestion);
  datos.cuestiones = cuestiones;
  window.localStorage.setItem("datos", JSON.stringify(datos));
  window.localStorage.setItem(
    "cuestion_actual",
    JSON.stringify(nueva_cuestion)
  );
  return true;
}
