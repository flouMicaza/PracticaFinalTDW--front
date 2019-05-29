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
  cargar_solucion();
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
    estado = "Mal!" + propuesta.error;
  }
  div_boton_enviar.innerHTML = "<small id='label_respuesta_maestro' class='text-info'>"+estado+"</small>";
  
}

//funcion para carga una nueva solucion suponiendo que las anteriores ya se muestran.
function cargar_solucion() {
  var aprendiz = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );

 //Lista de respuestaSolucion: {blabla}
$.ajax({
  url: "/api/v1/respuestasolucion/" + aprendiz.user_id,
  type: "GET",
  // Fetch the stored token from localStorage and set in the header
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  //si ya creo una solucion entonces la entrego 
  success: function(respondidas, textStatus) {
    $.ajax({
      url: "/api/v1/solutions/" + cuestion_actual.idCuestion,
      type: "GET",
      // Fetch the stored token from localStorage and set in the header
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      success: function(soluciones, textStatus) {
        seleccionarSolucion(soluciones,respondidas);
        //crear_html_solucion(soluciones,respondidas)
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        if(errorThrown!="Not Found"){

          alert("hubo un error importando soluciones");
        }
      },
      dataType: "json"
    });
    
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
    if (errorThrown == "Not Found") {
      //busco las soluciones
      $.ajax({
        url: "/api/v1/solutions/" + cuestion_actual.idCuestion,
        type: "GET",
        // Fetch the stored token from localStorage and set in the header
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        success: function(soluciones, textStatus) {
          console.log(soluciones.soluciones[0],"soluciones");
          crear_html_solucion(soluciones.soluciones[0]);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert("hubo un error importando soluciones");
        },
        dataType: "json"
      });
    }
  },
  dataType: "json"
});

}
/**
 * Método que crea los elementos de las soluciones que ya han sido respondidas. 
 * @param  soluciones 
 * @param  responiddias 
 */
function mostrar_respuestas(soluciones,respondidas){
  for (let respondida of respondidas.respuestaSolucion) {
    respondida = respondida.respuestaSolucion;
    //soluciones que ya fueron respondidas. 
    var solucion = soluciones.filter(sol=>
      sol.soluciones.idSoluciones==respondida.solucionesIdsoluciones
    );
    if(solucion.length!=0) crear_html_solucion_respondida(solucion[0].soluciones,respondida.respuesta);
  }
}
/**
 * Método para mostrar soluciones ya respondidas y mostrar una nueva solución para responder.
 * @param soluciones 
 * @param respondidas 
 */
function seleccionarSolucion(soluciones,respondidas){
  soluciones = soluciones.soluciones;
  
  // mostrar una nueva solucion que no ha sido repsondida, 
  //en la funcion del boton de corregir se tiene que revisar y denuevo cargar las solucinoes que han sido responiddias. 
  mostrar_respuestas(soluciones,respondidas);
  mostrar_solucion_nueva(soluciones,respondidas.respuestaSolucion);


}
/**
 * Método que busca una solucion que no haya sido respondida. 
 */
function mostrar_solucion_nueva(soluciones,respondidas){
  
  for(let solucion of soluciones ){
    var id = solucion.soluciones.idSoluciones;
    var sol = respondidas.find(function(elemento){
      return elemento.respuestaSolucion.solucionesIdsoluciones == id;
    });
    if(sol==undefined){
      crear_html_solucion(solucion);
      return;
    }
  }
}
/**
 * Método que crea los elementos para una solucion que ya fue respondida.  
 * @param  solucion 
 * @param respondida 
 */
function crear_html_solucion_respondida(solucion,respondida_respuesta){
  var main_soluciones = document.getElementById("soluciones_main");

  var form_solucion = document.createElement("form");
  var div_row_form = document.createElement("div");
  div_row_form.className = "form-row";
  div_row_form.id = "form_row" + solucion.idSoluciones;

  var div_col_label = document.createElement("div");
  div_col_label.className = "col-auto";

  var label_sol = document.createElement("label");
  var texto_respuesta = document.createTextNode("Solución: ");
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
  input_checkbox.checked = respondida_respuesta;
  input_checkbox.disabled = true;
  div_col_check.appendChild(input_checkbox);


  div_row_form.appendChild(div_col_check);
  var div_col_button = document.createElement("div");
  div_col_button.className = "col-auto";
  var correccion = document.createElement("small");
  correccion.className = "text-info";
  correccion.id = "label_correccion";
  texto_respuesta = respondida_respuesta==solucion.correcta
  ? document.createTextNode("Bien!")
  : document.createTextNode("Mal!");
  correccion.appendChild(texto_respuesta);


  div_col_button.appendChild(correccion);
  div_row_form.appendChild(div_col_button);
  form_solucion.appendChild(div_row_form);
  main_soluciones.appendChild(form_solucion);
}

/**
 * Método que crea los elementos para una solución a responder.
 * @param  solucion 
 * @param  respondidas 
 */
function crear_html_solucion(solucion) {
  solucion = solucion.soluciones;

  console.log("sssssoolcuion", solucion);
  var main_soluciones = document.getElementById("soluciones_main");

  var form_solucion = document.createElement("form");
  var div_row_form = document.createElement("div");
  div_row_form.className = "form-row";
  div_row_form.id = "form_row" + solucion.idSoluciones;

  var div_col_label = document.createElement("div");
  div_col_label.className = "col-auto";

  var label_sol = document.createElement("label");
  var texto_respuesta = document.createTextNode("Solución: ");
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
  button_corregir.value = "Corregir";
  button_corregir.id = "solucion_" + solucion.idSoluciones;

  div_col_button.appendChild(button_corregir);
  div_row_form.appendChild(div_col_button);
  form_solucion.appendChild(div_row_form);
  main_soluciones.appendChild(form_solucion);
  $("#solucion_" + solucion.idSoluciones).click(function(){
    corregir_solucion(solucion);
  });
}

/**
 * Método que crea el elemento small que indica si una respuesta es correcta o no.
 *  
 */
function corregir_solucion(solucion) {
  var sol_id = solucion.idSoluciones;
  var aprendiz = JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
 
  var checkbox_val = document.getElementById("input_correcta_" + sol_id)
    .checked;
    var data = {
      respuesta : checkbox_val ? 1 : 0,
      solucionesIdsoluciones : sol_id,
      usuariosId : aprendiz.user_id
    };
    $.ajax({
      url: "/api/v1/respuestasolucion",
      type: "POST",
      // Fetch the stored token from localStorage and set in the header
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      data: data,
      success: function(data, textStatus) {
        //crear_html_solucion_respondida(solucion,checkbox_val);
        location.href = "pagina_cuestion_alumno.html";
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("Fail!", errorThrown);
      },
      dataType: "json"
    });

}
