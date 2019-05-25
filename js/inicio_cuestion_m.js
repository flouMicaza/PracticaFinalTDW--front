//cargar_cuestion: funcion que hace que se carguen los datos de la cuestion que hemos apretado.
function cargar_cuestion() {
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );
  var div_nombre = document.getElementById("enunciado");

  div_nombre.appendChild(crear_enunciado_cuestion(cuestion_actual));

  var switch_activar = document.getElementById("activacion_cuestion");
  switch_activar.checked = cuestion_actual.enunciadoDisponible;
  switch_activar.onchange = cambio_estado;

  cargar_soluciones(cuestion_actual.idCuestion);
  cargar_propuestas(cuestion_actual.idCuestion);
}

function cargar_propuestas(idCuestion){
  //cargar las propuestas de solucion para esa cuestion
  $.ajax({
    url: "/api/v1/propuestasolucion/" + idCuestion,
    type: "GET",
    // Fetch the stored token from localStorage and set in the header
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    //si ya creo una solucion entonces la entrego 
    success: function(data, textStatus) {
      alert("preparó!!!")
      preparar_propuestas(data);
      
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (errorThrown == "Not Found") {
        //no encontró una respuesta, entonces no se pone nada
        $("#propuesta_tipo").remove();

        alert("No hay propuestas");
        
      }
    },
    dataType: "json"
  });
}
function cargar_soluciones(idCuestion) {
  $.ajax({
    url: "/api/v1/solutions/" + idCuestion,
    type: "GET",
    // Fetch the stored token from localStorage and set in the header
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    success: function(data, textStatus) {
      //TODO: lo que dice el alert

      for (let solucion of data.soluciones) {
        solucion = solucion.soluciones;

        var soluciones_main = document.getElementById("soluciones");
        var card_solucion = crear_html_solucion(solucion);
        soluciones_main.appendChild(card_solucion);
        var mi_hr = document.createElement("br");
        soluciones_main.appendChild(mi_hr);
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (errorThrown == "Not Found") {
        $("#soluciones").html(
          "<div class='card'><div class='card-body'><p class='card-text'>No hay soluciones disponibles</p></div></div><hr>"
        );
      }
    },
    dataType: "json"
  });
}
function preparar_propuestas(propuestas){
  //$("#propuestas") es el main para las propuestas
  for (let propuesta of propuestas) {
    propuesta = propuesta.propuestaSolucion;
    $("#propuestas").append($("#propuesta_tipo").clone());
    $("#propuestas").children().last().attr("id","propuesta_" + propuesta.idPropuestaSolucion);
    
    $("#propuesta_" + propuesta.idPropuestaSolucion).find("p").text(propuesta.descripcion);
    $("#propuesta_" + propuesta.idPropuestaSolucion).find("button").attr("id","boton_" + propuesta.idPropuestaSolucion)
  }
  $("#propuesta_tipo").remove();
}
function crear_html_solucion(solucion) {
  //form
  var sol_form = document.createElement("form");

  sol_form.id = "form_" + solucion.idSoluciones;

  //divs interiores
  var div_form = document.createElement("div");
  div_form.className = "form-row";

  var div_col_label = document.createElement("div");
  div_col_label.className = "col-auto";

  //label
  var label_sol = document.createElement("label");
  var texto = document.createTextNode("Solución");
  label_sol.appendChild(texto);
  div_col_label.appendChild(label_sol);

  //switch
  var switch_correcta = crear_switch(solucion);
  div_col_label.appendChild(switch_correcta);
  div_form.appendChild(div_col_label);

  //input
  var div_input = crear_input_solucion(solucion);
  div_form.appendChild(div_input);

  //botones
  var div_botones = crear_botones_solucion(solucion);
  div_form.appendChild(div_botones);

  sol_form.appendChild(div_form);

  return sol_form;
}
function crear_enunciado_cuestion(cuestion_actual) {
  var input_nombre = document.createElement("input");
  input_nombre.type = "text";
  input_nombre.className = "form-control";
  input_nombre.value = cuestion_actual.enunciadoDescripcion;
  input_nombre.required = true;
  input_nombre.id = "input_nombre";
  return input_nombre;
}
//TODO: en cambio_estado_solucion arreglar para que use ajax
function crear_switch(solucion) {
  var div_switch = document.createElement("div");
  div_switch.className = "custom_control custom-switch";

  var input_switch = document.createElement("input");
  input_switch.type = "checkbox";
  input_switch.className = "custom-control-input";
  input_switch.id = "switch_" + solucion.idSoluciones;
  input_switch.checked = solucion.correcta;
  input_switch.onchange = cambio_estado_solucion;
  div_switch.appendChild(input_switch);

  var label_switch = document.createElement("label");
  label_switch.className = "custom-control-label";
  var texto = document.createTextNode("Correcta");
  label_switch.appendChild(texto);
  label_switch.htmlFor = input_switch.id;
  div_switch.appendChild(label_switch);
  return div_switch;
}
function crear_input_solucion(solucion) {
  var div_sol = document.createElement("div");
  div_sol.className = "col-7";
  var input_sol = document.createElement("textarea");
  input_sol.className = "form-control";
  input_sol.value = solucion.descripcion;
  input_sol.required = true;
  input_sol.id = "textarea_" + solucion.idSoluciones;

  div_sol.appendChild(input_sol);
  return div_sol;
}
//metodo para hacer put del error y de si es correcta,
//eliminar la propuesta si ya está corregida
function corregir_propuesta(elemento){
  var id_propuesta = elemento.id.split("_").pop();
  var error = $("#propuesta_" + id_propuesta).find("textarea").val();
  var correcta = $("#propuesta_" + id_propuesta).find("input").is(':checked');
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );
  $.ajax({
    url: "/api/v1/propuestasolucion/" + id_propuesta,
    type: "PUT",
    data: {
      error: error,
      correcta : correcta ? 1 : 0
    },
    // Fetch the stored token from localStorage and set in the header
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    success: function(data, textStatus) {
      alert("Enviado!", textStatus);
      quitar_propuesta(data.propuestaSolucion);

    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (errorThrown == "Not Found") {
        alert("error cabio enunciado");
      }
    }
  });
  console.log(elemento.id.split("_").pop(),"thiiis");
}

