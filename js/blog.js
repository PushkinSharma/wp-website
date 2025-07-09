document.addEventListener('DOMContentLoaded', function() {
    const blogPosts = document.querySelector('.blog-posts');
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    
    if (!blogPosts || !arrowLeft || !arrowRight) return;
    
    let scrollPosition = 0;
    let isScrolling = false;

    // Calculate scroll amount based on viewport
    function getScrollAmount() {
        const containerWidth = blogPosts.clientWidth;
        const cardWidth = blogPosts.querySelector('.col-lg-4')?.offsetWidth || 350;
        const gap = 20;
        const cardsVisible = Math.floor(containerWidth / (cardWidth + gap));
        return (cardWidth + gap) * Math.max(1, cardsVisible);
    }

    // Smooth scroll with easing
    function smoothScrollTo(targetPosition, duration = 600) {
        if (isScrolling) return;
        
        isScrolling = true;
        const startPosition = blogPosts.scrollLeft;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            blogPosts.scrollLeft = startPosition + (distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                isScrolling = false;
            }
        }

        requestAnimationFrame(animateScroll);
    }

    // Update arrow states based on scroll position
    function updateArrowStates() {
        const maxScroll = blogPosts.scrollWidth - blogPosts.clientWidth;
        
        arrowLeft.style.opacity = blogPosts.scrollLeft <= 0 ? '0.4' : '1';
        arrowLeft.style.pointerEvents = blogPosts.scrollLeft <= 0 ? 'none' : 'auto';
        
        arrowRight.style.opacity = blogPosts.scrollLeft >= maxScroll ? '0.4' : '1';
        arrowRight.style.pointerEvents = blogPosts.scrollLeft >= maxScroll ? 'none' : 'auto';
    }

    // Handle left arrow click
    arrowLeft.addEventListener('click', function() {
        if (isScrolling) return;
        
        const scrollAmount = getScrollAmount();
        scrollPosition = Math.max(0, blogPosts.scrollLeft - scrollAmount);
        smoothScrollTo(scrollPosition);
    });

    // Handle right arrow click
    arrowRight.addEventListener('click', function() {
        if (isScrolling) return;
        
        const scrollAmount = getScrollAmount();
        const maxScroll = blogPosts.scrollWidth - blogPosts.clientWidth;
        scrollPosition = Math.min(maxScroll, blogPosts.scrollLeft + scrollAmount);
        smoothScrollTo(scrollPosition);
    });

    // Update arrow states on scroll
    blogPosts.addEventListener('scroll', updateArrowStates);
    
    // Update on window resize
    window.addEventListener('resize', () => {
        updateArrowStates();
        // Reset scroll position if needed
        const maxScroll = blogPosts.scrollWidth - blogPosts.clientWidth;
        if (blogPosts.scrollLeft > maxScroll) {
            smoothScrollTo(maxScroll);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!blogPosts.closest('#blogs')) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            arrowLeft.click();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            arrowRight.click();
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    blogPosts.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    blogPosts.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right (go left)
                arrowLeft.click();
            } else {
                // Swipe left (go right)
                arrowRight.click();
            }
        }
    }

    // Initialize arrow states
    updateArrowStates();
    
    // Add loading animation
    const cards = blogPosts.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
  