<template>
  <div class="statistics-page">
    <h1>Estatísticas dos Veículos</h1>

    <div class="filters">
      <button v-for="(filterName, filterKey) in filters" :key="filterKey" @click="applyFilter(filterKey)">
        {{ filterName }}
      </button>
    </div>

    <div v-if="loading" class="loading-message">Carregando dados...</div>

    <div class="event-container" v-if="Object.keys(groupedStats).length > 0">
      <div v-for="(eventStats, eventType) in groupedStats" :key="eventType">
        <h2>{{ eventType }}</h2>
        <div class="chart-style">
          <div
            v-for="(vehicle, index) in eventStats"
            :key="index"
            class="chart-bar"
          >
          <div class="bar" :style="{ height: `${vehicle.scaledHeight}px` }">
            <img
              :src="vehicle.fotos[0] ? `/api/uploads/${vehicle.fotos[0]}` : '/placeholder.jpg'"
              alt="Vehicle Image"
              class="bar-image"
            />
          </div>

            <div class="bar-label">
              <span>{{ vehicle.modelo }}</span>
              <small>{{ vehicle.eventCount }} evento(s)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else-if="!loading" class="no-data-message">Nenhum dado encontrado para o intervalo selecionado.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "StatisticsPage",
  data() {
    return {
      statistics: [],
      vehicles: [],
      groupedStats: {},
      filters: {
        today: "Hoje",
        yesterday: "Ontem",
        thisWeek: "Esta Semana",
        lastWeek: "Semana Passada",
        last15Days: "Últimos 15 Dias",
        lastMonth: "Último Mês",
        last3Months: "Últimos 3 Meses",
        last6Months: "Últimos 6 Meses",
        lastYear: "Último Ano",
      },
      loading: false,
    };
  },
  methods: {
    async fetchVehicles() {
      try {
        const vehiclesResponse = await axios.get("/api/vehicles");
        this.vehicles = vehiclesResponse.data.map((vehicle) => {
          try {
            if (typeof vehicle.fotos === "string") {
              const fixedFotos = vehicle.fotos.replace(/'/g, '"');
              vehicle.fotos = JSON.parse(fixedFotos || "[]");
            }
            if (!Array.isArray(vehicle.fotos)) {
              vehicle.fotos = [];
            }
          } catch (error) {
            vehicle.fotos = [];
          }
          return vehicle;
        });
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      }
    },
    groupStatistics() {
      const maxBarHeight = 400; // Altura máxima para o gráfico

      const vehicleMap = this.vehicles.reduce((map, vehicle) => {
        map[vehicle.id] = vehicle;
        return map;
      }, {});

      const grouped = this.statistics.reduce((acc, stat) => {
        const eventType = stat.event;
        const vehicle = vehicleMap[stat.vehicle_id];
        if (!vehicle) return acc;

        if (!acc[eventType]) acc[eventType] = [];

        const existingVehicle = acc[eventType].find((v) => v.id === vehicle.id);
        if (existingVehicle) {
          existingVehicle.eventCount += 1;
        } else {
          acc[eventType].push({ ...vehicle, eventCount: 1 });
        }

        return acc;
      }, {});

      Object.keys(grouped).forEach((eventType) => {
        const maxEvents = Math.max(...grouped[eventType].map((v) => v.eventCount));

        grouped[eventType] = grouped[eventType].map((vehicle) => {
          const scaledHeight = (vehicle.eventCount / maxEvents) * maxBarHeight;
          return { ...vehicle, scaledHeight };
        });
      });

      this.groupedStats = grouped;
    },

    async applyFilter(filterKey) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/statistics/filter/${filterKey}`);
        this.statistics = response.data;
        this.groupStatistics();
      } catch (error) {
        console.error("Erro ao buscar estatísticas filtradas:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    await this.fetchVehicles();
    await this.applyFilter("today"); // Seleciona "hoje" automaticamente ao carregar
  },
};
</script>


<style>
.statistics-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.statistics-page h1 {
  font-size: 2.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.filters button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.filters button:focus {
  outline: none;
  box-shadow: 0 0 5px #3498db;
}

.event-container {
  margin-top: 20px;
}

.event-container h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #34495e;
}

.chart-style {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 15px;
  padding: 20px;
  background-color: #ecf0f1;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 400px; /* Altura máxima para o gráfico */
  overflow-y: auto; /* Caso haja muitas barras */
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
}

.bar {
  width: 70px;
  background: linear-gradient(135deg, #8e44ad, #3498db);
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  transition: transform 0.3s ease;
  max-height: 250px; /* Altura máxima */
}


.bar[data-scaled-height] {
  height: var(--scaled-height);
  max-height: 400px; /* Altura máxima para a barra */
}

.bar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.bar-image {
  width: 100%;
  height: auto;
  max-height: 70px;
  object-fit: contain;
}

.bar-label {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #555;
  display: flex;
  flex-direction: column;
}

.bar-label span {
  font-weight: bold;
  color: #2c3e50;
  white-space: nowrap; /* Impede quebra de linha */
  overflow: hidden; /* Esconde o excesso de texto */
  text-overflow: ellipsis; /* Adiciona reticências (...) no final do texto */
  max-width: 100px; /* Define um limite de largura para o texto */
  display: block;
  text-align: center;
}


.bar-label small {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.loading-message {
  text-align: center;
  color: #7f8c8d;
  font-size: 1.2rem;
  padding: 20px 0;
}

.no-data-message {
  text-align: center;
  color: #e74c3c;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
}

/* Responsividade */
@media (max-width: 768px) {
  .chart-style {
    gap: 10px;
  }

  .bar {
    width: 50px; /* Ajusta largura para telas menores */
  }
  .bar-label span {
    max-width: 80px; /* Reduz a largura do texto em telas menores */
  }

  .filters button {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
}

</style>
