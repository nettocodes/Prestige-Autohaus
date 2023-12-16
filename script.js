// const cars = document.querySelectorAll('.inventory .car');

// const updateCarRotation = (event) => {
//     cars.forEach((car) => {
//         const rect = car.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;
//         const mouseX = event.clientX - centerX;
//         const mouseY = event.clientY - centerY;
//         const maxRotation = 15;

//         const rotateY = (mouseX / centerX) * maxRotation;
//         const rotateX = -(mouseY / centerY) * maxRotation;

//         if (
//             event.target === car ||
//             event.target.closest('.car') === car
//         ) {
//             car.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//         } else {
//             car.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
//         }
//     });
// };

// const resetCarRotation = () => {
//     cars.forEach((car) => {
//         car.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
//     });
// };

// document.addEventListener("mousemove", updateCarRotation);
// document.querySelector('.inventory').addEventListener("mouseleave", resetCarRotation);
