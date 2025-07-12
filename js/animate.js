
// Lazy Loading for Images
const lazyImages = document.querySelectorAll('.lazy-image');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.getAttribute('data-src');
      
      if (src) {
        // Create a new image element to preload
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
          // Once loaded, update the src and add animation class
          img.src = src;
          img.classList.add('loaded');
          img.removeAttribute('data-src');
        };
        
        imageLoader.onerror = () => {
          // Handle error case - could show a broken image placeholder
          img.classList.add('error');
        };
        
        // Start loading the image
        imageLoader.src = src;
      }
      
      // Stop observing this image
      observer.unobserve(img);
    }
  });
}, {
  threshold: 0.1, // Trigger when 10% of the image is visible
  rootMargin: '50px' // Start loading 50px before the image enters viewport
});

// Observe all lazy images
lazyImages.forEach(img => {
  imageObserver.observe(img);
});

// Pain Points Animation
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

const contactSection = document.querySelector('#contact');
const leftCol = document.querySelector('.form-section');
const rightCol = document.querySelector('.contact-extra');

const observerContact = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      leftCol.classList.add('animate-left');
      rightCol.classList.add('animate-right');
      observerContact.unobserve(contactSection); // Stop observing after animation
    }
  });
}, { threshold: 0.1 }); // Trigger animation when 10% of the section is visible

observerContact.observe(contactSection);