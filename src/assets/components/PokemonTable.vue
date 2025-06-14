<template>
  <!-- AG Grid Table -->
  <div :class="['w-full h-auto mx-auto shadow-lg rounded-lg overflow-hidden mb-6', isDarkMode ? 'ag-theme-alpine ag-theme-dark' : 'ag-theme-alpine']">
    <ag-grid-vue
      :rowData="pokemonData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :theme="'legacy'" 
      class="h-full"
      :domLayout="shouldPaginate ? 'normal' : 'autoHeight'"
      :rowHeight="50"
      :pagination="shouldPaginate"
      :paginationPageSize="20"
      :paginationPageSizeSelector="[10, 20, 50, 100]"
      :style="shouldPaginate ? 'height: 600px;' : ''"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const props = defineProps({
  pokemonData: {
    type: Array,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    required: true
  },
  favorites: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['addFavorite', 'removeFavorite']);

// Computed para determinar si debe paginar
const shouldPaginate = computed(() => {
  return props.pokemonData && props.pokemonData.length > 20;
});

// Función para renderizar el sprite como HTML directo
const spriteRenderer = (params) => {
  if (params.value) {
    return `<div class="flex justify-center"><img src="${params.value}" alt="Sprite de ${params.data.name}" class="w-12 h-12 object-contain mx-auto" style="width: 48px; height: 48px;"/></div>`;
  }
  return '<div class="flex justify-center text-gray-400">Sin imagen</div>';
};

// Función para renderizar el botón de favorito
const favoriteButtonRenderer = (params) => {
  const isFavorite = props.favorites.some(fav => fav.id === params.data.id);
  
  if (isFavorite) {
    return `<div class="flex justify-center items-center h-full">
      <button 
        class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
        onclick="removeFavorite(${params.data.id})"
      >
        ❌ Quitar
      </button>
    </div>`;
  } else {
    return `<div class="flex justify-center items-center h-full">
      <button 
        class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
        onclick="addFavorite(${params.data.id})"
      >
        ⭐ Agregar
      </button>
    </div>`;
  }
};

// Hacer las funciones globales para que AG Grid pueda accederlas
window.addFavorite = (pokemonId) => {
  const pokemon = props.pokemonData.find(p => p.id === pokemonId);
  if (pokemon) {
    emit('addFavorite', pokemon);
  }
};

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

/* Estilos para la paginación en tema oscuro */
.ag-theme-alpine.ag-theme-dark .ag-paging-panel {
  background-color: var(--ag-header-background-color);
  color: var(--ag-foreground-color);
  border-top: 1px solid var(--ag-border-color);
}

.ag-theme-alpine.ag-theme-dark .ag-paging-button {
  color: var(--ag-foreground-color);
  background-color: transparent;
  border: 1px solid var(--ag-border-color);
}

.ag-theme-alpine.ag-theme-dark .ag-paging-button:hover:not(.ag-disabled) {
  background-color: var(--ag-row-hover-color);
}

.ag-theme-alpine.ag-theme-dark .ag-paging-button.ag-disabled {
  color: var(--ag-secondary-foreground-color);
  background-color: transparent;
}

.ag-theme-alpine.ag-theme-dark .ag-select .ag-picker-field-wrapper {
  background-color: var(--ag-background-color);
  border: 1px solid var(--ag-border-color);
  color: var(--ag-foreground-color);
}

.ag-theme-alpine.ag-theme-dark .ag-select .ag-picker-field-display {
  color: var(--ag-foreground-color);
}
</style>