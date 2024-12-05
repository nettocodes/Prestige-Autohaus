<template>
  <div>
    <div class="form-container">
      <h2>Adicionar Veículo</h2>
      <form @submit.prevent="addVehicle" enctype="multipart/form-data">
        <label>Marca:</label>
        <select v-model="selectedMarca" @change="fetchModelos" required>
          <option value="" disabled>Selecione uma marca</option>
          <option v-for="marca in marcas" :key="marca.codigo" :value="marca.codigo">
            {{ marca.nome }}
          </option>
        </select>
        <label>Modelo:</label>
        <select v-model="selectedModelo" @change="fetchAnos" :disabled="!modelos.length" required>
          <option value="" disabled>Selecione um modelo</option>
          <option v-for="modelo in modelos" :key="modelo.codigo" :value="modelo.codigo">
            {{ modelo.nome }}
          </option>
        </select>
        <label>Ano:</label>
        <select v-model="selectedAno" required>
          <option value="" disabled>Selecione o ano</option>
          <option v-for="ano in anos" :key="ano.codigo" :value="ano.codigo">
            {{ ano.nome }}
          </option>
        </select>
        <label>Condição:</label>
        <select v-model="condicao" required>
          <option value="" disabled>Selecione a condição</option>
          <option value="Novo">Novo</option>
          <option value="Usado">Usado</option>
        </select>
        <label>Preço:</label>
        <input v-model.number="preco" type="number" step="0.01" placeholder="Digite o preço" required />
        <label>Quilometragem:</label>
        <input v-model.number="quilometragem" type="number" placeholder="Digite a quilometragem" required />
        <label>Carroceria:</label>
        <select v-model="carroceria" required>
          <option value="" disabled>Selecione a carroceria</option>
          <option v-for="option in carroceriaOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <label>Transmissão:</label>
        <select v-model="transmissao" required>
          <option value="" disabled>Selecione a transmissão</option>
          <option v-for="option in transmissaoOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <label>Portas:</label>
        <select v-model="portas" required>
          <option value="" disabled>Selecione o número de portas</option>
          <option value="2">2 Portas</option>
          <option value="4">4 Portas</option>
        </select>
        <label>Cor:</label>
        <input v-model="cor" placeholder="Cor" required />
        <label>Tipo de Tração:</label>
        <select v-model="driveType" required>
          <option value="" disabled>Selecione a tração</option>
          <option value="4x2">4x2</option>
          <option value="4x4">4x4</option>
          <option value="AWD">AWD</option>
        </select>
        <label>Número de Cilindros:</label>
        <input v-model.number="cilindros" type="number" placeholder="Digite o número de cilindros" required />
        <label>Opcionais:</label>
        <div v-for="opcional in opcionaisDisponiveis" :key="opcional">
          <input type="checkbox" :value="opcional" v-model="opcionais" />
          {{ opcional }}
        </div>
        <label>Fotos:</label>
        <input type="file" multiple @change="handleFileUpload" accept="image/*" />
        <button type="submit">Adicionar Veículo</button>
      </form>
    </div>
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
      quilometragem: 0,
      carroceria: "",
      transmissao: "",
      portas: "",
      driveType: "",
      condicao: "",
      cilindros: 0,
      fotos: [],
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
      if (this.selectedMarca) {
        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.selectedMarca}/modelos`
        );
        this.modelos = response.data.modelos;
      }
    },
    async fetchAnos() {
      if (this.selectedModelo) {
        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.selectedMarca}/modelos/${this.selectedModelo}/anos`
        );
        this.anos = response.data;
      }
    },
    handleFileUpload(event) {
      this.fotos = event.target.files;
    },
    async addVehicle() {
      const formData = new FormData();
      formData.append("marca", this.selectedMarca);
      formData.append("modelo", this.selectedModelo);
      formData.append("ano", this.selectedAno);
      formData.append("preco", this.preco);
      formData.append("quilometragem", this.quilometragem);
      formData.append("carroceria", this.carroceria);
      formData.append("transmissao", this.transmissao);
      formData.append("portas", this.portas);
      formData.append("driveType", this.driveType);
      formData.append("condicao", this.condicao);
      formData.append("cilindros", this.cilindros);
      formData.append("opcionais", this.opcionais.join(","));
      Array.from(this.fotos).forEach(file => formData.append("fotos", file));

      try {
        await axios.post("http://localhost:5000/api/vehicles/add", formData);
        alert("Veículo adicionado com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao adicionar veículo.");
      }
    },
  },
  mounted() {
    this.fetchMarcas();
  },
};
</script>
