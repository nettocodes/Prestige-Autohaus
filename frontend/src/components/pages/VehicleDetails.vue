<template>
  <div class="details-page">
    <div class="details-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/">Home</router-link> / Listings / {{ vehicle?.modelo || "Loading..." }}
      </nav>

      <!-- Verificação se os detalhes do veículo estão disponíveis -->
      <div v-if="vehicle" class="vehicle-details-container">
        <!-- Galeria de Imagens -->
        <div class="vehicle-gallery">
          <Splide :options="mainOptions" ref="mainCarousel">
            <SplideSlide
              v-for="(foto, index) in vehicle.fotos || []"
              :key="index"
              class="splide-slide"
              @click="openZoom(foto)"
            >
              <img :src="`https://prestige-backend.up.railway.app/uploads/${foto}`" alt="Vehicle photo" />
            </SplideSlide>
          </Splide>
        </div>

        <!-- Detalhes do veículo ao lado -->
        <div class="vehicle-main-info">
          <div class="vehicle-title">
            <h1>{{ vehicle.marca || "Marca não informada" }} {{ vehicle.modelo || "Modelo não informado" }}</h1>
            <p class="subtitle">{{ vehicle.descricao || "Explore mais detalhes sobre este veículo." }}</p>
          </div>
          <div class="price-section">
            <h2>R$ {{ Math.floor(vehicle.preco || 0).toLocaleString("pt-BR") }}</h2>
          </div>
          <div class="tags">
            <span class="tag">{{ vehicle.ano || "Ano não informado" }}</span>
            <span class="tag">{{ vehicle.transmissao || "Transmissão não informada" }}</span>
            <span class="tag">{{ vehicle.combustivel || "Combustível não informado" }}</span>
          </div>
          <div class="contact-buttons">
            <a
              :href="`https://wa.me/47997486918?text=${encodeURIComponent(`Olá, estou interessado no veículo ${vehicle.marca} ${vehicle.modelo}`)}`"
      target="_blank"
              class="whatsapp-btn"
            >
              <img src="@/assets/images/icons/whatsapp.png" alt="WhatsApp Icon" class="whatsapp-icon" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Resumo do Veículo -->
      <div v-if="vehicle" class="vehicle-overview">
        <h2>Visão geral</h2>
        <div class="details-grid">
          <div><strong>Carroceria:</strong> {{ vehicle.carroceria || "Não informado" }}</div>
          <div><strong>Condição:</strong> {{ vehicle.condicao || "Não informado" }}</div>
          <div><strong>Quilometragem:</strong> {{ vehicle.quilometragem?.toLocaleString() || "0" }} Km</div>
          <div><strong>Combustível:</strong> {{ vehicle.combustivel || "Não informado" }}</div>
          <div><strong>Portas:</strong> {{ vehicle.portas || "Não informado" }}</div>
          <div><strong>Cor:</strong> {{ vehicle.cor || "Não informado" }}</div>
          <div><strong>Tipo de Drive:</strong> {{ vehicle.driveType || "Não informado" }}</div>
          <div><strong>Cilindros:</strong> {{ vehicle.cilindros || "Não informado" }}</div>
          <div><strong>Opcionais:</strong>
            <span v-if="vehicle.opcionais.length">
              {{ vehicle.opcionais.join(", ") }}
            </span>
            <span v-else>Não informado</span>
          </div>
        </div>
      </div>

      <!-- Modal de Zoom -->
      <div v-if="zoomImage" class="zoom-modal" @click="closeZoom">
        <div
          class="zoom-container"
          @mousemove="handleMouseMove"
          @mouseleave="resetZoom"
        >
          <img
            ref="zoomedImage"
            :src="`https://prestige-backend.up.railway.app/uploads/${zoomImage}`"
            alt="Zoomed image"
          />
          <div
            class="zoom-lens"
            :style="{ top: lensPosition.y + 'px', left: lensPosition.x + 'px' }"
          ></div>
          <div
            class="zoom-result"
            :style="{
              backgroundImage: `url(https://prestige-backend.up.railway.app/uploads/${zoomImage})`,
              backgroundPosition: zoomBackgroundPosition,
            }"
          ></div>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import axios from "axios";
import "@splidejs/vue-splide/css";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@/assets/VehicleDetails.css";

