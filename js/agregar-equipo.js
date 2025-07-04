window.onload = function () {
  const select = document.getElementById("entrenadorSelect");
  const tx = db.transaction(["entrenadores"], "readonly");
  const store = tx.objectStore("entrenadores");

  store.openCursor().onsuccess = function (e) {
    const cursor = e.target.result;
    if (cursor) {
      const opt = document.createElement("option");
      opt.value = cursor.value.nombre;
      opt.textContent = cursor.value.nombre;
      select.appendChild(opt);
      cursor.continue();
    }
  };

  document.getElementById("formEquipo").addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = this.nombre.value;
    const imagen = this.imagen.value;
    const entrenador = this.entrenador.value;
    const pokemones = this.pokemones.value.split(',').map(p => p.trim()).slice(0, 6);

    const tx = db.transaction(["equipos"], "readwrite");
    const store = tx.objectStore("equipos");
    store.add({ nombre, imagen, entrenador, pokemones });

    tx.oncomplete = () => {
      alert("Equipo guardado con éxito");
      this.reset();
    };
  });
};

