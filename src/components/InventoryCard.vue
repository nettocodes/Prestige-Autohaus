<template>
    <div class="card">
      <img :src="image" :alt="name" />
      <h3>{{ name }}</h3>
      <p>{{ price }}</p>
      <NButton color="warning" rounded>Detalhes</NButton>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      image: String,
      name: String,
      price: String,
    },
  };
  </script>
  
  <style scoped>
  .card {
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  .card img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
  .card h3 {
    margin: 1rem 0 0.5rem;
  }
  .card p {
    font-weight: bold;
    color: #555;
  }
  </style>
  