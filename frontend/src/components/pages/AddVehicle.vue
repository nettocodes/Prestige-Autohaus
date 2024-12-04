<template>
  <div>
    <!-- Utilizando os componentes AppHeader e AppFooter -->
    <AppHeader />
    <div class="form-container">
      <h2>Adicionar Veículo</h2>
      <form @submit.prevent="addVehicle" enctype="multipart/form-data">
        <!-- Marca -->
        <label>Marca:</label>
        <select v-model="selectedMarca" @change="fetchModelos" required>
          <option value="" disabled>Selecione uma marca</option>
          <option v-for="marca in marcas" :key="marca.codigo" :value="marca.codigo">
            {{ marca.nome }}
          </option>
        </select>

        <!-- Modelo -->
        <label>Modelo:</label>
        <select v-model="selectedModelo" @change="fetchAnos" :disabled="!modelos.length" required>
          <option value="" disabled>Selecione um modelo</option>
          <option v-for="modelo in modelos" :key="modelo.codigo" :value="modelo.codigo">
            {{ modelo.nome }}
          </option>
        </select>

        <!-- Ano -->
        <label>Ano:</label>
        <select v-model="selectedAno" @change="fetchPreco" :disabled="!anos.length" required>
          <option value="" disabled>Selecione o ano</option>
          <option v-for="ano in anos" :key="ano.codigo" :value="ano.codigo">
            {{ ano.nome }}
          </option>
        </select>

        <!-- Preço -->
        <label>Preço (Definido pelo Usuário):</label>
        <input v-model.number="preco" type="number" step="0.01" placeholder="Digite o preço" required />

        <!-- Quilometragem -->
        <label>Quilometragem:</label>
        <input v-model.number="quilometragem" type="number" placeholder="Digite a quilometragem" required />

        <!-- Carroceria -->
        <label>Carroceria:</label>
        <select v-model="carroceria" required>
          <option value="" disabled>Selecione a carroceria</option>
          <option v-for="option in carroceriaOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- Transmissão -->
        <label>Transmissão:</label>
        <select v-model="transmissao" required>
          <option value="" disabled>Selecione a transmissão</option>
          <option v-for="option in transmissaoOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- Cor -->
        <label>Cor:</label>
        <input v-model="cor" placeholder="Cor" required />

        <!-- Descrição -->
        <label>Descrição:</label>
        <textarea v-model="descricao" placeholder="Descrição" required></textarea>

        <!-- Opcionais -->
        <label>Opcionais:</label>
        <div v-for="opcional in opcionaisDisponiveis" :key="opcional">
          <input type="checkbox" :value="opcional" v-model="opcionais" />
          {{ opcional }}
        </div>

        <!-- Fotos -->
        <label>Fotos:</label>
        <input type="file" multiple @change="handleFileUpload" accept="image/*" />

        <!-- Botão de Adicionar -->
        <button type="submit">Adicionar Veículo</button>
      </form>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import "@/assets/VehicleAdd.css"; // Corrigido para o caminho absoluto

import axios from "axios";

export default {
  name: "AddVehicle",
  components: {
    AppHeader,
    AppFooter,
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
      cor: "",
      descricao: "",
      carroceria: "",
      transmissao: "",
      opcionais: [],
      fotos: [],
      opcionaisDisponiveis: [
        "Airbag","Alarme","Ar condicionado","Ar quente","Banco com regulagem de altura","Bancos dianteiros com aquecimento","Bancos em couro","Capota marítima","CD e mp3 player","CD player","Computador de bordo","Controle automático de velocidade","Controle de tração","Desembaçador traseiro","Direção hidráulica","Disqueteira","DVD player","Encosto de cabeça traseiro","Farol de xenônio","Freio abs","GPS","Limpador traseiro","Protetor de caçamba","Rádio","Rádio e toca fitas","Retrovisor fotocrômico","Retrovisores elétricos","Rodas de liga leve","Sensor de chuva","Sensor de estacionamento","Teto solar","Tração 4x4","Travas elétricas","Vidros elétricos","Volante com regulagem de altura"],

      carroceriaOptions: ["Hatch", "Sedan", "SUV", "Picape", "Conversível"],
      transmissaoOptions: ["Manual", "Automática", "CVT", "Automatizada"],
    };
  },
  methods: {
    async fetchMarcas() {
      try {
        const response = await axios.get("https://parallelum.com.br/fipe/api/v1/carros/marcas");
        this.marcas = response.data;
      } catch (err) {
        console.error("Erro ao buscar marcas:", err);
      }
    },
    async fetchModelos() {
      if (!this.selectedMarca) return;
      try {
        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.selectedMarca}/modelos`
        );
        this.modelos = response.data.modelos;
        this.anos = [];
        this.selectedModelo = "";
        this.selectedAno = "";
        this.preco = "";
      } catch (err) {
        console.error("Erro ao buscar modelos:", err);
      }
    },
    async fetchAnos() {
      if (!this.selectedModelo) return;
      try {
        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.selectedMarca}/modelos/${this.selectedModelo}/anos`
        );
        this.anos = response.data;
        this.selectedAno = "";
        this.preco = "";
      } catch (err) {
        console.error("Erro ao buscar anos:", err);
      }
    },
    handleFileUpload(event) {
      this.fotos = event.target.files;
    },
    async addVehicle() {
      const formData = new FormData();
      const marcaSelecionada = this.marcas.find((marca) => marca.codigo === this.selectedMarca);
      const modeloSelecionado = this.modelos.find((modelo) => modelo.codigo === this.selectedModelo);

      formData.append("marca", marcaSelecionada.nome);
      formData.append("modelo", modeloSelecionado.nome);
      formData.append("ano", this.selectedAno);
      formData.append("preco", this.preco);
      formData.append("quilometragem", this.quilometragem);
      formData.append("carroceria", this.carroceria);
      formData.append("transmissao", this.transmissao);
      formData.append("descricao", this.descricao);
      formData.append("opcionais", this.opcionais.join(","));
      formData.append("fotos", this.fotos);

      try {
        await axios.post("http://localhost:5000/api/vehicles/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Vehicle added successfully!");
        this.resetForm();
      } catch (err) {
        alert("Error adding vehicle.");
        console.error(err);
      }
    },
    resetForm() {
      this.selectedMarca = "";
      this.modelos = [];
      this.anos = [];
      this.selectedModelo = "";
      this.selectedAno = "";
      this.preco = "";
      this.quilometragem = 0;
      this.carroceria = "";
      this.transmissao = "";
      this.cor = "";
      this.descricao = "";
      this.opcionais = [];
      this.fotos = [];
    },
  },
  mounted() {
    this.fetchMarcas();
  },
};
</script>
