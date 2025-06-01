<template>
  <!-- Botón de tema oscuro -->
  <div class="absolute top-4 left-4">
    <button
      @click="$emit('toggleDarkMode')"
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
</template>

<script setup>
defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

defineEmits(['toggleDarkMode']);
</script>