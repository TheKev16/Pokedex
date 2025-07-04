document.getElementById("formEntrenador").addEventListener("submit", function (e) {
  e.preventDefault();
  const nuevo = {
    nombre: this.nombre.value,
    sexo: this.sexo.value,
    residencia: this.residencia.value,
    foto: this.foto.value
  };

  const tx = db.transaction(["entrenadores"], "readwrite");
  const store = tx.objectStore("entrenadores");
  store.add(nuevo);

  tx.oncomplete = () => {
    alert("Entrenador guardado exitosamente");
    this.reset();
  };
});
