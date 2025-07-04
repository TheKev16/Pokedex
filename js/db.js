let db;

const request = indexedDB.open("PokedexDB", 1);

request.onerror = () => {
  console.error("No se pudo abrir la base de datos");
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("Base de datos abierta");

  cargarEntrenadores();
  cargarEquipos();
  initFormListeners();
};

request.onupgradeneeded = (event) => {
  db = event.target.result;

  if (!db.objectStoreNames.contains("entrenadores")) {
    db.createObjectStore("entrenadores", { keyPath: "id", autoIncrement: true });
  }
  if (!db.objectStoreNames.contains("equipos")) {
    db.createObjectStore("equipos", { keyPath: "id", autoIncrement: true });
  }
};

// Guardar entrenador
function guardarEntrenador(entrenador) {
  const transaction = db.transaction("entrenadores", "readwrite");
  const store = transaction.objectStore("entrenadores");
  const request = store.add(entrenador);

  request.onsuccess = () => {
    console.log("Entrenador guardado");
    cargarEntrenadores();
  };

  request.onerror = () => {
    console.error("Error al guardar entrenador");
  };
}

// Guardar equipo
function guardarEquipo(equipo) {
  const transaction = db.transaction("equipos", "readwrite");
  const store = transaction.objectStore("equipos");
  const request = store.add(equipo);

  request.onsuccess = () => {
    console.log("Equipo guardado");
    cargarEquipos();
  };

  request.onerror = () => {
    console.error("Error al guardar equipo");
  };
}

// Visualizacion y cargad entrenadores
function cargarEntrenadores() {
  const transaction = db.transaction("entrenadores", "readonly");
  const store = transaction.objectStore("entrenadores");
  const request = store.getAll();

  request.onsuccess = () => {
    const entrenadores = request.result;
    const contenedor = document.getElementById("listaEntrenadores");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (entrenadores.length === 0) {
      contenedor.textContent = "No hay entrenadores guardados.";
      return;
    }

    entrenadores.forEach(e => {
      const div = document.createElement("div");
      div.className = "card mb-2";
      div.innerHTML = `
        <img src="${e.imagen}" alt="${e.nombre}" class="card-img-top" style="height:150px;object-fit:cover;">
        <div class="card-body">
          <h5 class="card-title">${e.nombre}</h5>
        </div>
      `;
      contenedor.appendChild(div);
    });
  };
}

// Visualizacion y cargar de equipos
function cargarEquipos() {
  const transaction = db.transaction("equipos", "readonly");
  const store = transaction.objectStore("equipos");
  const request = store.getAll();

  request.onsuccess = () => {
    const equipos = request.result;
    const contenedor = document.getElementById("listaEquipos");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (equipos.length === 0) {
      contenedor.textContent = "No hay equipos guardados.";
      return;
    }

    equipos.forEach(equipo => {
      const div = document.createElement("div");
      div.className = "card mb-2";
      div.innerHTML = `
        <img src="${equipo.imagen}" alt="${equipo.nombre}" class="card-img-top" style="height:150px;object-fit:cover;">
        <div class="card-body">
          <h5 class="card-title">${equipo.nombre}</h5>
          <p><strong>Entrenador:</strong> ${equipo.entrenador}</p>
          <p><strong>Pokémon:</strong> ${equipo.pokemones}</p>
        </div>
      `;
      contenedor.appendChild(div);
    });
  };
}

// Inicializacion eventos 
function initFormListeners() {
  //  entrenadores
  const formEntrenador = document.getElementById("formEntrenador");
  if (formEntrenador) {
    formEntrenador.addEventListener("submit", e => {
      e.preventDefault();

      const nuevoEntrenador = {
        nombre: formEntrenador.nombre.value.trim(),
        imagen: formEntrenador.imagen.value.trim()
      };

      if (!nuevoEntrenador.nombre || !nuevoEntrenador.imagen) {
        alert("Por favor complete todos los campos.");
        return;
      }

      guardarEntrenador(nuevoEntrenador);
      formEntrenador.reset();
    });
  }

  // equipos
  const formEquipo = document.getElementById("formEquipo");
  if (formEquipo) {
    formEquipo.addEventListener("submit", e => {
      e.preventDefault();

      const nuevoEquipo = {
        nombre: formEquipo.nombre.value.trim(),
        imagen: formEquipo.imagen.value.trim(),
        entrenador: formEquipo.entrenador.value.trim(),
        pokemones: formEquipo.pokemones.value.trim()
      };

      if (!nuevoEquipo.nombre || !nuevoEquipo.imagen || !nuevoEquipo.entrenador || !nuevoEquipo.pokemones) {
        alert("Por favor complete todos los campos.");
        return;
      }

      guardarEquipo(nuevoEquipo);
      formEquipo.reset();
    });
  }
}