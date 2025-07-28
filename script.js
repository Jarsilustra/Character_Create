// Puntos totales disponibles
const puntosTotales = 20;

// Configuración de razas
const razas = {
  Humano: { fuerza: 5, magia: 5, velocidad: 5, defensa: 5, resistencia: 5, destreza: 5 },
  Elfo: { fuerza: 3, magia: 7, velocidad: 6, defensa: 4, resistencia: 5, destreza: 7 },
  Enano: { fuerza: 7, magia: 3, velocidad: 4, defensa: 8, resistencia: 6, destreza: 4 },
  Orco: { fuerza: 8, magia: 2, velocidad: 4, defensa: 7, resistencia: 6, destreza: 3 },
  Dragónido: { fuerza: 7, magia: 6, velocidad: 5, defensa: 7, resistencia: 8, destreza: 5 },
  Hada: { fuerza: 2, magia: 8, velocidad: 8, defensa: 3, resistencia: 4, destreza: 8 },
};

// Configuración de clases
const clases = {
  Guerrero: { fuerza: 3, magia: 0, velocidad: 1, defensa: 2, resistencia: 2, destreza: 1 },
  Mago: { fuerza: 0, magia: 4, velocidad: 1, defensa: 1, resistencia: 1, destreza: 2 },
  Pícaro: { fuerza: 1, magia: 1, velocidad: 3, defensa: 1, resistencia: 2, destreza: 3 },
  Paladín: { fuerza: 2, magia: 2, velocidad: 1, defensa: 3, resistencia: 3, destreza: 1 },
  Arquero: { fuerza: 2, magia: 1, velocidad: 3, defensa: 1, resistencia: 2, destreza: 3 },
  Nigromante: { fuerza: 0, magia: 5, velocidad: 1, defensa: 1, resistencia: 2, destreza: 2 },
};

// Atributos base
const atributosBase = ["fuerza", "magia", "velocidad", "defensa", "resistencia", "destreza"];

// Elementos del DOM
const razaSelect = document.getElementById("raza");
const claseSelect = document.getElementById("clase");
const atributosDiv = document.getElementById("atributos");
const puntosRestantesEl = document.getElementById("puntosRestantes");
const cardRaza = document.getElementById("card-raza");
const cardClase = document.getElementById("card-clase");
const cardStats = document.getElementById("card-stats");

// Campos para nombre y descripción
const nombreInput = document.getElementById("nombre");
const fisicoInput = document.getElementById("fisico");
const personalidadInput = document.getElementById("personalidad");
const historiaInput = document.getElementById("historia");

// Vista previa
const cardName = document.getElementById("card-name");
const cardFisico = document.getElementById("card-fisico");
const cardPersonalidad = document.getElementById("card-personalidad");
const cardHistoria = document.getElementById("card-historia");

// Estado
let puntosRestantes = puntosTotales;
let valoresActuales = {};

// Función: calcula valores base según raza y clase
function calcularBase() {
  const raza = razaSelect.value;
  const clase = claseSelect.value;

  valoresActuales = {};
  atributosBase.forEach((attr) => {
    valoresActuales[attr] = (razas[raza][attr] || 0) + (clases[clase][attr] || 0);
  });

  puntosRestantes = puntosTotales;
  renderAtributos();
  actualizarPreview();
}

// Renderiza atributos dinámicos
function renderAtributos() {
  atributosDiv.innerHTML = "";

  atributosBase.forEach((attr) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <span>${attr.charAt(0).toUpperCase() + attr.slice(1)}:</span>
      <input type="number" id="${attr}" min="${valoresActuales[attr]}" value="${valoresActuales[attr]}" data-attr="${attr}">
    `;
    atributosDiv.appendChild(wrapper);
  });

  puntosRestantesEl.textContent = puntosRestantes;

  document.querySelectorAll("input[type='number']").forEach((input) => {
    input.addEventListener("change", manejarCambio);
  });
}

// Maneja cambios en los atributos
function manejarCambio(e) {
  const attr = e.target.dataset.attr;
  const nuevoValor = parseInt(e.target.value);

  let totalGastado = 0;
  document.querySelectorAll("input[type='number']").forEach((input) => {
    const base =
      (razas[razaSelect.value][input.dataset.attr] || 0) +
      (clases[claseSelect.value][input.dataset.attr] || 0);
    totalGastado += parseInt(input.value) - base;
  });

  if (totalGastado > puntosTotales) {
    e.target.value = nuevoValor - (totalGastado - puntosTotales);
    totalGastado = puntosTotales;
  }

  puntosRestantes = puntosTotales - totalGastado;
  puntosRestantesEl.textContent = puntosRestantes;
  actualizarPreview();
}

// Actualiza vista previa
function actualizarPreview() {
  cardRaza.textContent = `Raza: ${razaSelect.value}`;
  cardClase.textContent = `Clase: ${claseSelect.value}`;
  cardStats.innerHTML = "";

  document.querySelectorAll("input[type='number']").forEach((input) => {
    const li = document.createElement("li");
    li.textContent = `${input.dataset.attr}: ${input.value}`;
    cardStats.appendChild(li);
  });
}

// Eventos para descripciones
nombreInput.addEventListener("input", () => {
  cardName.textContent = nombreInput.value || "Personaje";
});
fisicoInput.addEventListener("input", () => {
  cardFisico.textContent = fisicoInput.value || "";
});
personalidadInput.addEventListener("input", () => {
  cardPersonalidad.textContent = personalidadInput.value || "";
});
historiaInput.addEventListener("input", () => {
  cardHistoria.textContent = historiaInput.value || "";
});

// Eventos para raza y clase
razaSelect.addEventListener("change", calcularBase);
claseSelect.addEventListener("change", calcularBase);

// Guardar datos en Google Sheets
document.getElementById("guardar").addEventListener("click", () => {
  if (!nombreInput.value || !fisicoInput.value || !personalidadInput.value || !historiaInput.value) {
    alert("Por favor completa todos los campos antes de guardar.");
    return;
  }

  const data = {
    nombre: nombreInput.value,
    raza: razaSelect.value,
    clase: claseSelect.value,
    fisico: fisicoInput.value,
    personalidad: personalidadInput.value,
    historia: historiaInput.value,
    atributos: {
      fuerza: document.getElementById("fuerza").value,
      magia: document.getElementById("magia").value,
      velocidad: document.getElementById("velocidad").value,
      defensa: document.getElementById("defensa").value,
      resistencia: document.getElementById("resistencia").value,
      destreza: document.getElementById("destreza").value,
    }
  };

  fetch("TU_URL_DE_GOOGLE_SCRIPT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(res => res.text())
    .then(response => {
      if (response === "OK") {
        alert("¡Datos guardados correctamente en Google Sheets!");
      } else {
        alert("Hubo un problema: " + response);
      }
    })
    .catch(err => alert("Error al enviar los datos: " + err));
});

// Botón Borrar - reinicia todo
document.getElementById("borrar").addEventListener("click", () => {
  if (confirm("¿Seguro que quieres borrar todos los datos?")) {
    // Resetear campos de texto
    nombreInput.value = "";
    fisicoInput.value = "";
    personalidadInput.value = "";
    historiaInput.value = "";

    // Resetear selects
    razaSelect.value = "Humano";
    claseSelect.value = "Guerrero";

    // Recalcular atributos base
    calcularBase();

    // Resetear vista previa
    cardName.textContent = "Personaje";
    cardFisico.textContent = "";
    cardPersonalidad.textContent = "";
    cardHistoria.textContent = "";

    alert("Formulario reiniciado.");
  }
});

// Inicializar
calcularBase();
