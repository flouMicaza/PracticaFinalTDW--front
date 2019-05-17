function cargar_cuestion() {
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );
  var aprendiz = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));

  var div_enunciado = document.getElementById("header_enunciado");
  var boton_cerrar = document.getElementById("cerrar_cuestion");
  var nombre_cuestion = document.createElement("h3");
  var texto = document.createTextNode(cuestion_actual.enunciado);
  nombre_cuestion.appendChild(texto);
  div_enunciado.insertBefore(nombre_cuestion, boton_cerrar);
  if (get_propuesta(aprendiz, cuestion_actual) != null) {
    preparar_soluciones();
  }
}

function enviar_propuesta() {
  var solucion_alumno = document.getElementById("propuesta_de_solucion").value;
  var datos = JSON.parse(window.localStorage.getItem("datos"));
  var aprendiz = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );
  datos.propuestas_sol[aprendiz.nombre].push({
    clave_aprendiz: aprendiz.clave,
    clave_cuestion_asociada: cuestion_actual.clave,
    propuesta: solucion_alumno,
    correcta: null,
    error: ""
  });
  window.localStorage.setItem("datos", JSON.stringify(datos));
  preparar_soluciones();
}

//cambiar el input por la propuesta
//cambiar el boton por pendiente
//llamar a agregar solucion
function preparar_soluciones() {
  crear_label_propuesta();
  crear_label_espera_correccion();
  cargar_solucion();
}

function get_propuesta(aprendiz, cuestion) {
  var datos = JSON.parse(window.localStorage.getItem("datos"));
  var propuestas = datos.propuestas_sol;
  var propuestas_aprendiz = propuestas[aprendiz.nombre];
  for (let propuesta of propuestas_aprendiz) {
    if (propuesta.clave_cuestion_asociada == cuestion.clave) {
      return propuesta.propuesta;
    }
  }
  return null;
}

function crear_label_propuesta() {
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );
  var aprendiz = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
  var propuesta_de_solucion = get_propuesta(aprendiz, cuestion_actual);
  var div_texarea_propuesta = document.getElementById("text_propuesta");
  div_texarea_propuesta.removeChild(
    document.getElementById("propuesta_de_solucion")
  );
  var label_propuesta = document.createElement("p");
  label_propuesta.id = "label_propuesta";
  var texto = document.createTextNode(propuesta_de_solucion);
  label_propuesta.appendChild(texto);
  div_texarea_propuesta.appendChild(label_propuesta);
}

function crear_label_espera_correccion() {
  var div_boton_enviar = document.getElementById("div_boton_enviar");
  div_boton_enviar.removeChild(document.getElementById("boton_enviar"));

  var respuesta_maestro = document.createElement("small");
  respuesta_maestro.className = "text-info";
  respuesta_maestro.id = "label_respuesta_maestro";
  var texto_respuesta = document.createTextNode("Pendiente de Corrección");
  respuesta_maestro.appendChild(texto_respuesta);
  div_boton_enviar.appendChild(respuesta_maestro);
}

//funcion para carga una nueva solucion suponiendo que las anteriores ya se muestran.
function cargar_solucion() {
  var aprendiz = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );

  var nombre_aprendiz = aprendiz.nombre;
  var soluciones_aprendiz = cuestion_actual.respuestas_sol[nombre_aprendiz];
  if (soluciones_aprendiz.length == 0) {
    var solucion_a_mostrar = cuestion_actual.soluciones[0];
  } else {
    var ultima_sol_respondida =
      soluciones_aprendiz[soluciones_aprendiz.length - 1];

    var solucion_a_mostrar = siguiente_solucion(
      ultima_sol_respondida,
      cuestion_actual.soluciones
    );
  }
  crear_html_solucion(solucion_a_mostrar);
}

function siguiente_solucion(ultima_sol_respondida, soluciones) {
  let index = 0;
  var proximo_indice = 0;
  for (let solucion of soluciones) {
    if (solucion.clave == ultima_sol_respondida.clave_solucion) {
      proximo_indice = index + 1;
      break;
    }
    index++;
  }
  return soluciones[proximo_indice];
}

function crear_html_solucion(solucion) {
  var main_soluciones = document.getElementById("soluciones_main");

  var form_solucion = document.createElement("form");
  var div_row_form = document.createElement("div");
  div_row_form.className = "form-row";
  div_row_form.id = "form_row" + solucion.clave;

  var div_col_label = document.createElement("div");
  div_col_label.className = "col-auto";

  var label_sol = document.createElement("label");
  var texto_respuesta = document.createTextNode("Solución");
  label_sol.appendChild(texto_respuesta);

  div_col_label.appendChild(label_sol);
  div_row_form.appendChild(div_col_label);

  var div_col_p = document.createElement("div");
  div_col_p.className = "col-7";
  var p_sol = document.createElement("p");
  var texto_solucion = document.createTextNode(solucion.descripcion);
  p_sol.appendChild(texto_solucion);
  div_col_p.appendChild(p_sol);
  div_row_form.appendChild(div_col_p);

  var div_col_check = document.createElement("div");
  div_col_check.className = "col-auto";
  var texto_correcto = document.createTextNode("Correcta:");
  div_col_check.appendChild(texto_correcto);
  var input_checkbox = document.createElement("input");
  input_checkbox.type = "checkbox";
  input_checkbox.id = "input_correcta_" + solucion.clave;
  div_col_check.appendChild(input_checkbox);

  div_row_form.appendChild(div_col_check);
  var div_col_button = document.createElement("div");
  div_col_button.className = "col-auto";
  var button_corregir = document.createElement("input");
  button_corregir.type = "button";
  button_corregir.className = "btn btn-primary btn-sm";
  button_corregir.onclick = corregir_solucion;
  button_corregir.value = "Corregir";
  button_corregir.id = "solucion_" + solucion.clave;

  div_col_button.appendChild(button_corregir);
  div_row_form.appendChild(div_col_button);
  form_solucion.appendChild(div_row_form);
  main_soluciones.appendChild(form_solucion);
}

function corregir_solucion() {
  var sol_id = this.id[9] + this.id[10];
  var checkbox_val = document.getElementById("input_correcta_" + sol_id)
    .checked;
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );

  var soluciones = cuestion_actual.soluciones;
  var respuesta_correcta = "";
  for (let solucion of soluciones) {
    if (solucion.clave == sol_id) {
      if (solucion.correcta == checkbox_val) {
        respuesta_correcta = true;
      } else {
        respuesta_correcta = false;
      }
      break;
    }
  }
  var respuesta_solucion = document.createElement("small");
  respuesta_solucion.className = "text-info";
  respuesta_solucion.id = "label_respuesta_solucion";
  var texto_respuesta = respuesta_correcta
    ? document.createTextNode("Bien!")
    : document.createTextNode("Mal!");
  respuesta_solucion.appendChild(texto_respuesta);

  var div_sol = document.getElementById("form_row" + sol_id);
  div_sol.appendChild(respuesta_solucion);
}
