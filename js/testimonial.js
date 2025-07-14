const testimonials = [
    {
        name: "Manish Chopra",
        designation: "Dental Destinations, USA",
        image: "img/manish-chopra.png",
        content: "The team at Healthfort is amazing. They have the right insights into the healthcare industry. In a short span of time we have started thinking of Healthfort as not our vendors but our partners who are sharing our exciting journey to transform the dental health industry in the US."
    },
    // {
    //     name: "Dr Neelima Gupta",
    //     designation: "GTB Hospital, Delhi",
    //     image: "img/dr-neelima.jpg",
    //     content: "Healthfort excelled in supporting our Allergy Conference.Their swift website setup, efficient email marketing, and seamless design and print services showcase their valuable contribution to healthcare events. Highly recommended."
    // },
    {
        name: "Dr Rajeev Jain",
        designation: "Save Sight Centre, Delhi",
        image: "img/dr.rajeev-jain.jpg",
        content: "We've seen fewer missed appointments and better treatment compliance. Overall, our patient communication is more consistent and efficient—benefiting both our team and our patients."
    },
    {
        name: "Rupa Chakravarty",
        designation: "Suncity School, Gurgaon",
        image: "img/rupa-chakra.png",
        content: "The ability to see all the important health information online                  through a student's Electronic Health Record is very helpful for the school as well as parents. We got positive feedback from parents and our school doctors."
    },
    {
        name: "Dr Yasir Rizvi",
        designation: "Dharamshila Hospital, Delhi",
        image: "img/dr-yasir.jpg",
        content: " Healthfort's expertise in crafting medically accurate websites and engaging blogs is commendable. As a former faculty and senior consultant, I value their commitment to precision and informative content."
    },
    {
        name: "Dr Pawanindra Lal",
        designation: "MAMC, Delhi",
        image: "img/dr-pawan.png",
        content: "I have partnered with Healthfort for more than a decade now. I think they're one of the most competent Healthcare-IT companies.They have helped develop  software and mobile applications for me personally as well as for organizations that I have led."
    },
    {
        name: "Dr Pinnojj Siingh",
        designation: "Luxe Dental, Bombay",
        image: "img/dr.pinnojj.jpeg",
        content: "We've been using Healthfort PEP for over a year now and it has helped our team automate patient follow-ups and share prescriptions and medical documents via WhatsApp.This consistency in communication has reduced missed appointments and made patient engagement smoother"
    },
    {
        name: "Dr Vikas Goswami",
        designation: "Max Hospitals",
        image: "img/dr.goswami.jpeg",
        content: "I rely on Healthfort PEP to ensure my chemotherapy patients don't miss appointments or essential follow-ups.It has improved continuity in care, and helped us maintain treatment schedules more reliably."
    },
];

let testimonialContainer;
let testimonialScroll;
let scrollPosition = 0;
let startX, currentTranslate = 0, prevTranslate = 0, isDragging = false;
let scrollInterval;
let isMobile = false;

function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
        <div class="testimonial-header">
            <img src="${testimonial.image}" alt="Testimonial photo of ${testimonial.name}" class="client-pic" loading="lazy">
            <div class="client-info">
                <h5 class="client-name">${testimonial.name}</h5>
                <p class="client-designation">${testimonial.designation}</p>
            </div>
        </div>
        <div class="client-content">
            <p>${testimonial.content}</p>
        </div>
    `;
    return card;
}

function initializeTestimonials() {
    testimonialContainer = document.getElementById('testimonialContainer');
    testimonialScroll = document.getElementById('testimonialScroll');
    
    if (!testimonialContainer || !testimonialScroll) {
        console.error('Testimonial elements not found');
        return;
    }

    // Clear existing content
    testimonialScroll.innerHTML = '';
    
    // Check if mobile
    isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // For mobile: create a simple scrollable list
        testimonials.forEach(testimonial => {
            testimonialScroll.appendChild(createTestimonialCard(testimonial));
        });
        
        // Enable horizontal scrolling on mobile
        testimonialScroll.style.display = 'flex';
        testimonialScroll.style.overflowX = 'auto';
        testimonialScroll.style.scrollSnapType = 'x mandatory';
        testimonialScroll.style.scrollBehavior = 'smooth';
        
        // Add scroll snap to cards
        const cards = testimonialScroll.querySelectorAll('.testimonial-card');
        cards.forEach(card => {
            card.style.scrollSnapAlign = 'start';
            card.style.flexShrink = 0;
        });
        
        // Add touch/swipe functionality
        addTouchSupport();
        
    } else {
        // For desktop: create infinite scroll effect
        for (let i = 0; i < 3; i++) {
            testimonials.forEach(testimonial => {
                testimonialScroll.appendChild(createTestimonialCard(testimonial));
            });
        }
        
        // Start auto-scrolling for desktop
        startScrolling();
    }
}

function addTouchSupport() {
    let startX = 0;
    let scrollLeft = 0;
    
    testimonialScroll.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - testimonialScroll.offsetLeft;
        scrollLeft = testimonialScroll.scrollLeft;
    });
    
    testimonialScroll.addEventListener('touchmove', (e) => {
        if (!startX) return;
        e.preventDefault();
        const x = e.touches[0].pageX - testimonialScroll.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialScroll.scrollLeft = scrollLeft - walk;
    });
    
    testimonialScroll.addEventListener('touchend', () => {
        startX = 0;
    });
}

function scrollTestimonials() {
    if (isMobile) return;
    
    scrollPosition += 1.5;
    testimonialScroll.style.transform = `translateX(-${scrollPosition}px)`;

    // Reset position when we've scrolled through one set of testimonials
    const oneSetWidth = (testimonialScroll.scrollWidth / 3);
    if (scrollPosition >= oneSetWidth) {
        scrollPosition = 0;
        testimonialScroll.style.transition = 'none';
        testimonialScroll.style.transform = `translateX(0)`;
        setTimeout(() => {
            testimonialScroll.style.transition = 'transform 0.8s ease-out';
        }, 50);
    }
}

function startScrolling() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
    }
    scrollInterval = setInterval(scrollTestimonials, 25);
}

function pauseScrolling() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

function resumeScrolling() {
    if (!scrollInterval && !isMobile) {
        startScrolling();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTestimonials();
    
    if (testimonialScroll && !isMobile) {
        // Pause on click/tap for better UX (desktop only)
        testimonialScroll.addEventListener('click', () => {
            pauseScrolling();
            setTimeout(() => {
                resumeScrolling();
            }, 3000);
        });
    }
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseScrolling();
    } else {
        resumeScrolling();
    }
});

// Recalculate on resize
window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== isMobile) {
        // Device type changed, reinitialize
        initializeTestimonials();
    } else if (!isMobile) {
        // Still desktop, reset scroll
        scrollPosition = 0;
        currentTranslate = 0;
        prevTranslate = 0;
        if (testimonialScroll) {
            testimonialScroll.style.transform = 'translateX(0)';
        }
        resumeScrolling();
    }
});