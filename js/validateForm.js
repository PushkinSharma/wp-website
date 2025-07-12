// Enhanced form validation and AJAX submission
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact-form-whatsapp");
    const submitBtn = document.getElementById("contactBtn");
    
    if (!form) {
        console.error("Contact form not found");
        return;
    }
    
    // Add real-time validation
    addRealTimeValidation();
    
    // Handle form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    /**
     * Add real-time validation feedback
     */
    function addRealTimeValidation() {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    /**
     * Validate individual field
     */
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (field.name) {
            case 'name':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
                
            case 'email':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                if (value !== '') {
                    const phoneDigits = value.replace(/\D/g, '');
                    if (phoneDigits.length < 10) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number (at least 10 digits)';
                    }
                }
                break;
                
            case 'message':
                if (value === '') {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'Message must be at least 5 characters long';
                }
                break;
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }
        
        return isValid;
    }
    
    /**
     * Show field error
     */
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        errorDiv.id = field.name + '-error';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    /**
     * Clear field error
     */
    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
    }
    
    /**
     * Validate entire form
     */
    function validateForm() {
        const fields = form.querySelectorAll('input[name], textarea[name]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Submit form via AJAX
     */
    function submitForm() {
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('btn-loading');
        
        // Get form data
        const formData = new FormData(form);
        
        // Send AJAX request
        fetch('http://127.0.0.1:5500/whatsapp/send-whatsapp.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            // Log response details for debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get response text first for debugging
            return response.text();
        })
        .then(responseText => {
            // Log the raw response for debugging
            //console.log('Raw response:', responseText);
            
            // Try to parse JSON
            if (!responseText.trim()) {
                throw new Error('Empty response from server');
            }
            
            try {
                const data = JSON.parse(responseText);
                return data;
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Response text:', responseText);
                throw new Error('Invalid JSON response from server: ' + responseText.substring(0, 200));
            }
        })
        .then(data => {
            if (data.success) {
                showSuccessMessage(data.message);
                form.reset();
                clearAllErrors();
            } else {
                showErrorMessage(data.message || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An error occurred while sending your message: ' + error.message);
        })
        .finally(() => {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-loading');
        });
    }
    
    /**
     * Show success message
     */
    function showSuccessMessage(message) {
        // Remove any existing messages
        clearMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.textContent = message;
        
        form.parentNode.appendChild(successDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
    
    /**
     * Show error message
     */
    function showErrorMessage(message) {
        // Remove any existing messages
        clearMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = message;
        
        form.parentNode.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    /**
     * Clear all error messages
     */
    function clearMessages() {
        const messages = form.parentNode.querySelectorAll('.alert');
        messages.forEach(msg => msg.remove());
    }
    
    /**
     * Clear all field errors
     */
    function clearAllErrors() {
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            clearFieldError(field);
        });
    }
    
    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    .btn-loading {
        position: relative;
        color: transparent !important;
    }
    
    .btn-loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border: 2px solid transparent;
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: button-loading-spinner 1s ease infinite;
    }
    
    @keyframes button-loading-spinner {
        from {
            transform: rotate(0turn);
        }
        to {
            transform: rotate(1turn);
        }
    }
    
    .invalid-feedback {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 0.875em;
        color: #dc3545;
    }
    
    .is-invalid {
        border-color: #dc3545;
    }
    
    .is-invalid:focus {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
`;
document.head.appendChild(style);