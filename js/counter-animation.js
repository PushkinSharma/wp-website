// Counter animation for statistics
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });

    // Animate feature items and flow steps on scroll
    const featureItems = document.querySelectorAll('.feature-item');
    const flowSteps = document.querySelectorAll('.flow-step');

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100);
            }
        });
    }, { threshold: 0.5 });

    featureItems.forEach(item => animateOnScroll.observe(item));
    flowSteps.forEach(step => animateOnScroll.observe(step));

    // Continuous looping step activation animation for process flow
    const processFlowSteps = document.querySelectorAll('.flow-step');
    let isProcessFlowVisible = false;
    let processFlowInterval;

    function activateStep(stepIndex) {
        // Remove active class from all steps
        processFlowSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Add active class to current step
        if (processFlowSteps[stepIndex]) {
            processFlowSteps[stepIndex].classList.add('active');
        }
    }

    function startProcessFlowAnimation() {
        let currentStep = 0;
        
        // Function to cycle through steps
        function cycleSteps() {
            activateStep(currentStep);
            currentStep = (currentStep + 1) % processFlowSteps.length;
        }

        // Start immediately with first step
        cycleSteps();
        
        // Continue cycling every 1.5 seconds
        processFlowInterval = setInterval(cycleSteps, 1500);
    }

    function stopProcessFlowAnimation() {
        if (processFlowInterval) {
            clearInterval(processFlowInterval);
            processFlowInterval = null;
        }
        // Reset all steps to inactive state
        processFlowSteps.forEach(step => {
            step.classList.remove('active');
        });
    }

    // Observer for when process flow section comes into view
    const stepActivation = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isProcessFlowVisible) {
                isProcessFlowVisible = true;
                startProcessFlowAnimation();
            } else if (!entry.isIntersecting && isProcessFlowVisible) {
                isProcessFlowVisible = false;
                stopProcessFlowAnimation();
            }
        });
    }, { threshold: 0.3 });

    const processFlow = document.querySelector('.process-flow');
    if (processFlow) {
        stepActivation.observe(processFlow);
    }
}); 