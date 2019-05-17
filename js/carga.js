function cargar() {
  var datos = {
    usuarios: [
      { clave: 1, nombre: "m", contrasena: "m", tipo: "maestro" },
      { clave: 2, nombre: "a", contrasena: "a", tipo: "aprendiz" },
      { clave: 3, nombre: "b", contrasena: "b", tipo: "aprendiz" },
      { clave: 4, nombre: "c", contrasena: "c", tipo: "aprendiz" }
    ],
    cuestiones: [
      {
        clave: "c1",
        disponible: true,
        enunciado: "¿Que es el software?",
        soluciones: [
          {
            clave: "s1",
            descripcion:
              "El software es la parte lógica de un sistema informático, o sea sin contemplar el hardware.",
            correcta: false
          },
          {
            clave: "s2",
            descripcion:
              "El software es la información que el desarrollador se suministra al hardware para posteriormente manipular la información del usuario",
            correcta: true
          },
          {
            clave: "s3",
            descripcion: "El software es el conjunto de los programas",
            correcta: false
          }
        ],

        respuestas_sol: {
          a: [{ clave_solucion: "s1", respuesta: false }],
          b: [],
          c: []
        }
      },
      {
        clave: "c2",
        disponible: false,
        enunciado: "¿Qué es la recursividad?",
        soluciones: [
          { clave: "s1", descripcion: "es comida", correcta: false },
          {
            clave: "s2",
            descripcion: "es todos los programas",
            correcta: true
          }
        ],
        respuestas_sol: {
          a: [],
          b: [],
          c: []
        }
      }
    ],
    propuestas_sol: {
      a: [
        {
          clave_aprendiz: "a",
          clave_cuestion_asociada: "c1",
          propuesta: "solucion_alumno",
          correcta: null,
          error: ""
        }
      ],
      b: [],
      c: []
    }
  };

  window.localStorage.setItem("datos", JSON.stringify(datos));
  var x = JSON.parse(window.localStorage.getItem("datos"));

  alert(JSON.stringify(getUsuario(x, "m", "m")));
}

function getUsuario(datos, nombre, contrasena) {
  for (let usuario of datos.usuarios) {
    if (usuario.nombre == nombre && usuario.contrasena == contrasena) {
      return usuario;
    }
  }
  return null;
}
