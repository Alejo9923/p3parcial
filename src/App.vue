<template>
  <div :class="isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'" class="p-8 min-h-screen transition-colors duration-300">
    <!-- Botón de tema oscuro -->
    <div class="absolute top-4 left-4">
      <button
        @click="toggleDarkMode"
        :class="isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-700'"
        class="p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <svg v-if="isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
    </div>

    <h1 :class="isDarkMode ? 'text-blue-400' : 'text-blue-700'" class="text-4xl font-extrabold mb-6 text-center transition-colors duration-300">
      Pokédex con AG Grid
    </h1>
    <p :class="isDarkMode ? 'text-gray-300' : 'text-gray-800'" class="text-lg mb-8 text-center max-w-2xl mx-auto transition-colors duration-300">
      Explora información de Pokémon con una tabla interactiva. Puedes ordenar, filtrar y ajustar la cantidad de registros.
    </p>
    
    <!-- Barra de búsqueda -->
    <div class="mb-6 max-w-2xl mx-auto relative">
      <div :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="p-4 rounded-lg shadow-md border transition-colors duration-300">
        <label for="searchInput" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">
          Buscar Pokémon por nombre, tipo o habilidad:
        </label>
        <div class="relative">
          <input
            id="searchInput"
            v-model="searchQuery"
            @input="handleSearch"
            @focus="showSearchResults = true"
            @blur="hideSearchResults"
            type="text"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'"
            class="w-full px-4 py-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300"
            placeholder="Ej: pikachu, electric, thunderbolt..."
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div :class="isDarkMode ? 'border-blue-400' : 'border-blue-600'" class="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
      
      <!-- Resultados de búsqueda -->
      <div v-if="showSearchResults && searchResults.length > 0" 
           :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
           class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto">
        <div v-for="pokemon in searchResults" 
             :key="pokemon.id"
             @mousedown="addPokemonToTable(pokemon)"
             :class="isDarkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-200'"
             class="flex items-center p-3 cursor-pointer border-b last:border-b-0 transition-colors duration-200">
          <img :src="pokemon.sprite" :alt="pokemon.name" class="w-12 h-12 mr-3 object-contain" />
          <div class="flex-1">
            <h3 :class="isDarkMode ? 'text-white' : 'text-gray-900'" class="font-medium capitalize">{{ pokemon.name }}</h3>
            <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
              Tipos: {{ pokemon.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') }}
            </p>
            <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="text-xs">
              Habilidades: {{ pokemon.abilities.slice(0, 2).map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ') }}
            </p>
          </div>
          <div :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" class="text-sm font-medium">
            Agregar
          </div>
        </div>
      </div>
      
      <!-- Mensaje cuando no hay resultados -->
      <div v-if="showSearchResults && searchQuery && searchResults.length === 0 && !isSearching"
           :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'"
           class="absolute z-10 w-full mt-1 border rounded-lg shadow-lg p-4 text-center">
        No se encontraron Pokémon que coincidan con "{{ searchQuery }}"
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="text-center mb-8">
      <div :class="isDarkMode ? 'border-blue-400' : 'border-blue-700'" class="inline-block animate-spin rounded-full h-8 w-8 border-b-2"></div>
      <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="mt-2">Cargando Pokémon...</p>
    </div>
    
    <!-- AG Grid Table -->
    <div v-if="!loading" :class="['w-full h-auto mx-auto shadow-lg rounded-lg overflow-hidden mb-6', isDarkMode ? 'ag-theme-alpine ag-theme-dark' : 'ag-theme-alpine']">
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :theme="'legacy'" 
        class="h-full"
        domLayout="autoHeight"
        :rowHeight="50"
      />
    </div>
    
    <!-- Controls -->
    <div v-if="!loading" :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'" class="p-6 rounded-lg shadow-md max-w-md mx-auto border transition-colors duration-300">
      <label for="pokemonCount" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'" class="block text-sm font-medium mb-2">
        Cantidad de Pokémon a cargar:
      </label>
      <div class="flex gap-3">
        <input
          id="pokemonCount"
          v-model.number="pokemonCount"
          type="number"
          min="1"
          max="1000"
          :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'"
          class="flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-300"
          placeholder="Ej: 20"
        />
        <button
          @click="loadPokemon"
          :disabled="loading"
          :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'"
          class="px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          Cargar
        </button>
      </div>
    </div>
    
    <div class="mt-8 text-center text-sm">
      <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="transition-colors duration-300">
        Datos obtenidos de PokéAPI • Total mostrados: {{ rowData.length }} Pokémon
      </p>
      <p v-if="rowData.length !== pokemonCount" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" class="text-xs mt-1">
        ({{ pokemonCount }} cargados inicialmente + {{ rowData.length - pokemonCount }} agregados por búsqueda)
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Estados reactivos
const rowData = ref([]);
const loading = ref(false);
const pokemonCount = ref(10);
const isDarkMode = ref(false);

// Estados para la búsqueda
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const showSearchResults = ref(false);

// Función para alternar tema oscuro
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

// Debounce para la búsqueda
let searchTimeout = null;

// Función para manejar la búsqueda
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim().length >= 2) {
      searchPokemon();
    } else {
      searchResults.value = [];
    }
  }, 300);
};

