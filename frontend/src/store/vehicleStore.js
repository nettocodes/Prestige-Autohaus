import { defineStore } from "pinia";
import axios from "axios";

export const useVehicleStore = defineStore("vehicleStore", {
  state: () => ({
    vehicles: [],
  }),
  actions: {
    async fetchVehicles() {
      const { data } = await axios.get("/api/public/vehicles");
      this.vehicles = data;
    },
    getVehicleById(id) {
      return this.vehicles.find((vehicle) => vehicle.id === id);
    },
  },
});
