<template>
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
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['addPokemon']);

// Estados para la búsqueda
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const showSearchResults = ref(false);

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
  emit('addPokemon', pokemon);
  
  // Limpiar búsqueda
  searchQuery.value = '';
  searchResults.value = [];
  showSearchResults.value = false;
};
</script>