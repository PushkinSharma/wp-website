// const aboutSection = document.querySelector('#about');
// const aboutImage = document.querySelector('.about-image img');
// const aboutContent = document.querySelector('.about-content');

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       aboutImage.classList.add('animate');
//       aboutContent.classList.add('animate');
//       observer.unobserve(aboutSection); // Stop observing after animation
//     }
//   });
// }, { threshold: 0.5 }); // Trigger animation when 50% of the section is visible

//observer.observe(aboutSection);

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
}, { threshold: 0.15 }); // Trigger animation when 15% of the section is visible

observerContact.observe(contactSection);