function quitar_propuesta(propuesta){
  $("#propuesta_" + propuesta.idPropuestaSolucion).remove();
}
function crear_botones_solucion(solucion) {
  var div_botones = document.createElement("div");
  div_botones.className = "col-auto";

  var boton_editar = document.createElement("button");
  boton_editar.className = "btn btn-primary";
  boton_editar.type = "button";
  boton_editar.id = "boton" + solucion.idSoluciones;
  var texto = document.createTextNode("Editar solución");
  boton_editar.appendChild(texto);
  boton_editar.onclick = editar_solucion;
  div_botones.appendChild(boton_editar);

  var boton_eliminar = document.createElement("button");
  boton_eliminar.className = "btn btn-danger ";
  boton_eliminar.type = "button";
  console.log("solucion", solucion);
  boton_eliminar.id = "eliminar_" + solucion.idSoluciones;
  var texto2 = document.createTextNode("Eliminar solución");
  boton_eliminar.appendChild(texto2);
  boton_eliminar.onclick = eliminar_solucion;

  div_botones.appendChild(boton_eliminar);
  var div_small = document.createElement("div");
  div_small.innerHTML =
    '<small id="mensaje_sol_vacia' +
    solucion.idSoluciones +
    '" class="text-danger" style="display:none">Solucion no puede ser vacía</small>';
  div_botones.appendChild(div_small);
  return div_botones;
}
function agregar_solucion() {
  var nueva_sol = document.getElementById("nueva_solucion");
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );

  var descripcion = nueva_sol.value;
  if (descripcion == "") {
    $("#mensaje_sol_vacia").css("display", "");
    return;
  } else {
    var data = {
      descripcion: descripcion,
      correcta: 0,
      cuestionesIdcuestion: cuestion_actual.idCuestion
    };
    $.ajax({
      url: "/api/v1/solutions",
      type: "POST",
      // Fetch the stored token from localStorage and set in the header
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      data: data,
      success: function(data, textStatus) {
        location.href = "pagina_cuestion_profesor.html";
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("Fail!", errorThrown);
      },
      dataType: "json"
    });
  }
  return true;
}
function eliminar_solucion() {
  var id_sol = this.id[10] != undefined ? this.id[9] + this.id[10] : this.id[9];
  console.log("eliminar", this.id);
  $.ajax({
    url: "/api/v1/solutions/" + id_sol,
    type: "DELETE",
    // Fetch the stored token from localStorage and set in the header
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    success: function(data, textStatus) {
      location.href = "pagina_cuestion_profesor.html";
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert("Fail eliminacion!", errorThrown);
    },
    dataType: "json"
  });
}

