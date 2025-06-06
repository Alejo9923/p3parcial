# 🧩 Pokédex Web App - Vue 3 + Vite + Tailwind + AG Grid

Una Pokédex moderna construida con Vue 3, Tailwind CSS y AG Grid. Permite buscar, explorar y exportar datos de Pokémon de forma interactiva, con soporte para favoritos, búsqueda avanzada y modo oscuro.

## 🙍‍♀️🙍‍♂️ Integrantes
- Alejandro Solalinde
- Milagros Acosta
- Elias Elizeche
- Nilson Casco

---

## 🧠 Descripción General

Esta Pokédex consume datos desde [PokéAPI](https://pokeapi.co/) y presenta la información en una tabla avanzada, permitiendo:

- Buscar Pokémon por nombre, tipo o habilidad
- Marcar y gestionar favoritos
- Ver información organizada en una tabla interactiva
- Exportar los resultados a un archivo PDF
- Cambiar entre tema claro y oscuro con persistencia

---

## 🚀 Instalación y Uso

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/pokedex-vue-aggrid.git
cd pokedex-vue-aggrid
```
### 2. Instala dependencias
```bash
npm install
```
### 3. Ejecuta el proyecto
```bash
npm run dev
```
### 4. Compila para producción
```bash
npm run build
```
---

## ⚙️ Tecnologías Utilizadas
| Tecnología              | Propósito                     |
| ----------------------- | ----------------------------- |
| Vue 3 + Composition API | Framework principal           |
| Vite                    | Bundler rápido de desarrollo  |
| Tailwind CSS            | Estilado moderno y responsivo |
| AG Grid                 | Tabla interactiva             |
| jsPDF + AutoTable       | Exportación a PDF             |
| PokéAPI                 | Fuente de datos               |

---

## 🔍 Funcionalidades Principales
- 🔎 Búsqueda avanzada por nombre, tipo o habilidad

- 📋 Tabla con AG Grid: ordenable, filtrable, paginada

- ⭐ Favoritos: marcar/desmarcar y ver separados

- 🌗 Tema oscuro: se aplica a toda la UI y la tabla

- 📄 Exportación a PDF de Pokémon cargados + favoritos

- 📦 Carga dinámica de cantidad configurable de Pokémon

---

## 🧱 Estructura del Proyecto
```bash
📁 src/
 ┣ 📂assets/
 ┃ ┣ 📄 AppHeader.vue
 ┃ ┣ 📄 PokemonSearch.vue
 ┃ ┣ 📄 PokemonTable.vue
 ┃ ┗ 📄 PokemonFavoritesTable.vue
 ┣ 📄 App.vue
 ┣ 📄 main.js
```

---

## 🧠 Descripción de Componentes
### App.vue
- 📦 Componente raíz que orquesta toda la lógica

- 🔁 Carga datos desde PokéAPI

- 🌓 Controla el estado global: tema, favoritos, carga

- 📄 Exporta la información a PDF (jsPDF + autoTable)
### AppHeader.vue
- 🎛 Contiene el título y botón de cambio de tema oscuro

- 🌓 Emite evento para alternar isDarkMode
### PokemonSearch.vue
- 🔍 Input de búsqueda + selector de tipo y habilidad

- 🔁 Lógica debounced para evitar múltiples peticiones

- 🔗 Emite addPokemon al encontrar un resultado válido
### PokemonTable.vue
- 📋 Muestra los Pokémon en una tabla AG Grid

- ⭐ Permite agregar/quitar favoritos desde la tabla

- ⚙️ Soporta paginación automática según cantidad

### PokemonFavoritesTable.vue
- ⭐ Muestra solo los Pokémon marcados como favoritos

- ❌ Permite remover desde esta sección

---

## 📄 Exportación a PDF
- ✅ Incluye dos tablas en el PDF:

- 📝 Muestra nombre, tipo(s), habilidades, favorito

- 🗓 Agrega fecha, número de página y pie informativo

- 🌐 Usa jsPDF + autoTable, con fallback UMD por CDN

---

##  🎨 Modo Oscuro
- 🌗 Controlado globalmente por isDarkMode

- 📋 AG Grid tiene estilos personalizados para modo oscuro

- 🎛 Aplicado dinámicamente a fondo, texto, inputs y botones

- 🎨 Transiciones suaves con Tailwind transition-colors

---

## 🧪 Consideraciones Adicionales
- 📶 Las llamadas a PokéAPI están optimizadas con Promise.all

- 🧼 Validación básica para evitar duplicados en favoritos

- ⚠️ jsPDF se importa dinámicamente solo al exportar

- 📱 Diseño responsivo con Tailwind y clases condicionales
