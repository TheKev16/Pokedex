window.onload = function () {
  const contenedor = document.getElementById("listaEntrenadores");
  const tx = db.transaction(["entrenadores"], "readonly");
  const store = tx.objectStore("entrenadores");
  const req = store.openCursor();

  req.onsuccess = function (e) {
    const cursor = e.target.result;
    if (cursor) {
      const { nombre, sexo, residencia, foto } = cursor.value;
      contenedor.innerHTML += `
        <div class="col-md-4 mb-3">
          <div class="card">
            <img src="${foto}" class="card-img-top" alt="${nombre}">
            <div class="card-body">
              <h5 class="card-title">${nombre}</h5>
              <p class="card-text">Sexo: ${sexo}<br>Residencia: ${residencia}</p>
            </div>
          </div>
        </div>`;
      cursor.continue();
    }
  };
};
