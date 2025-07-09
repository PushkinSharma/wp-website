// WhatsApp Demo Carousel
document.addEventListener('DOMContentLoaded', function() {
    const whatsappSection = document.querySelector('#whatsapp-demo');
    
    if (!whatsappSection) return; // Exit if section doesn't exist
    
    const textItems = whatsappSection.querySelectorAll('.whatsapp-text-item');
    const imageItems = whatsappSection.querySelectorAll('.whatsapp-screenshot');
    
    let currentIndex = 0;
    const totalItems = Math.min(textItems.length, imageItems.length);
    const intervalTime = 5000; // 6 seconds for better animation viewing
    
    // Function to show item at specific index
    function showItem(index) {
        // Remove active class from all items
        textItems.forEach((item) => {
            item.classList.remove('active');
        });
        
        imageItems.forEach((item) => {
            item.classList.remove('active');
        });
        
        // Immediately add active class to new items (CSS handles transition timing)
        if (textItems[index]) {
            textItems[index].classList.add('active');
        }
        if (imageItems[index]) {
            imageItems[index].classList.add('active');
        }
    }
    
    // Function to go to next item
    function nextItem() {
        currentIndex = (currentIndex + 1) % totalItems;
        showItem(currentIndex);
    }
    
    // Initialize first item
    showItem(0);
    
    // Start automatic cycling - simple 5 second interval
    let carouselInterval = setInterval(nextItem, intervalTime);
    
    // Commented out hover functionality as requested
    /*
    // Get the iPhone screen area specifically
    const iphoneScreen = whatsappSection.querySelector('.whatsapp-image-container');
    
    // Pause on hover over iPhone screen only
    if (iphoneScreen) {
        iphoneScreen.addEventListener('mouseenter', pauseCarousel);
        
        // Resume on mouse leave from iPhone screen
        iphoneScreen.addEventListener('mouseleave', resumeCarousel);
    }
    */
    
    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(carouselInterval);
        } else {
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextItem, intervalTime);
        }
    });
});

// Intersection Observer for animation on scroll (optional enhancement)
document.addEventListener('DOMContentLoaded', function() {
    const whatsappSection = document.querySelector('#whatsapp-demo');
    const journeySection = document.querySelector('#patient-journey');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    if (whatsappSection) {
        observer.observe(whatsappSection);
    }
    
    if (journeySection) {
        observer.observe(journeySection);
    }
}); 