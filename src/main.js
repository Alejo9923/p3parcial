import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// --- COMIENZO DE LA ADICIÓN PARA AG GRID ---
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Registra el módulo de la comunidad de AG Grid una sola vez al inicio de la aplicación
ModuleRegistry.registerModules([AllCommunityModule]);
// --- FIN DE LA ADICIÓN PARA AG GRID ---

createApp(App).mount('#app')
