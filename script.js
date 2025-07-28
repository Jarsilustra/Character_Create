// Puntos totales disponibles
const puntosTotales = 20;

// Configuración de razas y clases
const razas = {
  Humano: { fuerza: 5, magia: 5, velocidad: 5, defensa: 5, resistencia: 5, destreza: 5 },
  Elfo: { fuerza: 3, magia: 7, velocidad: 6, defensa: 4, resistencia: 5, destreza: 7 },
  Enano: { fuerza: 7, magia: 3, velocidad: 4, defensa: 8, resistencia: 6, destreza: 4 },
  Orco: { fuerza: 8, magia: 2, velocidad: 4, defensa: 7, resistencia: 6, destreza: 3 },
  Dragónido: { fuerza: 7, magia: 6, velocidad: 5, defensa: 7, resistencia: 8, destreza: 5 },
  Hada: { fuerza: 2, magia: 8, velocidad: 8, defensa: 3, resistencia: 4, destreza: 8 },
};

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

// Campos de descripción
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

// Combinar valores base
function calcularBase() {
  const raza = razaSelect.value;
  const clase = claseSelect.value;

  valoresActuales = {};
  atributosBase.forEach(attr => {
    valoresActuales[attr] = (razas[raza][attr] || 0) + (clases[clase][attr] || 0);
  });

  puntosRestantes = puntosTotales;
  renderAtributos();
  actualizarPreview();
}

// Renderizar atributos
function renderAtributos() {
  atributosDiv.innerHTML = "";

  atributosBase.forEach(attr => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <span>${attr.charAt(0).toUpperCase() + attr.slice(1)}:</span>
      <input type="number" min="${valoresActuales[attr]}" value="${valoresActuales[attr]}" data-attr="${attr}" id="${attr}">
    `;
    atributosDiv.appendChild(wrapper);
  });

  puntosRestantesEl.textContent = puntosRestantes;

  document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("change", manejarCambio);
  });
}

// Manejar cambio de atributos
function manejarCambio(e) {
  const attr = e.target.dataset.attr;
  const nuevoValor = parseInt(e.target.value);
  const base = (razas[razaSelect.value][attr] || 0) + (clases[claseSelect.value][attr] || 0);

  let totalGastado = 0;
  document.querySelectorAll("input[type='number']").forEach(input => {
    totalGastado +=
      parseInt(input.value) -
      ((razas[razaSelect.value][input.dataset.attr] || 0) + (clases[claseSelect.value][input.dataset.attr] || 0));
  });

  if (totalGastado > puntosTotales) {
    e.target.value = base + (puntosTotales - (totalGastado - (nuevoValor - base)));
    totalGastado = puntosTotales;
  }

  puntosRestantes = puntosTotales - totalGastado;
  puntosRestantesEl.textContent = puntosRestantes;
  actualizarPreview();
}

// Actualizar vista previa
function actualizarPreview() {
  cardRaza.textContent = `Raza: ${razaSelect.value}`;
  cardClase.textContent = `Clase: ${claseSelect.value}`;
  cardStats.innerHTML = "";

  document.querySelectorAll("input[type='number']").forEach(input => {
    const li = document.createElement("li");
    li.textContent = `${input.dataset.attr}: ${input.value}`;
    cardStats.appendChild(li);
  });
}

// Eventos para descripciones
nombreInput.addEventListener("input", () => cardName.textContent = nombreInput.value || "Personaje");
fisicoInput.addEventListener("input", () => cardFisico.textContent = fisicoInput.value || "");
personalidadInput.addEventListener("input", () => cardPersonalidad.textContent = personalidadInput.value || "");
historiaInput.addEventListener("input", () => cardHistoria.textContent = historiaInput.value || "");

// Eventos para raza y clase
razaSelect.addEventListener("change", calcularBase);
claseSelect.addEventListener("change", calcularBase);

// Guardar en Google Sheets
document.getElementById("guardar").addEventListener("click", () => {
  const data = {
    nombre: nombreInput.value,
    raza: razaSelect.value,
    clase: claseSelect.value,
    fisico: fisicoInput.value,
    personalidad: personalidadInput.value,
    historia: historiaInput.value,
    atributos: {
      fuerza: document.getElementById("fuerza").value,
      defensa: document.getElementById("defensa").value,
      magia: document.getElementById("magia").value,
      resistencia: document.getElementById("resistencia").value,
      velocidad: document.getElementById("velocidad").value,
      destreza: document.getElementById("destreza").value,
    },
  };

  fetch("https://script.google.com/macros/s/AKfycbwh6Sg0S02tanwjNn7J1X7SYE25BkLojj8ve0X0gyaj9ZLBB0jMR3aCDG3pEpiBBm5d/exec", {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(data),
  }).then(() => alert("Datos guardados en Google Sheets"));
});

// Botón Borrar - Reiniciar todo
document.getElementById("borrar").addEventListener("click", () => {
  // Limpiar campos de texto
  nombreInput.value = "";
  fisicoInput.value = "";
  personalidadInput.value = "";
  historiaInput.value = "";

  // Reset selects
  razaSelect.value = "Humano";
  claseSelect.value = "Guerrero";

  // Recalcular base y reset vista previa
  calcularBase();
  cardName.textContent = "Personaje";
  cardFisico.textContent = "";
  cardPersonalidad.textContent = "";
  cardHistoria.textContent = "";
});


// Inicializar
calcularBase();