// Función para buscar Pokémon
const searchPokemon = async () => {
  if (!searchQuery.value.trim()) return;
  
  isSearching.value = true;
  searchResults.value = [];
  
  try {
    const query = searchQuery.value.toLowerCase().trim();
    
    // Primero intentar búsqueda directa por nombre
    try {
      const directResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (directResponse.ok) {
        const pokemonData = await directResponse.json();
        const pokemon = {
          id: pokemonData.id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default || '',
          types: pokemonData.types.map(typeInfo => typeInfo.type.name),
          abilities: pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name)
        };
        searchResults.value = [pokemon];
        isSearching.value = false;
        return;
      }
    } catch (error) {
      // Si la búsqueda directa falla, continuar con búsqueda por tipo
    }
    
    // Búsqueda por tipo
    try {
      const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${query}`);
      if (typeResponse.ok) {
        const typeData = await typeResponse.json();
        const pokemonList = typeData.pokemon.slice(0, 10); // Limitar a 10 resultados
        
        const pokemonPromises = pokemonList.map(async (pokemonInfo) => {
          const pokemonResponse = await fetch(pokemonInfo.pokemon.url);
          const pokemonData = await pokemonResponse.json();
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            sprite: pokemonData.sprites.front_default || '',
            types: pokemonData.types.map(typeInfo => typeInfo.type.name),
            abilities: pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name)
          };
        });
        
        const results = await Promise.all(pokemonPromises);
        searchResults.value = results;
        isSearching.value = false;
        return;
      }
    } catch (error) {
      // Si la búsqueda por tipo falla, continuar con búsqueda general
    }
    
    // Búsqueda general en lista de Pokémon
    const allPokemonResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const allPokemonData = await allPokemonResponse.json();
    const matchingPokemon = allPokemonData.results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query)
    ).slice(0, 10);
    
    if (matchingPokemon.length > 0) {
      const pokemonPromises = matchingPokemon.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default || '',
          types: pokemonData.types.map(typeInfo => typeInfo.type.name),
          abilities: pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name)
        };
      });
      
      const results = await Promise.all(pokemonPromises);
      searchResults.value = results;
    }
    
  } catch (error) {
    console.error('Error en la búsqueda:', error);
  } finally {
    isSearching.value = false;
  }
};

// Función para ocultar resultados con delay
const hideSearchResults = () => {
  setTimeout(() => {
    showSearchResults.value = false;
  }, 200);
};

// Función para agregar Pokémon a la tabla
const addPokemonToTable = (pokemon) => {
  // Verificar si el Pokémon ya existe en la tabla
  const exists = rowData.value.some(existingPokemon => existingPokemon.id === pokemon.id);
  
  if (!exists) {
    rowData.value.push(pokemon);
    // Actualizar el contador visual
    pokemonCount.value = rowData.value.length;
  }
  
  // Limpiar búsqueda
  searchQuery.value = '';
  searchResults.value = [];
  showSearchResults.value = false;
};

// Función para renderizar el sprite como HTML directo
const spriteRenderer = (params) => {
  if (params.value) {
    return `<div class="flex justify-center"><img src="${params.value}" alt="Sprite de ${params.data.name}" class="w-12 h-12 object-contain mx-auto" style="width: 48px; height: 48px;"/></div>`;
  }
  return '<div class="flex justify-center text-gray-400">Sin imagen</div>';
};

// Definiciones de columnas
const columnDefs = ref([
  { 
    field: 'sprite', 
    headerName: 'Sprite', 
    cellRenderer: spriteRenderer,
    sortable: false, 
    filter: false,
    width: 100,
    resizable: false
  },
  { 
    field: 'name', 
    headerName: 'Nombre', 
    sortable: true, 
    filter: true,
    valueFormatter: (params) => {
      return params.value.charAt(0).toUpperCase() + params.value.slice(1);
    }
  },
  { 
    field: 'types', 
    headerName: 'Tipo(s)', 
    sortable: true, 
    filter: true,
    valueFormatter: (params) => {
      return params.value.map(type => 
        type.charAt(0).toUpperCase() + type.slice(1)
      ).join(', ');
    }
  },
  { 
    field: 'abilities', 
    headerName: 'Habilidades', 
    sortable: true, 
    filter: true,
    valueFormatter: (params) => {
      return params.value.map(ability => 
        ability.charAt(0).toUpperCase() + ability.slice(1)
      ).join(', ');
    }
  }
]);

// Configuración por defecto de columnas
const defaultColDef = {
  flex: 1,
  minWidth: 100,
  resizable: true,
};

// Función para cargar múltiples Pokémon usando el mismo enfoque que tu código funcional
async function loadPokemon() {
  loading.value = true;
  rowData.value = [];
  
  try {
    // Obtener la lista básica de pokémons
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonCount.value}`);
    const data = await response.json();
    const pokemons = data.results;
    
    // Obtener detalles de cada pokémon de forma concurrente
    const detailedData = await Promise.all(
      pokemons.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        const pokemonData = await detailResponse.json();
        
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default || '',
          types: pokemonData.types.map(typeInfo => typeInfo.type.name),
          abilities: pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name)
        };
      })
    );
    
    rowData.value = detailedData;
  } catch (error) {
    console.error('Error loading Pokemon:', error);
  } finally {
    loading.value = false;
  }
}

