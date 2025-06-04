<template>
  <!-- AG Grid Table for Favorites -->
  <div v-if="favoritesPokemon && favoritesPokemon.length > 0" class="mb-8">
    <h2 :class="isDarkMode ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold mb-4 text-center">
      ⭐ Pokémon Favoritos ({{ favoritesPokemon.length }})
    </h2>
    <div :class="['w-full h-auto mx-auto shadow-lg rounded-lg overflow-hidden', isDarkMode ? 'ag-theme-alpine ag-theme-dark' : 'ag-theme-alpine']">
      <ag-grid-vue
        :rowData="favoritesPokemon"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :theme="'legacy'" 
        class="h-full"
        domLayout="autoHeight"
        :rowHeight="50"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const props = defineProps({
  favoritesPokemon: {
    type: Array,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['removeFavorite']);

// Función para renderizar el sprite como HTML directo
const spriteRenderer = (params) => {
  if (params.value) {
    return `<div class="flex justify-center"><img src="${params.value}" alt="Sprite de ${params.data.name}" class="w-12 h-12 object-contain mx-auto" style="width: 48px; height: 48px;"/></div>`;
  }
  return '<div class="flex justify-center text-gray-400">Sin imagen</div>';
};

// Función para renderizar el botón de quitar de favoritos
const favoriteButtonRenderer = (params) => {
  return `<div class="flex justify-center items-center h-full">
    <button 
      class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
      onclick="removeFavorite(${params.data.id})"
    >
      ❌ Quitar
    </button>
  </div>`;
};

// Hacer la función global para que AG Grid pueda accederla
window.removeFavorite = (pokemonId) => {
  emit('removeFavorite', pokemonId);
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
  },
  {
    field: 'favorite',
    headerName: 'Favorito',
    cellRenderer: favoriteButtonRenderer,
    sortable: false,
    filter: false,
    width: 120,
    resizable: false
  }
]);

// Configuración por defecto de columnas
const defaultColDef = {
  flex: 1,
  minWidth: 100,
  resizable: true,
};
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