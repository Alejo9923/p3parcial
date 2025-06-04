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
    
    <!-- Botón de exportar PDF -->
    <div v-if="!loading && rowData.length > 0" class="mb-6 text-center">
      <button
        @click="exportToPDF"
        :class="isDarkMode ? 'bg-green-600 hover:bg-green-700 focus:ring-green-400' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'"
        class="px-6 py-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 font-medium shadow-lg"
      >
        📄 Exportar a PDF
      </button>
    </div>
    
    <!-- Tabla de Pokémon Favoritos -->
    <PokemonFavoritesTable 
      v-if="!loading"
      :favoritesPokemon="favoritesPokemon"
      :isDarkMode="isDarkMode"
      @removeFavorite="removePokemonFromFavorites"
    />
    
    <!-- Título de la tabla principal -->
    <div v-if="!loading && favoritesPokemon.length > 0" class="mb-4">
      <h2 :class="isDarkMode ? 'text-white' : 'text-gray-900'" class="text-2xl font-bold text-center">
        📋 Todos los Pokémon
      </h2>
    </div>
    
    <!-- Tabla de Pokémon Principal -->
    <PokemonTable 
      v-if="!loading"
      :pokemonData="rowData"
      :isDarkMode="isDarkMode"
      :favorites="favoritesPokemon"
      @addFavorite="addPokemonToFavorites"
      @removeFavorite="removePokemonFromFavorites"
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
    
    <!-- Estadísticas -->
    <div class="mt-8 text-center text-sm space-y-2">
      <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'" class="transition-colors duration-300">
        Datos obtenidos de PokéAPI • Total mostrados: {{ rowData.length }} Pokémon
      </p>
      <p v-if="favoritesPokemon.length > 0" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" class="font-medium">
        ⭐ {{ favoritesPokemon.length }} Pokémon en favoritos
      </p>
      <p v-if="rowData.length !== pokemonCount" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" class="text-xs">
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
import PokemonFavoritesTable from './assets/components/PokemonFavoritesTable.vue';

// Estados reactivos
const rowData = ref([]);
const favoritesPokemon = ref([]);
const loading = ref(false);
const pokemonCount = ref(10);
const isDarkMode = ref(false);

// Función para alternar tema oscuro
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

// Función para agregar Pokémon a favoritos
const addPokemonToFavorites = (pokemon) => {
  const exists = favoritesPokemon.value.some(fav => fav.id === pokemon.id);
  if (!exists) {
    favoritesPokemon.value.push(pokemon);
  }
};

