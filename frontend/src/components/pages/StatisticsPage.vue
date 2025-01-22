<template>
  <div class="statistics-page">
    <h1>Estatísticas dos Veículos</h1>

    <div class="filters">
      <label for="start-date">Data Inicial:</label>
      <input type="date" id="start-date" v-model="startDate" />

      <label for="end-date">Data Final:</label>
      <input type="date" id="end-date" v-model="endDate" />

      <button @click="filterStatistics">Filtrar</button>
    </div>

    <div class="event-container" v-for="(eventStats, eventType) in groupedStats" :key="eventType">
      <h2>{{ eventType }}</h2>
      <div class="chart-container">
        <canvas :id="`chart-${eventType}`"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { nextTick } from "vue";

Chart.register(...registerables);

export default {
  name: "StatisticsPage",
  data() {
    return {
      statistics: [],
      vehicles: [],
      groupedStats: {},
      startDate: "",
      endDate: "",
      charts: {},
    };
  },
  methods: {
    async fetchStatistics() {
      try {
        const statsResponse = await axios.get(
          "http://localhost:8080/api/statistics"
        );
        this.statistics = statsResponse.data;
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    },
    async fetchVehicles() {
      try {
        const vehiclesResponse = await axios.get(
          "http://localhost:8080/api/vehicles"
        );
        this.vehicles = vehiclesResponse.data.map((vehicle) => {
          try {
            if (typeof vehicle.fotos === "string") {
              const fixedFotos = vehicle.fotos.replace(/'/g, '"');
              vehicle.fotos = JSON.parse(fixedFotos || "[]");
            }

            if (!Array.isArray(vehicle.fotos)) {
              console.error(
                `Fotos não é um array para o veículo ID ${vehicle.id}`
              );
              vehicle.fotos = [];
            }
          } catch (error) {
            console.error(
              `Erro ao parsear fotos para o veículo ID ${vehicle.id}:`,
              error
            );
            vehicle.fotos = [];
          }
          return vehicle;
        });
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      }
    },
    groupStatistics() {
      const vehicleMap = this.vehicles.reduce((map, vehicle) => {
        map[vehicle.id] = vehicle;
        return map;
      }, {});

      const grouped = this.statistics.reduce((acc, stat) => {
        const eventType = stat.event;
        const vehicle = vehicleMap[stat.vehicle_id];
        if (!vehicle) return acc;

        if (!acc[eventType]) acc[eventType] = [];

        const existingVehicle = acc[eventType].find(
          (v) => v.id === vehicle.id
        );
        if (existingVehicle) {
          existingVehicle.eventCount += 1;
        } else {
          acc[eventType].push({ ...vehicle, eventCount: 1 });
        }

        acc[eventType].sort((a, b) => b.eventCount - a.eventCount);

        return acc;
      }, {});

      this.groupedStats = grouped;
      this.renderCharts();
    },
    filterStatistics() {
      if (!this.startDate || !this.endDate) {
        alert("Por favor, selecione um intervalo de datas válido.");
        return;
      }

      const filteredStats = this.statistics.filter((stat) => {
        const timestamp = new Date(stat.timestamp);
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        return timestamp >= start && timestamp <= end;
      });

      this.statistics = filteredStats;
      this.groupStatistics();
    },
    renderCharts() {
      nextTick(() => {
        Object.keys(this.groupedStats).forEach((eventType) => {
          const canvas = document.getElementById(`chart-${eventType}`);
          if (!canvas) {
            console.error(`Canvas for eventType "${eventType}" not found.`);
            return;
          }

          const ctx = canvas.getContext("2d");
          if (this.charts[eventType]) {
            this.charts[eventType].destroy();
          }

          const data = this.groupedStats[eventType].map(
            (vehicle) => vehicle.eventCount
          );
          const labels = this.groupedStats[eventType].map(
            (vehicle) => `${vehicle.marca} ${vehicle.modelo}`
          );
          const images = this.groupedStats[eventType].map(
            (vehicle) => vehicle.fotos[0]
          );

          const patterns = images.map((image) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = image ? `/api/uploads/${image}` : "/placeholder.jpg";
              img.onload = () => {
                const patternCanvas = document.createElement("canvas");
                const size = 100; // Tamanho ajustável do padrão
                patternCanvas.width = size;
                patternCanvas.height = size;

                const patternCtx = patternCanvas.getContext("2d");
                patternCtx.drawImage(img, 0, 0, size, size);

                const pattern = ctx.createPattern(patternCanvas, "repeat");
                resolve(pattern);
              };
              img.onerror = () => {
                resolve("rgba(200, 200, 200, 0.5)"); // Fallback para cor sólida
              };
            });
          });

          Promise.all(patterns).then((backgroundPatterns) => {
            this.charts[eventType] = new Chart(ctx, {
              type: "bar",
              data: {
                labels,
                datasets: [
                  {
                    data,
                    backgroundColor: backgroundPatterns,
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    ticks: {
                      font: {
                        size: 12,
                      },
                      maxRotation: 45,
                      minRotation: 0,
                    },
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                  },
                },
                animation: false, // Sem animação para evitar problemas de atualização
              },
            });
          });
        });
      });
    },
  },
  async created() {
    await this.fetchStatistics();
    await this.fetchVehicles();
    this.groupStatistics();
  },
};
</script>

<style>
.statistics-page {
  padding: 20px;
}
.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
.event-container {
  margin-bottom: 40px;
}
.chart-container {
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
  height: 400px;
  position: relative;
}
canvas {
  border-radius: 8px;
}
.statistics-page h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}
.filters {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
