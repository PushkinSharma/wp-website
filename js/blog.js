document.addEventListener('DOMContentLoaded', function() {
    const blogPosts = document.querySelector('.blog-posts');
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    const blogPostWidth = blogPosts.querySelector('.col-lg-4').offsetWidth;
  
    let scrollPosition = 0;
  
    arrowLeft.addEventListener('click', function() {
      scrollPosition -= blogPostWidth * 3; // Move 3 blog posts to the left
      if (scrollPosition < 0) {
        scrollPosition = 0;
      }
      blogPosts.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    });
  
    arrowRight.addEventListener('click', function() {
      scrollPosition += blogPostWidth * 3; // Move 3 blog posts to the right
      const maxScroll = blogPosts.scrollWidth - blogPosts.clientWidth;
      if (scrollPosition > maxScroll) {
        scrollPosition = maxScroll;
      }
      blogPosts.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    });
  });
  