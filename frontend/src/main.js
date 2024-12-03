import { createApp } from 'vue'; // Corrigido para Vue 3
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Favorites from './components/FavoriteVehicles.vue';

import AddVehicle from './components/AddVehicle.vue';
import ViewVehicles from './components/ViewVehicles.vue';

// Configuração de rotas
const routes = [
    { path: '/add', component: AddVehicle },
    { path: '/view', component: ViewVehicles },
    { path: '/favorites', component: Favorites },
];

const router = createRouter({
    history: createWebHistory(), // URLs amigáveis
    routes,
});

// Criar a aplicação Vue
const app = createApp(App);

// Usar o roteador
app.use(router);

// Montar a aplicação
app.mount('#app');
