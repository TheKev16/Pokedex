class PokedexApp {
    constructor() {
        this.currentGeneration = 1;
        this.pokemonData = [];
        this.modal = new bootstrap.Modal(document.getElementById('pokemonModal'));
        this.initializeEventListeners();
        this.loadGeneration(1, 0, 151);
    }

    initializeEventListeners() {
        // Generation buttons
        document.querySelectorAll('.generation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const generation = parseInt(e.target.dataset.generation);
                const offset = parseInt(e.target.dataset.offset);
                const limit = parseInt(e.target.dataset.limit);
                
                this.setActiveGeneration(generation);
                this.loadGeneration(generation, offset, limit);
            });
        });
    }

    setActiveGeneration(generation) {
        document.querySelectorAll('.generation-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-generation="${generation}"]`).classList.add('active');
        this.currentGeneration = generation;
    }

    loadGeneration(generation, offset, limit) {
        this.showLoading();
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`, true);
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        this.pokemonData = data.results;
                        this.renderPokemonGrid();
                    } catch (error) {
                        this.showError('Error al procesar los datos de la API');
                    }
                } else {
                    this.showError('Error al cargar los datos de la API');
                }
            }
        };
        
        xhr.onerror = () => {
            this.showError('Error de conexión con la API');
        };
        
        xhr.send();
    }

    showLoading() {
        document.getElementById('pokemon-container').innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <h4>Cargando Pokémon...</h4>
                <p>Obteniendo datos de la generación ${this.currentGeneration}</p>
            </div>
        `;
    }

    showError(message) {
        document.getElementById('pokemon-container').innerHTML = `
            <div class="error-message">
                <h4><i class="fas fa-exclamation-triangle"></i> Error</h4>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i> Intentar de nuevo
                </button>
            </div>
        `;
    }

    renderPokemonGrid() {
        const container = document.getElementById('pokemon-container');
        
        if (this.pokemonData.length === 0) {
            container.innerHTML = `
                <div class="error-message">
                    <h4>No se encontraron Pokémon</h4>
                    <p>No hay datos disponibles para esta generación.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="row mb-3">
                <div class="col-12">
                    <h2 class="text-white text-center">
                        <i class="fas fa-star"></i> Generación ${this.currentGeneration}
                        <small class="d-block text-white-50">
                            ${this.pokemonData.length} Pokémon disponibles
                        </small>
                    </h2>
                </div>
            </div>
            <div class="pokemon-grid" id="pokemon-grid"></div>
        `;

        const grid = document.getElementById('pokemon-grid');
        
        this.pokemonData.forEach((pokemon, index) => {
            const pokemonId = this.extractPokemonId(pokemon.url);
            const paddedId = pokemonId.toString().padStart(3, '0');
            
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.innerHTML = `
                <img src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${paddedId}.png" 
                     alt="${pokemon.name}" 
                     class="pokemon-image"
                     onerror="this.src='https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${pokemon.name}.png'">
                <h5 class="pokemon-name">${pokemon.name}</h5>
                <p class="pokemon-id">#${paddedId}</p>
            `;
            
            card.addEventListener('click', () => {
                this.showPokemonDetails(pokemon.name, pokemonId);
            });
            
            grid.appendChild(card);
        });
    }

    extractPokemonId(url) {
        const matches = url.match(/\/(\d+)\/$/);
        return matches ? parseInt(matches[1]) : 0;
    }

    showPokemonDetails(pokemonName, pokemonId) {
        document.getElementById('pokemon-details').innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <h4>Cargando detalles de ${pokemonName}...</h4>
            </div>
        `;
        
        this.modal.show();
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://pokeapi.co/api/v2/pokemon/${pokemonName}`, true);
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const pokemon = JSON.parse(xhr.responseText);
                        this.renderPokemonDetails(pokemon);
                    } catch (error) {
                        this.showDetailsError('Error al procesar los detalles del Pokémon');
                    }
                } else {
                    this.showDetailsError('Error al cargar los detalles del Pokémon');
                }
            }
        };
        
        xhr.onerror = () => {
            this.showDetailsError('Error de conexión con la API');
        };
        
        xhr.send();
    }

    showDetailsError(message) {
        document.getElementById('pokemon-details').innerHTML = `
            <div class="error-message">
                <h4><i class="fas fa-exclamation-triangle"></i> Error</h4>
                <p>${message}</p>
            </div>
        `;
    }

    renderPokemonDetails(pokemon) {
        const paddedId = pokemon.id.toString().padStart(3, '0');
        const heightInMeters = (pokemon.height / 10).toFixed(1);
        const weightInKgs = (pokemon.weight / 10).toFixed(1);
        
        const types = pokemon.types.map(type => 
            `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
        ).join('');
        
        const abilities = pokemon.abilities.map(ability => 
            `<span class="ability-badge">${ability.ability.name}</span>`
        ).join('');
        
        const moves = pokemon.moves.slice(0, 10).map(move => 
            `<span class="move-badge">${move.move.name}</span>`
        ).join('');
        
        const stats = pokemon.stats.map(stat => `
            <div class="row mb-2 align-items-center">
                <div class="col-4">
                    <strong>${stat.stat.name}:</strong>
                </div>
                <div class="col-6">
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${Math.min(stat.base_stat, 255) / 255 * 100}%"></div>
                    </div>
                </div>
                <div class="col-2 text-end">
                    <small><strong>${stat.base_stat}</strong></small>
                </div>
            </div>
        `).join('');

        document.getElementById('pokemon-details').innerHTML = `
            <div class="text-center">
                <img src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${paddedId}.png" 
                     alt="${pokemon.name}" 
                     class="pokemon-detail-image"
                     onerror="this.src='https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/${pokemon.name}.png'">
                <h2 class="pokemon-name text-capitalize">${pokemon.name}</h2>
                <p class="pokemon-id">Pokémon ID #${paddedId}</p>
                <p class="text-muted">Generación ${this.currentGeneration}</p>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="detail-section">
                        <div class="detail-title">
                            <i class="fas fa-ruler"></i> Información Física
                        </div>
                        <p><strong>Altura:</strong> ${heightInMeters} mts</p>
                        <p><strong>Peso:</strong> ${weightInKgs} kgs</p>
                    </div>
                    
                    <div class="detail-section">
                        <div class="detail-title">
                            <i class="fas fa-tag"></i> Tipos
                        </div>
                        <div>${types}</div>
                    </div>
                    
                    <div class="detail-section">
                        <div class="detail-title">
                            <i class="fas fa-magic"></i> Habilidades
                        </div>
                        <div>${abilities}</div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="detail-section">
                        <div class="detail-title">
                            <i class="fas fa-chart-bar"></i> Estadísticas Base
                        </div>
                        ${stats}
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <div class="detail-title">
                    <i class="fas fa-fist-raised"></i> Movimientos (Primeros 10)
                </div>
                <div>${moves}</div>
                ${pokemon.moves.length > 10 ? `<p class="text-muted mt-2">Y ${pokemon.moves.length - 10} movimientos más...</p>` : ''}
            </div>
        `;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokedexApp();
}); 

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("hamburgerMenu");

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", !expanded);
    menu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    }
  });
});
