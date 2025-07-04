window.onload = function () {
  const container = document.getElementById("listaEquipos");
  const tx = db.transaction(["equipos"], "readonly");
  const store = tx.objectStore("equipos");

  store.openCursor().onsuccess = function (e) {
    const cursor = e.target.result;
    if (cursor) {
      const { nombre, imagen, entrenador, pokemones } = cursor.value;

      let pokesHtml = pokemones.map(p =>
        `<div><img src="https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${p.toLowerCase()}.png" style="width:50px"> ${p}</div>`
      ).join("");

      container.innerHTML += `
        <div class="col-md-6 mb-4">
          <div class="card">
            <img src="${imagen}" class="card-img-top" alt="${nombre}">
            <div class="card-body">
              <h5>${nombre}</h5>
              <p><strong>Entrenador:</strong> ${entrenador}</p>
              <div>${pokesHtml}</div>
            </div>
          </div>
        </div>
      `;
      cursor.continue();
    }
  };
};
