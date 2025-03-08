const aboutSection = document.querySelector('#about');
const aboutImage = document.querySelector('.about-image img');
const aboutContent = document.querySelector('.about-content');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      aboutImage.classList.add('animate');
      aboutContent.classList.add('animate');
      observer.unobserve(aboutSection); // Stop observing after animation
    }
  });
}, { threshold: 0.5 }); // Trigger animation when 50% of the section is visible

observer.observe(aboutSection);


const digitalSection = document.querySelector('#digital');
const digitalImage1 = document.querySelector('.market-image-1 img');
const digitalImage2 = document.querySelector('.market-image-2 img');
const digitalContent1 = document.querySelector('.market-content-1');
const digitalContent2 = document.querySelector('.market-content-2');

const observerDigital = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      digitalImage1.classList.add('animate');
      digitalContent1.classList.add('animate');
      digitalImage2.classList.add('animate');
      digitalContent2.classList.add('animate');
      observerDigital.unobserve(digitalSection); // Stop observing after animation
    }
  });
}, { threshold: 0.4 }); // Trigger animation when 30% of the section is visible

observerDigital.observe(digitalSection);


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