import "@splidejs/splide/dist/css/splide.min.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import AOS from "aos";
import "aos/dist/aos.css"; // Importa os estilos do AOS

// Configuração de rotas com importação dinâmica (lazy loading)
const routes = [
  { path: "/", component: () => import("@/components/pages/LandingPage.vue") }, // Rota inicial renderiza a LandingPage
  { path: "/add", component: () => import("@/components/pages/AddVehicle.vue") },
  { path: "/edit/:id", component: () => import("@/components/pages/AddVehicle.vue"), props: true }, // Rota para editar veículos
  { path: "/view", component: () => import("@/components/pages/ViewVehicles.vue") },
  { path: "/favorites", component: () => import("@/components/pages/FavoriteVehicles.vue") },
  { path: "/details/:id", component: () => import("@/components/pages/VehicleDetails.vue"), props: true },
  { path: "/register", component: () => import("@/components/pages/UserRegister.vue") }, // Rota de registro
  { path: "/login", component: () => import("@/components/pages/UserLogin.vue") }, // Rota de login
  { path: "/admin", component: () => import("@/components/pages/AdminPanel.vue") },
  { path: "/list", component: () => import("@/components/pages/ListVehicles.vue") },
  { path: "/statistics", component: () => import("@/components/pages/StatisticsPage.vue") }, // Rota de estatísticas
  { path: "/:pathMatch(.*)*", redirect: "/" }, // Redireciona URLs inválidas para a landing page
];

// Configurando o roteador
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Criar a aplicação Vue
const app = createApp(App);

// Configurar o AOS
AOS.init({
  duration: 1000, // Duração das animações em ms
  once: true, // Anima apenas na primeira vez que o elemento aparece
  offset: 120, // Distância antes de o elemento entrar na viewport
});

// Atualizar o AOS sempre que uma nova rota for carregada
router.afterEach(() => {
  AOS.refresh();
});

// Usar o roteador
app.use(router);

// Montar a aplicação no DOM
app.mount("#app");
