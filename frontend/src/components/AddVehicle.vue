<template>
    <div>
      <h2>Add Vehicle</h2>
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
        <label>Preço (Tabela FIPE):</label>
        <input v-model="preco" type="text" readonly />
  
        <!-- Preço Definido pelo Usuário -->
        <label>Preço (Definido pelo Usuário):</label>
        <input v-model.number="preco" type="number" step="0.01" placeholder="Digite o preço" required />

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
        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  </template>
  
  
  <script>
import axios from "axios";

export default {
  data() {
    return {
      marcas: [],
      modelos: [],
      anos: [],
      selectedMarca: "",
      selectedModelo: "",
      selectedAno: "",
      preco: "",
      cor: "",
      descricao: "",
      opcionais: [],
      fotos: [],
      opcionaisDisponiveis: ["Banco de couro", "Teto solar", "Câmera de ré", "Ar-condicionado"],
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
    async fetchPreco() {
      if (!this.selectedAno) return;
      try {
        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.selectedMarca}/modelos/${this.selectedModelo}/anos/${this.selectedAno}`
        );
        this.preco = response.data.Valor;
      } catch (err) {
        console.error("Erro ao buscar preço:", err);
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
      formData.append("cor", this.cor);
      formData.append("descricao", this.descricao);
      formData.append("opcionais", this.opcionais.join(","));

      Array.from(this.fotos).forEach((file) => {
        formData.append("fotos", file);
      });

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
