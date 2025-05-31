<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-extrabold text-blue-700 mb-6 text-center">
      Mi Aplicación con AG Grid
    </h1>

    <p class="text-lg text-gray-800 mb-8 text-center max-w-2xl mx-auto">
      Abajo verás una tabla generada con AG Grid. Si los datos se muestran correctamente y puedes interactuar con las columnas (ordenar, redimensionar), ¡felicitaciones!
    </p>

    <div class="ag-theme-alpine w-full h-96 mx-auto shadow-lg rounded-lg overflow-hidden">
      <ag-grid-vue
        :rowData="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :theme="'legacy'" class="h-full"
      />
    </div>

    <div class="mt-8 text-center text-gray-600 text-sm">
      <p>Este ejemplo usa el tema 'ag-theme-alpine'.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';

// Importa los estilos de AG Grid (obligatorios)
import 'ag-grid-community/styles/ag-grid.css'; // Estilos base de la grilla
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Tema para la grilla (puedes elegir otro)

// Datos para la grilla
const rowData = ref([
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxster', price: 72000 },
  { make: 'BMW', model: 'Serie 3', price: 45000 },
  { make: 'Audi', model: 'A4', price: 48000 },
]);

// Definiciones de columnas
const columnDefs = ref([
  { field: 'make', headerName: 'Marca', sortable: true, filter: true },
  { field: 'model', headerName: 'Modelo', sortable: true, filter: true },
  { field: 'price', headerName: 'Precio', sortable: true, filter: true, valueFormatter: p => '$' + p.value.toLocaleString() },
]);

// Definiciones de columna por defecto (se aplican a todas las columnas a menos que se sobrescriban)
const defaultColDef = {
  flex: 1, // Hace que las columnas ocupen el espacio disponible
  minWidth: 100, // Ancho mínimo
  resizable: true, // Permite redimensionar columnas
};
</script>

<style scoped>
/* No se necesitan estilos con 'scoped' si Tailwind y AG Grid manejan todo.
   Puedes añadir estilos personalizados aquí si lo necesitas para este componente. */
</style>
