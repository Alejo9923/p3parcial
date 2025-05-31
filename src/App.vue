<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
      <h1 class="text-4xl font-extrabold text-blue-600 mb-4">
        ¡Tailwind CSS Funcionando!
      </h1>

      <p class="text-gray-700 text-lg mb-6">
        Si ves este texto con estilos diferentes (fuente, color, tamaño), ¡significa que Tailwind CSS está correctamente configurado en tu proyecto Vue.js con Vite!
      </p>

      <button
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        ¡Botón Estilizado!
      </button>

      <div class="mt-8 p-4 bg-purple-100 rounded-md text-purple-800 text-sm md:text-base lg:text-lg">
        <p>
          Este bloque cambia de tamaño de texto según la pantalla (móvil, tablet, escritorio).
        </p>
        <p class="mt-2 text-xs text-purple-600">
          Clases usadas: <code class="bg-purple-200 px-1 rounded">text-sm md:text-base lg:text-lg</code>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// No necesitamos lógica de script compleja para este ejemplo de verificación.
// Si tuvieras componentes, los importarías aquí.
</script>

<style scoped>
/*
  Los estilos 'scoped' son específicos para este componente.
  Tailwind CSS funciona aplicando clases directamente en el HTML,
  por lo que a menudo no necesitarás mucho CSS 'scoped' aquí,
  a menos que quieras estilos muy específicos que no se puedan lograr con utilidades de Tailwind.
*/
</style>
