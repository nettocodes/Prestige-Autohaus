<template>
  <div class="vehicle-form-page">
    <div class="vehicle-form-container">
      <h2 class="vehicle-form-title">Adicionar Veículo</h2>
      <form @submit.prevent="addVehicle" enctype="multipart/form-data" class="vehicle-form">
        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Marca:</label>
          <select v-model="selectedMarca" @change="fetchModelos" required class="vehicle-form-select">
            <option value="" disabled>Selecione uma marca</option>
            <option v-for="marca in marcas" :key="marca.codigo" :value="marca.codigo">
              {{ marca.nome }}
            </option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Modelo:</label>
          <select v-model="selectedModelo" @change="fetchAnos" :disabled="!modelos.length" required class="vehicle-form-select">
            <option value="" disabled>Selecione um modelo</option>
            <option v-for="modelo in modelos" :key="modelo.codigo" :value="modelo.codigo">
              {{ modelo.nome }}
            </option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Ano:</label>
          <select v-model="selectedAno" required class="vehicle-form-select">
            <option value="" disabled>Selecione o ano</option>
            <option v-for="ano in anos" :key="ano.codigo" :value="ano.codigo">
              {{ ano.nome }}
            </option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Condição:</label>
          <select v-model="condicao" required class="vehicle-form-select">
            <option value="" disabled>Selecione a condição</option>
            <option value="Novo">Novo</option>
            <option value="Usado">Usado</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Preço:</label>
          <input v-model.number="preco" type="number" step="0.01" placeholder="Digite o preço" required class="vehicle-form-input" />
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Quilometragem:</label>
          <input v-model.number="quilometragem" type="number" placeholder="Digite a quilometragem" required class="vehicle-form-input" />
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Carroceria:</label>
          <select v-model="carroceria" required class="vehicle-form-select">
            <option value="" disabled>Selecione a carroceria</option>
            <option v-for="option in carroceriaOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Transmissão:</label>
          <select v-model="transmissao" required class="vehicle-form-select">
            <option value="" disabled>Selecione a transmissão</option>
            <option v-for="option in transmissaoOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Portas:</label>
          <select v-model="portas" required class="vehicle-form-select">
            <option value="" disabled>Selecione o número de portas</option>
            <option value="2">2 Portas</option>
            <option value="4">4 Portas</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Cor:</label>
          <input v-model="cor" placeholder="Cor" required class="vehicle-form-input" />
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Tipo de Tração:</label>
          <select v-model="driveType" required class="vehicle-form-select">
            <option value="" disabled>Selecione a tração</option>
            <option value="4x2">4x2</option>
            <option value="4x4">4x4</option>
            <option value="AWD">AWD</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Número de Cilindros:</label>
          <input v-model.number="cilindros" type="number" placeholder="Digite o número de cilindros" required class="vehicle-form-input" />
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Opcionais:</label>
          <div class="vehicle-form-checkbox-group">
            <div v-for="opcional in opcionaisDisponiveis" :key="opcional" class="vehicle-form-checkbox-item">
              <input type="checkbox" :value="opcional" v-model="opcionais" class="vehicle-form-checkbox" />
              <span>{{ opcional }}</span>
            </div>
          </div>
        </div>
        
        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Descrição:</label>
          <textarea v-model="descricao" placeholder="Digite a descrição" class="vehicle-form-textarea"></textarea>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Fotos:</label>
          <input type="file" multiple @change="handleFileUpload" accept="image/*" class="vehicle-form-file" />
          <Splide class="vehicle-form-thumbnails" :options="{ perPage: 3, pagination: false, gap: '1rem' }">
            <SplideSlide v-for="(foto, index) in previewFotos" :key="index">
              <img :src="foto" alt="Preview" class="vehicle-thumbnail" />
            </SplideSlide>
          </Splide>
        </div>

        <button type="submit" class="vehicle-form-button">Adicionar Veículo</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@/assets/VehicleAdd.css";

export default {
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      marcas: [],
      modelos: [],
      anos: [],
      selectedMarca: "",
      selectedModelo: "",
      selectedAno: "",
      preco: "",
      quilometragem: 0,
      carroceria: "",
      transmissao: "",
      portas: "",
      driveType: "",
      condicao: "",
      cilindros: 0,
      fotos: [],
      previewFotos: [],
      opcionais: [],
      opcionaisDisponiveis: ["Airbag", "Alarme", "Ar condicionado", "Bancos de couro"],
      carroceriaOptions: ["Hatch", "Sedan", "SUV"],
      transmissaoOptions: ["Manual", "Automática"],
    };
  },
  methods: {
    async fetchMarcas() {
      const response = await axios.get("https://parallelum.com.br/fipe/api/v1/carros/marcas");
      this.marcas = response.data;
    },
    async fetchModelos() {
      const response = await axios.get(
        `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.selectedMarca}/modelos`
      );
      this.modelos = response.data.modelos;
    },
    async fetchAnos() {
      const response = await axios.get(
        `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.selectedMarca}/modelos/${this.selectedModelo}/anos`
      );
      this.anos = response.data;
    },
    handleFileUpload(event) {
      const files = event.target.files;
      this.fotos = files;
      this.previewFotos = Array.from(files).map((file) => URL.createObjectURL(file));
    },
    async addVehicle() {
      const selectedMarcaNome = this.marcas.find((marca) => marca.codigo === this.selectedMarca)?.nome || "";
      const selectedModeloNome = this.modelos.find((modelo) => modelo.codigo === this.selectedModelo)?.nome || "";
      const selectedAnoNome = this.anos.find((ano) => ano.codigo === this.selectedAno)?.nome || "";

      const formData = new FormData();
      formData.append("marca", selectedMarcaNome);
      formData.append("modelo", selectedModeloNome);
      formData.append("ano", selectedAnoNome);
      formData.append("preco", this.preco);
      formData.append("quilometragem", this.quilometragem);
      formData.append("carroceria", this.carroceria);
      formData.append("transmissao", this.transmissao);
      formData.append("portas", this.portas);
      formData.append("cor", this.cor); // Incluindo a cor
      formData.append("descricao", this.descricao || ""); // Incluindo a descrição
      formData.append("driveType", this.driveType);
      formData.append("condicao", this.condicao);
      formData.append("cilindros", this.cilindros);
      formData.append("opcionais", this.opcionais.join(","));
      Array.from(this.fotos).forEach((file) => formData.append("fotos", file));

      try {
        await axios.post("http://localhost:5000/api/vehicles/add", formData);
        alert("Veículo adicionado com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao adicionar veículo.");
      }
    },

  },
  mounted() {
    this.fetchMarcas();
  },
};
</script>