//TODO: hacer esta funcion con el ajax
function editar_solucion() {
  var id_solucion =
    this.id[6] != undefined ? this.id[5] + this.id[6] : this.id[5];
  console.log("se edita", this);
  var enunciado_sol = $("#textarea_" + id_solucion).val();
  if (enunciado_sol == "") {
    console.log("gola");
    $("#mensaje_sol_vacia" + id_solucion).css("display", "");
    return;
  }

  $.ajax({
    url: "/api/v1/solutions/" + id_solucion,
    type: "PUT",
    data: {
      descripcion: enunciado_sol
    },
    // Fetch the stored token from localStorage and set in the header
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    success: function(data, textStatus) {
      alert("Cambiada!", textStatus);

      $("#alertaCambioSolucion").css("display", "flex");
      $("#alertaCambioEnunciado").css("display", "none");
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (errorThrown == "Not Found") {
        alert("error cabio enunciado");
      }
    }
  });

  return true;
}

function cambio_estado_solucion() {
  var id_solucion =
    this.id[8] != undefined ? this.id[7] + this.id[8] : this.id[7];

  console.log(id_solucion, "cambio de estado");
  var correcta = this.checked ? 1 : 0;
  $.ajax({
    url: "/api/v1/solutions/" + id_solucion,
    type: "PUT",
    data: {
      correcta: correcta
    },
    // Fetch the stored token from localStorage and set in the header
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },

    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (errorThrown == "Not Found") {
        alert("error cabio enunciado");
      }
    }
  });
}

//funcion que toma el nuevo enunciado, comprueba que se haya modificado.
//Si se modificó el enunciado, lo setea en los datos de la BD y en cuestion_actual.
function cambio_enunciado() {
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );
  console.log(cuestion_actual);
  var nuevo_enunciado = window.document.getElementById("input_nombre").value;

  $.ajax({
    url: "/api/v1/questions/" + cuestion_actual.idCuestion,
    type: "PUT",
    data: {
      enunciadoDescripcion: nuevo_enunciado
    },
    // Fetch the stored token from localStorage and set in the header
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    success: function(data, textStatus) {
      if (nuevo_enunciado !== cuestion_actual.enunciadoDescripcion) {
        alert("Cambiada!", textStatus);
        window.localStorage.setItem(
          "cuestion_actual",
          JSON.stringify(data.cuestion)
        );
        $("#alertaCambioEnunciado").css("display", "flex");

        $("#alertaCambioSolucion").css("display", "none");
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (errorThrown == "Not Found") {
        alert("error cabio enunciado");
      }
    }
  });
}

function cambio_estado() {
  var cuestion_actual = JSON.parse(
    window.localStorage.getItem("cuestion_actual")
  );

  var switch_activar = document.getElementById("activacion_cuestion");
  var disp = switch_activar.checked ? 1 : 0;
  $.ajax({
    url: "/api/v1/questions/" + cuestion_actual.idCuestion,
    type: "PUT",
    data: {
      enunciadoDisponible: disp
    },
    // Fetch the stored token from localStorage and set in the header
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    success: function(data, textStatus) {
      window.localStorage.setItem(
        "cuestion_actual",
        JSON.stringify(data.cuestion)
      );
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert("NO funciono", errorThrown);
    }
  });
}
