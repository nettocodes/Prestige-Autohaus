import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import VehicleDetails from "../pages/VehicleDetails.vue";
import AdminLogin from "../pages/AdminLogin.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/vehicle/:id", component: VehicleDetails },
  { path: "/admin/login", component: AdminLogin },
  { path: "/admin", component: AdminDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
