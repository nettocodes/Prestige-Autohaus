<template>
  <v-app>
    <v-container>
      <!-- Header -->
      <header class="header">
        <v-row align="center" justify="space-between">
          <h1 class="logo">Prestige <span>Autohaus</span></h1>
          <v-btn color="warning" rounded @click="goToContact">
            Agendar Visita
          </v-btn>
        </v-row>
        <v-navigation-drawer permanent>
          <v-list>
            <v-list-item v-for="(item, i) in navItems" :key="i">
              <v-list-item-title>
                <a :href="item.href">{{ item.title }}</a>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <v-row justify="center" align="center" class="text-center">
          <v-col>
            <h2>Experiência Exclusiva em Veículos de Luxo</h2>
            <p>Encontre o carro dos seus sonhos com garantia, sofisticação e procedência.</p>
            <v-btn color="warning" large rounded>
              Veja Nosso Estoque
            </v-btn>
          </v-col>
        </v-row>
      </section>

      <!-- About Section -->
      <section id="about" class="about">
        <v-row>
          <v-col cols="12" md="6">
            <h2>Sobre Nós</h2>
            <p>
              A <span>Prestige Autohaus</span> é referência em veículos de luxo, oferecendo carros
              esportivos e premium com qualidade e procedência. Nossa missão é entregar uma
              experiência de compra única, personalizada e memorável.
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <v-img src="luxury-showroom.jpg" alt="Showroom de carros de luxo"></v-img>
          </v-col>
        </v-row>
      </section>

      <!-- Inventory Section -->
      <section id="inventory" class="inventory">
        <h2>Nosso Estoque</h2>
        <v-row>
          <InventoryCard
            v-for="(car, index) in cars"
            :key="index"
            :image="car.image"
            :name="car.name"
            :price="car.price"
          />
        </v-row>
      </section>

      <!-- Testimonials Section -->
      <section id="testimonials" class="testimonials">
        <h2>Depoimentos</h2>
        <v-row>
          <v-col v-for="(testimonial, index) in testimonials" :key="index">
            <v-card outlined>
              <v-card-text>
                <p>{{ testimonial.text }}</p>
                <strong>- {{ testimonial.author }}</strong>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="contact">
        <h2>Entre em Contato</h2>
        <p>Agende uma visita e conheça nossos veículos de perto.</p>
        <v-form>
          <v-text-field label="Seu Nome" outlined required></v-text-field>
          <v-text-field label="Seu Email" outlined type="email" required></v-text-field>
          <v-textarea label="Sua Mensagem" outlined rows="4" required></v-textarea>
          <v-btn color="warning" large rounded type="submit">
            Enviar
          </v-btn>
        </v-form>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2024 Prestige Autohaus. Todos os direitos reservados.</p>
      </footer>
    </v-container>
  </v-app>
</template>

<script>
import InventoryCard from "./components/InventoryCard.vue";

export default {
  name: "App",
  components: {
    InventoryCard,
  },
  data() {
    return {
      navItems: [
        { title: "Sobre", href: "#about" },
        { title: "Estoque", href: "#inventory" },
        { title: "Depoimentos", href: "#testimonials" },
        { title: "Contato", href: "#contact" },
      ],
      cars: [
        {
          image: "car1.jpg",
          name: "Porsche 911 Carrera",
          price: "R$ 1.200.000,00",
        },
        {
          image: "car2.jpg",
          name: "Range Rover Velar",
          price: "R$ 700.000,00",
        },
        {
          image: "car3.jpg",
          name: "Ferrari 488 GTB",
          price: "R$ 2.800.000,00",
        },
      ],
      testimonials: [
        {
          text: "Comprar na Prestige Autohaus foi uma experiência incrível. Atendimento impecável!",
          author: "João Silva",
        },
        {
          text: "Adorei meu novo carro! A equipe é super profissional e atenciosa.",
          author: "Maria Oliveira",
        },
      ],
    };
  },
  methods: {
    goToContact() {
      document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    },
  },
};
</script>

<style scoped>
.header {
  background: #0a1128;
  padding: 1rem;
  color: white;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
}
.hero {
  background: url("hero-image.jpg") center/cover no-repeat;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}
.about img {
  border-radius: 10px;
  width: 100%;
}
.inventory h2 {
  margin-bottom: 2rem;
}
.footer {
  background: #0a1128;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
