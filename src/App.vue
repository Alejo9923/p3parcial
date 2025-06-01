<template>
  <div :class="isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'" class="p-8 min-h-screen transition-colors duration-300">
    <!-- Header con botón de tema -->
    <AppHeader :isDarkMode="isDarkMode" @toggleDarkMode="toggleDarkMode" />
    
    <!-- Barra de búsqueda -->
    <PokemonSearch 
      :isDarkMode="isDarkMode"
      @addPokemon="addPokemonToTable"
    />
    
    <!-- Loading indicator -->
    <div v-if="loading" class="text-center mb-8">
      <div :class="isDarkMode ? 'border-blue-400' : 'border-blue-700'" class="inline-block animate-spin rounded-full h-8 w-8 border-b-2"></div>
      <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="mt-2">Cargando Pokémon...</p>
    </div>
    
    <!-- Tabla de Pokémon -->
    <PokemonTable 
      v-if="!loading"
      :pokemonData="rowData"
      :isDarkMode="isDarkMode"
    />
    
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
import AppHeader from './assets/components/AppHeader.vue';
import PokemonSearch from './assets/components/PokemonSearch.vue';
import PokemonTable from './assets/components/PokemonTable.vue';

// Estados reactivos
const rowData = ref([]);
const loading = ref(false);
const pokemonCount = ref(10);
const isDarkMode = ref(false);

// Función para alternar tema oscuro
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
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
};

// Función para cargar múltiples Pokémon
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