// Cargar datos iniciales al montar el componente
onMounted(() => {
  loadPokemon();
});
</script>

<style scoped>
/* Estilos para el tema claro */
.ag-theme-alpine .ag-header-cell-text {
  font-weight: 600;
}

.ag-theme-alpine .ag-row {
  border-bottom: 1px solid #e5e7eb;
}

.ag-theme-alpine .ag-row:hover {
  background-color: #f9fafb;
}

/* Tema oscuro personalizado para AG Grid */
.ag-theme-alpine.ag-theme-dark {
  --ag-background-color: #1f2937;
  --ag-header-background-color: #374151;
  --ag-odd-row-background-color: #1f2937;
  --ag-row-hover-color: #374151;
  --ag-row-border-color: #4b5563;
  --ag-border-color: #4b5563;
  --ag-header-foreground-color: #f9fafb;
  --ag-foreground-color: #f9fafb;
  --ag-data-color: #f9fafb;
  --ag-secondary-foreground-color: #d1d5db;
  --ag-input-focus-box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5);
  --ag-input-focus-border-color: #3b82f6;
}

.ag-theme-alpine.ag-theme-dark .ag-header-cell {
  background-color: var(--ag-header-background-color);
  color: var(--ag-header-foreground-color);
  border-right: 1px solid var(--ag-border-color);
}

.ag-theme-alpine.ag-theme-dark .ag-cell {
  border-right: 1px solid var(--ag-row-border-color);
  color: var(--ag-foreground-color);
}

.ag-theme-alpine.ag-theme-dark .ag-row {
  background-color: var(--ag-background-color);
  border-bottom: 1px solid var(--ag-row-border-color);
}

.ag-theme-alpine.ag-theme-dark .ag-row:hover {
  background-color: var(--ag-row-hover-color);
}

.ag-theme-alpine.ag-theme-dark .ag-root-wrapper {
  background-color: var(--ag-background-color);
  color: var(--ag-foreground-color);
}

.ag-theme-alpine.ag-theme-dark .ag-header {
  background-color: var(--ag-header-background-color);
  border-bottom: 1px solid var(--ag-border-color);
}

/* Filtros en tema oscuro */
.ag-theme-alpine.ag-theme-dark .ag-filter-toolpanel {
  background-color: var(--ag-background-color);
  color: var(--ag-foreground-color);
}

.ag-theme-alpine.ag-theme-dark .ag-menu {
  background-color: var(--ag-background-color);
  color: var(--ag-foreground-color);
  border: 1px solid var(--ag-border-color);
}

.ag-theme-alpine.ag-theme-dark .ag-menu-option {
  color: var(--ag-foreground-color);
}

.ag-theme-alpine.ag-theme-dark .ag-menu-option:hover {
  background-color: var(--ag-row-hover-color);
}
</style>