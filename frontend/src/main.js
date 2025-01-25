import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import AOS from "aos";
import "aos/dist/aos.css"; // Importa os estilos do AOS

// Importando as páginas
import AddVehicle from "@/components/pages/AddVehicle.vue";
import ViewVehicles from "@/components/pages/ViewVehicles.vue";
import FavoriteVehicles from "@/components/pages/FavoriteVehicles.vue";
import VehicleDetails from "@/components/pages/VehicleDetails.vue";
import LandingPage from "@/components/pages/LandingPage.vue";
import UserRegister from "@/components/pages/UserRegister.vue";
import UserLogin from "@/components/pages/UserLogin.vue";
import AdminPanel from "@/components/pages/AdminPanel.vue";
import ListVehicles from "@/components/pages/ListVehicles.vue";
import StatisticsPage from "@/components/pages/StatisticsPage.vue"; // Nova página de estatísticas

// Configuração de rotas
const routes = [
  { path: "/", component: LandingPage }, // Rota inicial renderiza a LandingPage
  { path: "/add", component: AddVehicle },
  { path: "/edit/:id", component: AddVehicle, props: true }, // Rota para editar veículos
  { path: "/view", component: ViewVehicles },
  { path: "/favorites", component: FavoriteVehicles },
  { path: "/details/:id", component: VehicleDetails, props: true },
  { path: "/register", component: UserRegister }, // Rota de registro
  { path: "/login", component: UserLogin }, // Rota de login
  { path: "/admin", component: AdminPanel },
  { path: "/list", component: ListVehicles },
  { path: "/statistics", component: StatisticsPage }, // Rota de estatísticas
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