export default {
  name: "VehicleDetails",
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      vehicle: null,
      zoomImage: null, // Controla a imagem exibida no modal
      lensPosition: { x: 0, y: 0 }, // Posição do quadrado de zoom
      zoomBackgroundPosition: "0% 0%",
      isZoomEnabled: false,
      mainOptions: {
        type: "loop",
        height: "500px", // Define a altura fixa dos slides
        width: "500px", // Define a largura fixa dos slides
        pagination: true,
        arrows: true,
        autoplay: true,
        interval: 4000,
        cover: true,
      },

    };
  },
  methods: {
    async fetchVehicleDetails() {
      const vehicleId = this.$route.params.id;
      const sessionId = this.getSessionId();

      try {
        console.log(`Buscando detalhes do veículo ID: ${vehicleId}`);

        // Obter detalhes do veículo
        const response = await axios.get(`https://prestige-backend.up.railway.app/api/vehicles/${vehicleId}`);
        this.vehicle = response.data;

        // Registrar visualização se ainda não foi registrada na sessão
        const viewedVehicles = JSON.parse(localStorage.getItem("viewedVehicles")) || [];
        if (!viewedVehicles.includes(vehicleId)) {
          await this.registerView(vehicleId, sessionId);
          viewedVehicles.push(vehicleId);
          localStorage.setItem("viewedVehicles", JSON.stringify(viewedVehicles));
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes do veículo:", err.message);
        if (err.response) {
          console.error("Detalhes do erro:", err.response.data);
        }
      }
    },
    openZoom(image) {
      this.zoomImage = image; // Define a imagem para exibir no modal
    },
    closeZoom() {
      this.zoomImage = null; // Fecha o modal
    },
    handleMouseMove(event) {
      if (!this.isZoomEnabled) return;

      const zoomContainer = event.currentTarget;
      const rect = zoomContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calcula a posição do quadrado de zoom (ampliação maior)
      const lensX = Math.max(0, Math.min(x - 75, rect.width - 150)); // Aumenta a área visível
      const lensY = Math.max(0, Math.min(y - 75, rect.height - 150));

      // Calcula a posição de fundo da área ampliada
      const backgroundX = (x / rect.width) * 100;
      const backgroundY = (y / rect.height) * 100;

      // Atualiza as propriedades
      this.lensPosition = { x: lensX, y: lensY };
      this.zoomBackgroundPosition = `${backgroundX}% ${backgroundY}%`;
    },

    resetZoom() {
      // Reseta o estado do zoom quando o mouse sai do container
      this.lensPosition = { x: 0, y: 0 };
      this.zoomBackgroundPosition = "0% 0%";
    },
    checkZoomAvailability() {
      // Ativa/desativa o zoom dinâmico baseado na largura da tela
      this.isZoomEnabled = window.matchMedia("(min-width: 768px)").matches;
    },
    async registerView(vehicleId, sessionId) {
      if (!vehicleId || !sessionId) {
        console.error("Erro: vehicleId ou sessionId ausentes.");
        return;
      }

      try {
        console.log("Registrando visualização...");
        const response = await axios.post("https://prestige-backend.up.railway.app/api/statistics/views", { vehicleId, sessionId });
        console.log(`Visualização registrada com sucesso para o veículo ID: ${vehicleId}`, response.data);
      } catch (err) {
        console.error("Erro ao registrar visualização:", err.message);
        if (err.response) {
          console.error("Detalhes do erro:", err.response.data);
        }
      }
    },
    async handleContactClick() {
      const sessionId = this.getSessionId();

      try {
        console.log("Registrando clique em contato...");
        await axios.post("https://prestige-backend.up.railway.app/api/statistics/contact-clicks", { sessionId });
        console.log("Clique em contato registrado com sucesso.");
      } catch (err) {
        console.error("Erro ao registrar clique em contato:", err.message);
        if (err.response) {
          console.error("Detalhes do erro:", err.response.data);
        }
      }
    },
    getSessionId() {
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2);
        localStorage.setItem("sessionId", sessionId);
      }
      return sessionId;
    },
  },
  mounted() {
    console.log("Componente VehicleDetails montado.");
    this.fetchVehicleDetails();
    this.checkZoomAvailability();
    window.addEventListener("resize", this.checkZoomAvailability);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkZoomAvailability);
  },
};
</script>
