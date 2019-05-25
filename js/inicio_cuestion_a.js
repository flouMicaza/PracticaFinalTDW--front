function cargar_cuestion() {
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );
  var aprendiz = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));

  var div_enunciado = document.getElementById("header_enunciado");
  var boton_cerrar = document.getElementById("cerrar_cuestion");
  var nombre_cuestion = document.createElement("h3");
  var texto = document.createTextNode(cuestion_actual.enunciadoDescripcion);
  nombre_cuestion.appendChild(texto);
  div_enunciado.insertBefore(nombre_cuestion, boton_cerrar);

  //cargar las soluciones de esa cuestion
  $.ajax({
    url: "/api/v1/propuestasolucion/" + aprendiz.user_id + "/" + cuestion_actual.idCuestion,
    type: "GET",
    // Fetch the stored token from localStorage and set in the header
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    //si ya creo una solucion entonces la entrego 
    success: function(data, textStatus) {
      preparar_soluciones(data.propuestaSolucion);
      
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (errorThrown != "Not Found") {
        //no encontró una respuesta, entonces no se pone nada
  
        alert("Algo pasó al importar la propuestaSolución");
      }
    },
    dataType: "json"
  });

  
}

//Hacer post para crear una propuesta se guarde
function enviar_propuesta() {
  var solucion_alumno = document.getElementById("propuesta_de_solucion").value;
 var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );
  console.log(cuestion_actual.idCuestion, "cuestion actual");
  var data = {
    descripcion: solucion_alumno,
    cuestionesIdcuestion: cuestion_actual.idCuestion
  };
  $.ajax({
    url: "/api/v1/propuestasolucion",
    type: "POST",
    // Fetch the stored token from localStorage and set in the header
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    data: data,
    success: function(data, textStatus) {
     
      preparar_soluciones(data.propuestaSolucion);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert("Fail!", errorThrown);
    },
    dataType: "json"
  });
}

//cambiar el input por la propuesta
//cambiar el boton por pendiente
//llamar a agregar solucion
function preparar_soluciones(propuesta) {
  crear_label_propuesta(propuesta);
  crear_label_espera_correccion(propuesta);
  //cargar_solucion();
}



function crear_label_propuesta(propuesta_de_solucion) {
  var div_texarea_propuesta = document.getElementById("text_propuesta");
  div_texarea_propuesta.removeChild(
    document.getElementById("propuesta_de_solucion")
  );
  var label_propuesta = document.createElement("p");
  label_propuesta.id = "label_propuesta";
  div_texarea_propuesta.className = "col-7 texto-destacado";
  var texto = document.createTextNode(propuesta_de_solucion.descripcion);
  label_propuesta.appendChild(texto);
  div_texarea_propuesta.appendChild(label_propuesta);
}

function crear_label_espera_correccion(propuesta) {
  var div_boton_enviar = document.getElementById("div_boton_enviar");
  div_boton_enviar.removeChild(document.getElementById("boton_enviar"));
  var estado;
  if(propuesta.correcta==null){
    estado = "Pendiente de corrección";
  }else if(propuesta.correcta==1){
    estado = "Bien!";
  }else{
    estado = "Mal!";
  }
  div_boton_enviar.innerHTML = "<small id='label_respuesta_maestro' class='text-info'>"+estado+"</small>";
  
}

//funcion para carga una nueva solucion suponiendo que las anteriores ya se muestran.
function cargar_solucion() {
  var aprendiz = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );

  var nombre_aprendiz = aprendiz.nombre;
  var soluciones_aprendiz = cuestion_actual.respuestas_sol[nombre_aprendiz];
  var solucion_a_mostrar;
  if (soluciones_aprendiz.length == 0) {
    solucion_a_mostrar = cuestion_actual.soluciones[0];
  } else {
    var ultima_sol_respondida =
      soluciones_aprendiz[soluciones_aprendiz.length - 1];

    solucion_a_mostrar = siguiente_solucion(
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
    if (solucion.idSoluciones == ultima_sol_respondida.clave_solucion) {
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
  div_row_form.id = "form_row" + solucion.idSoluciones;

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
  input_checkbox.id = "input_correcta_" + solucion.idSoluciones;
  div_col_check.appendChild(input_checkbox);

  div_row_form.appendChild(div_col_check);
  var div_col_button = document.createElement("div");
  div_col_button.className = "col-auto";
  var button_corregir = document.createElement("input");
  button_corregir.type = "button";
  button_corregir.className = "btn btn-primary btn-sm";
  button_corregir.onclick = corregir_solucion;
  button_corregir.value = "Corregir";
  button_corregir.id = "solucion_" + solucion.idSoluciones;

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
    if (solucion.idSoluciones == sol_id) {
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