// Función para quitar Pokémon de favoritos
const removePokemonFromFavorites = (pokemonId) => {
  favoritesPokemon.value = favoritesPokemon.value.filter(fav => fav.id !== pokemonId);
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

// Función para exportar a PDF
const exportToPDF = async () => {
  try {
    // Método 1: Intentar con import dinámico usando una URL diferente
    let jsPDF;
    let autoTable;
    
    try {
      // Importar jsPDF usando ES modules desde un CDN que soporte ES modules
      const jsPDFModule = await import('https://cdn.skypack.dev/jspdf@2.5.1');
      jsPDF = jsPDFModule.jsPDF;
      
      // Importar autoTable
      const autoTableModule = await import('https://cdn.skypack.dev/jspdf-autotable@3.5.31');
      autoTable = autoTableModule.default;
      
    } catch (importError) {
      console.log('Falló import ES6, intentando con UMD...');
      
      // Método 2: Fallback con UMD
      await loadJsPDFUMD();
      
      if (window.jsPDF) {
        jsPDF = window.jsPDF;
      } else {
        throw new Error('No se pudo cargar jsPDF');
      }
    }
    
    // Crear documento PDF
    const doc = new jsPDF();
    
    // Configuración del documento
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;
    
    // Título principal (sin emojis)
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Reporte de Pokemon', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Fecha
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const currentDate = new Date().toLocaleDateString('es-ES');
    doc.text(`Generado el: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Tabla de favoritos (si existe)
    if (favoritesPokemon.value.length > 0) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      // Reemplazar emoji por texto
      doc.text(`Pokemon Favoritos (${favoritesPokemon.value.length})`, 14, yPosition);
      yPosition += 10;
      
      const favoritesTableData = favoritesPokemon.value.map(pokemon => [
        pokemon.id,
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        pokemon.types.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', '),
        pokemon.abilities.map(ability => ability.charAt(0).toUpperCase() + ability.slice(1)).join(', ')
      ]);
      
      // Usar autoTable si está disponible, sino tabla manual
      if (doc.autoTable || (window.jsPDF && window.jsPDF.API && window.jsPDF.API.autoTable)) {
        doc.autoTable({
          startY: yPosition,
          head: [['ID', 'Nombre', 'Tipo(s)', 'Habilidades']],
          body: favoritesTableData,
          theme: 'striped',
          headStyles: { 
            fillColor: [255, 193, 7],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          alternateRowStyles: { fillColor: [255, 248, 220] },
          margin: { left: 14, right: 14 },
          styles: { fontSize: 9, cellPadding: 3 }
        });
        yPosition = doc.lastAutoTable.finalY + 20;
      } else {
        // Tabla manual sin autoTable
        yPosition = createManualTable(doc, favoritesTableData, ['ID', 'Nombre', 'Tipo(s)', 'Habilidades'], yPosition);
      }
    }
    
    // Verificar si necesitamos una nueva página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Tabla principal de todos los Pokémon
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    // Reemplazar emoji por texto
    doc.text(`Todos los Pokemon (${rowData.value.length})`, 14, yPosition);
    yPosition += 10;
    
    const allPokemonTableData = rowData.value.map(pokemon => [
      pokemon.id,
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      pokemon.types.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', '),
      pokemon.abilities.map(ability => ability.charAt(0).toUpperCase() + ability.slice(1)).join(', '),
      // Reemplazar emoji por texto
      favoritesPokemon.value.some(fav => fav.id === pokemon.id) ? 'Si' : 'No'
    ]);
    
    if (doc.autoTable || (window.jsPDF && window.jsPDF.API && window.jsPDF.API.autoTable)) {
      doc.autoTable({
        startY: yPosition,
        head: [['ID', 'Nombre', 'Tipo(s)', 'Habilidades', 'Favorito']],
        body: allPokemonTableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          4: { halign: 'center' }
        }
      });
    } else {
      // Tabla manual sin autoTable
      createManualTable(doc, allPokemonTableData, ['ID', 'Nombre', 'Tipo(s)', 'Habilidades', 'Favorito'], yPosition);
    }
    
    // Agregar pie de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(
        `Pagina ${i} de ${totalPages} - Datos obtenidos de PokeAPI`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Guardar el PDF
    const fileName = `pokemon-reporte-${currentDate.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
  }
};

// Función para cargar jsPDF con UMD (fallback)
const loadJsPDFUMD = () => {
  return new Promise((resolve, reject) => {
    if (window.jsPDF) {
      resolve();
      return;
    }
    
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
      script2.onload = () => {
        setTimeout(resolve, 100); // Dar tiempo para que se registren
      };
      script2.onerror = reject;
      document.head.appendChild(script2);
    };
    script1.onerror = reject;
    document.head.appendChild(script1);
  });
};

// Función para crear tabla manual (sin autoTable)
const createManualTable = (doc, data, headers, startY) => {
  let yPos = startY;
  const cellHeight = 8;
  const cellWidth = 35;
  
  // Headers
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  headers.forEach((header, index) => {
    doc.text(header, 14 + (index * cellWidth), yPos);
  });
  yPos += cellHeight;
  
  // Data rows
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  data.forEach((row) => {
    row.forEach((cell, index) => {
      const cellText = String(cell).length > 15 ? String(cell).substring(0, 15) + '...' : String(cell);
      doc.text(cellText, 14 + (index * cellWidth), yPos);
    });
    yPos += cellHeight;
    
    // Nueva página si es necesario
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  return yPos + 10;
};
// Función para cargar múltiples Pokémon
async function loadPokemon() {
  loading.value = true;
  rowData.value = [];
  // Mantener los favoritos al recargar
  
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