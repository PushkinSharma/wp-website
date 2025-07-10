// Enhanced Contact Form Validation and Security
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactform111");
    const submitBtn = document.getElementById("contactBtn");
    
    if (!form) return;

    // Form elements
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");
    const honeypotInput = document.querySelector('input[name="honeypot"]');

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[\+]?[1-9][\d]{0,15}$/, // International format
        message: /^[\s\S]{10,1000}$/ // 10-1000 characters
    };

    // Error messages
    const errorMessages = {
        name: {
            required: "Please enter your name",
            invalid: "Name should be 2-50 characters, letters and spaces only",
            tooShort: "Name must be at least 2 characters long"
        },
        email: {
            required: "Please enter your email address",
            invalid: "Please enter a valid email address"
        },
        phone: {
            invalid: "Please enter a valid phone number (10-15 digits)"
        },
        message: {
            required: "Please enter your message",
            tooShort: "Message must be at least 10 characters long",
            tooLong: "Message must be less than 1000 characters"
        },
        honeypot: "Form submission blocked - suspicious activity detected"
    };

    // Real-time validation
    function validateField(field, pattern, errorKey) {
        const value = field.value.trim();
        const errorElement = field.parentNode.querySelector('.error-message');
        
        // Remove existing error
        if (errorElement) {
            errorElement.remove();
        }

        // Check if field is required and empty
        if (field.hasAttribute('required') && !value) {
            showError(field, errorMessages[errorKey].required);
            return false;
        }

        // Skip validation if field is empty and not required
        if (!value && !field.hasAttribute('required')) {
            return true;
        }

        // Pattern validation
        if (pattern && !pattern.test(value)) {
            showError(field, errorMessages[errorKey].invalid);
            return false;
        }

        // Specific validations
        switch(errorKey) {
            case 'name':
                if (value.length < 2) {
                    showError(field, errorMessages.name.tooShort);
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    showError(field, errorMessages.message.tooShort);
                    return false;
                }
                if (value.length > 1000) {
                    showError(field, errorMessages.message.tooLong);
                    return false;
                }
                break;
        }

        return true;
    }

    // Show error message
    function showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-danger small mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.classList.add('is-invalid');
    }

    // Remove error message
    function removeError(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('is-invalid');
    }

    // Add real-time validation listeners
    [nameInput, emailInput, phoneInput, messageInput].forEach(field => {
        if (!field) return;
        
        field.addEventListener('blur', function() {
            const fieldName = this.id;
            validateField(this, patterns[fieldName], fieldName);
        });

        field.addEventListener('input', function() {
            removeError(this);
        });
    });

    // Honeypot validation
    function validateHoneypot() {
        if (honeypotInput && honeypotInput.value.trim() !== '') {
            console.warn('Honeypot field filled - potential bot activity');
            return false;
        }
        return true;
    }

    // Rate limiting
    let lastSubmissionTime = 0;
    const MIN_SUBMISSION_INTERVAL = 30000; // 30 seconds

    function checkRateLimit() {
        const now = Date.now();
        if (now - lastSubmissionTime < MIN_SUBMISSION_INTERVAL) {
            alert('Please wait 30 seconds before submitting another message.');
            return false;
        }
        return true;
    }

    // Form submission handler
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Check honeypot
        if (!validateHoneypot()) {
            alert(errorMessages.honeypot);
            return false;
        }

        // Check rate limiting
        if (!checkRateLimit()) {
            return false;
        }

        // Validate all fields
        const validations = [
            validateField(nameInput, patterns.name, 'name'),
            validateField(emailInput, patterns.email, 'email'),
            validateField(phoneInput, patterns.phone, 'phone'),
            validateField(messageInput, patterns.message, 'message')
        ];

        if (validations.some(valid => !valid)) {
            alert('Please correct the errors before submitting.');
            return false;
        }

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

        // Prepare form data
        const formData = new FormData(form);
        
        // Add CSRF token (you should generate this server-side)
        formData.append('csrf_token', generateCSRFToken());

        // Submit form
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage();
                form.reset();
                lastSubmissionTime = Date.now();
            } else {
                showErrorMessage(data.message || 'Submission failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showErrorMessage('Network error. Please check your connection and try again.');
        })
        .finally(() => {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit';
        });
    });

    // Success message
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Thank you! Your message has been sent successfully. We'll get back to you soon.
        `;
        form.parentNode.appendChild(successDiv);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Error message
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        `;
        form.parentNode.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Simple CSRF token generation (replace with server-side generation)
    function generateCSRFToken() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Add character counters
    [nameInput, messageInput].forEach(field => {
        if (!field) return;
        
        const counter = document.createElement('div');
        counter.className = 'character-counter text-muted small mt-1';
        field.parentNode.appendChild(counter);
        
        field.addEventListener('input', function() {
            const maxLength = this.getAttribute('maxlength') || (this.id === 'message' ? 1000 : 50);
            const currentLength = this.value.length;
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            if (currentLength > maxLength * 0.9) {
                counter.classList.add('text-warning');
            } else {
                counter.classList.remove('text-warning');
            }
        });
    });
});
