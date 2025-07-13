//Pain Points Animation
const painSection = document.querySelector('#pain-points');
const painCards = document.querySelectorAll('.pain-point-card');

const painObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Animate pain cards with staggered delay
      painCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate');
        }, index * 200); // 200ms delay between each card
      });
      painObserver.unobserve(painSection); // Stop observing after animation
    }
  });
}, { threshold: 0.4 }); // Trigger animation when 40% of the section is visible

if (painSection) {
  painObserver.observe(painSection);
}