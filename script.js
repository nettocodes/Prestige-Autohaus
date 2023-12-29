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
  populateSliderWithImages('ferrari', 'sf90', 20)
  populateSliderWithImages('lamborghini', 'huracan', 10)
  

  $(document).ready(function () {
    // Configuração do slider para cada modelo
    $('.model-slider').slick({
        autoplay: false,
        arrows: false,
        dots: false,
        // Outras configurações conforme necessário
    });

    // Ao clicar na seta anterior para o modelo M8
    $('.m8-prev').on('click', function () {
        $('.model-slider').slick('slickPrev');
    });

    // Ao clicar na próxima seta para o modelo M8
    $('.m8-next').on('click', function () {
        $('.model-slider').slick('slickNext');
    });

    // Ao clicar na seta anterior para o modelo X1
    $('.x1-prev').on('click', function () {
        $('.model-slider').slick('slickPrev');
    });

    // Ao clicar na próxima seta para o modelo X1
    $('.x1-next').on('click', function () {
        $('.model-slider').slick('slickNext');
    });
  });

