import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

// Importando as páginas
import AddVehicle from "@/components/pages/AddVehicle.vue";
import ViewVehicles from "@/components/pages/ViewVehicles.vue";
import FavoriteVehicles from "@/components/pages/FavoriteVehicles.vue";
import VehicleDetails from "@/components/pages/VehicleDetails.vue";
import LandingPage from "@/components/pages/LandingPage.vue";
import StatisticsPanel from "@/components/pages/StatisticsPanel.vue";
import UserRegister from "@/components/pages/UserRegister.vue";
import UserLogin from "@/components/pages/UserLogin.vue";

// Configuração de rotas
const routes = [
  { path: "/", component: LandingPage }, // Rota inicial renderiza a LandingPage
  { path: "/add", component: AddVehicle },
  { path: "/edit/:id", component: AddVehicle, props: true }, // Rota para editar veículos
  { path: "/view", component: ViewVehicles },
  { path: "/favorites", component: FavoriteVehicles },
  { path: "/details/:id", component: VehicleDetails, props: true },
  { path: "/statistics", component: StatisticsPanel },
  { path: "/register", component: UserRegister  }, // Rota de registro
  { path: "/login", component: UserLogin  }, // Rota de login
  { path: "/:pathMatch(.*)*", redirect: "/" }, // Redireciona URLs inválidas para a landing page
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Criar a aplicação Vue
const app = createApp(App);

// Usar o roteador
app.use(router);

// Montar a aplicação no DOM
app.mount("#app");
