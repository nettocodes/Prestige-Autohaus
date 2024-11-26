import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: null,
  }),
  actions: {
    async login(credentials) {
      const { data } = await axios.post("/api/admin/login", credentials);
      this.token = data.token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    },
  },
});
