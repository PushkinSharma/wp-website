const testimonials = [
    {
        name: "Manish Chopra",
        designation: "Dental Destinations, USA",
        image: "img/manish-chopra.png",
        content: "The team at Healthfort is amazing. They have the right insights into the healthcare industry. In a short span of time we have started thinking of Healthfort as not our vendors but our partners who are sharing our exciting journey to transform the dental health industry in the US."
    },
    {
        name: "Dr Neelima Gupta",
        designation: "GTB Hospital, Delhi",
        image: "img/dr-neelima.jpg",
        content: "Healthfort excelled in supporting our Allergy Conference.Their swift website setup, efficient email marketing, and seamless design and print services showcase their valuable contribution to healthcare events. Highly recommended."
    },
    {
        name: "Dr Meenal Khanna",
        designation: "GoPhysio, Noida",
        image: "img/dr-meenal.jpg",
        content: "Healthfort exceeded my expectations in building my clinic's                  website. From visuals to content, I simply shared my vision, and their team, led by knowledgeable doctors, ensured a hassle-free experience."
    },
    {
        name: "Rupa Chakravarty",
        designation: "Suncity School, Gurgaon",
        image: "img/rupa-chakra.png",
        content: "The ability to see all the important health information online                  through a student's Electronic Health Record is very helpful for the school as well as parents. We got positive feedback from parents and our school doctors."
    },
    {
        name: "Dr Amit Nayar",
        designation: "Dental Spa, Chandigarh",
        image: "img/dr-amit.jpg",
        content: "Healthfort transformed our website into a powerful tool for                  patient engagement. Their attention to detail and medical accuracy exceeded my expectations. Highly recommended for healthcare professionals."
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
        name: "Dr Nimish Gupta",
        designation: "Metro Hospital, Noida",
        image: "img/dr-nimish.jpg",
        content: "I highly recommend Healthfort for their commitment to excellence in healthcare content development. Their expertise ensured the website's content resonated with precision, benefiting both patients and professionals."
    },
    {
        name: "Dr Bhawna Gautam",
        designation: "Crayon Dental, Panipat",
        image: "img/dr-bhawna.jpg",
        content: "Healthfort did wonders for my dental brand! They fixed my logo, made our website from scratch, and helped us show up easily on Google. Easy process with good results. Thanks to Healthfort for making us stand out!"
    },
];

const testimonialContainer = document.getElementById('testimonialContainer');
const testimonialScroll = document.getElementById('testimonialScroll');
let scrollPosition = 0;
let isHovered = false;
let startX, currentTranslate = 0, prevTranslate = 0, isDragging = false;

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
    testimonials.forEach(testimonial => {
        testimonialScroll.appendChild(createTestimonialCard(testimonial));
    });
}

function isMobile() {
    return window.innerWidth <= 768;
}

function scrollTestimonials() {
    if (isHovered || isMobile()) return;
    
    scrollPosition += 2;
    testimonialScroll.style.transform = `translateX(-${scrollPosition}px)`;

    if (scrollPosition >= (testimonialScroll.scrollWidth - testimonialContainer.offsetWidth)) {
        scrollPosition = 0;
        testimonialScroll.style.transition = 'none';
        testimonialScroll.style.transform = `translateX(0)`;
        setTimeout(() => {
            testimonialScroll.style.transition = 'transform 0.5s ease';
        }, 50);
    }
}

function touchStart(event) {
    if (!isMobile()) return;
    startX = event.touches[0].clientX;
    isDragging = true;
    testimonialScroll.style.transition = 'none';
}

function touchMove(event) {
    if (!isDragging) return;
    const currentX = event.touches[0].clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    testimonialScroll.style.transform = `translateX(${currentTranslate}px)`;
}

function touchEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    if (Math.abs(movedBy) > 100) {
        if (movedBy > 0) {
            prevTranslate += testimonialContainer.offsetWidth;
        } else {
            prevTranslate -= testimonialContainer.offsetWidth;
        }
    }

    prevTranslate = Math.max(
        Math.min(prevTranslate, 0),
        -testimonialScroll.offsetWidth + testimonialContainer.offsetWidth
    );

    currentTranslate = prevTranslate;
    testimonialScroll.style.transition = 'transform 0.3s ease-out';
    testimonialScroll.style.transform = `translateX(${currentTranslate}px)`;
}

initializeTestimonials();

const scrollInterval = setInterval(scrollTestimonials, 30);

testimonialScroll.addEventListener('mouseenter', () => isHovered = true);
testimonialScroll.addEventListener('mouseleave', () => isHovered = false);

testimonialScroll.addEventListener('touchstart', touchStart);
testimonialScroll.addEventListener('touchmove', touchMove);
testimonialScroll.addEventListener('touchend', touchEnd);

// Recalculate on resize
window.addEventListener('resize', () => {
    if (!isMobile()) {
        testimonialScroll.style.transform = 'translateX(0)';
        scrollPosition = 0;
        currentTranslate = 0;
        prevTranslate = 0;
    }
});