// Função para criar e adicionar imagens ao slider
function populateSliderWithImages(brand, model, totalImages) {
    const slider = document.getElementById(`${brand}-slider`);
    for (let i = 1; i <= totalImages; i++) {
      const imageDiv = document.createElement('div');
      imageDiv.innerHTML = `<img class="inventory__image" src="src/img/cars/${brand}/${model}/${model}_${i}.jpg" alt="Image ${i}">`;
      slider.appendChild(imageDiv);
    }
  }
  
  // Adicionar imagens para modelos específicos de BMW e Audi
  populateSliderWithImages('bmw', 'm8', 14); // Altere para o número total de imagens para o modelo BMW M8
  populateSliderWithImages('audi', 'rs6', 19); // Altere para o número total de imagens para o modelo Audi RS6
  populateSliderWithImages('porsche', '911', 15);
  populateSliderWithImages('ferrari', 'sf90', 20);
  populateSliderWithImages('lamborghini', 'huracan', 10);
  populateSliderWithImages('chevrolet','silverado', 11);
  

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  function reiniciarVideo() {
    var video = document.querySelector('.video__banner');
    video.currentTime = 0; // Reinicia o vídeo para o início
    video.play(); // Inicia a reprodução novamente
  }

  function verificarTempoLimite() {
    var video = document.querySelector('.video__banner');
    var tempoLimite = 28; // Defina o tempo máximo desejado em segundos

  if (video.currentTime >= tempoLimite) {
      video.pause();
      video.currentTime = 0;
      reiniciarVideo();
  }
}

function getRandomImages(brand, model, totalImages) {
  const randomIndexes = [];
  while (randomIndexes.length < 3) {
    const randomIndex = Math.floor(Math.random() * totalImages) + 1;
    if (!randomIndexes.includes(randomIndex)) {
      randomIndexes.push(randomIndex);
    }
  }
  return randomIndexes.map(index => `src/img/cars/${brand}/${model}/${model}_${index}.jpg`);
}

function populateBackgroundWithImages(brand, models, totalImages) {
  const backgroundDiv = document.querySelector(`.brand.${brand} .background`);

  models.forEach(model => {
    const randomImages = getRandomImages(brand, model, totalImages);

    randomImages.forEach((imageUrl, index) => {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add(`back`, `${brand}_${model.toLowerCase()}`);
      imageDiv.style.backgroundImage = `url(${imageUrl})`;
      imageDiv.style.flex = '1'; // Cada imagem ocupará 1/3 do espaço
      backgroundDiv.appendChild(imageDiv);
    });
  });
}

// Adicione mais modelos e marcas conforme necessário
populateBackgroundWithImages('bmw', ['m8'], 14);
populateBackgroundWithImages('audi', ['rs6'], 19);
populateBackgroundWithImages('porsche', ['911'], 15);
populateBackgroundWithImages('ferrari', ['sf90'], 20);
populateBackgroundWithImages('lamborghini', ['huracan'], 10);
populateBackgroundWithImages('chevrolet', ['silverado'], 11);
