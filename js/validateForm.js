// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", function() {
    // Get the form element
    var form = document.getElementById("contactform111");

    // Add event listener for form submission
    form.addEventListener("submit", function(event) {
        // Prevent the form from submitting
        event.preventDefault();

        // Get references to form elements
        var nameInput = document.getElementById("name");
        var emailInput = document.getElementById("email");
        var phoneInput = document.getElementById("phone");
        var messageInput = document.getElementById("message");

        // Validate name
        if (nameInput.value.trim() === "") {
            alert("Please enter your name.");
            nameInput.focus();
            return false;
        }

        // Validate email
        var emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            alert("Please enter a valid email address.");
            emailInput.focus();
            return false;
        }

        // Validate phone (optional)
        // You can customize this validation based on your requirements
        var phoneRegex = /^\d{10}$/;
        if (phoneInput.value.trim() !== "" && !phoneRegex.test(phoneInput.value.trim())) {
            alert("Please enter a valid 10-digit phone number.");
            phoneInput.focus();
            return false;
        }

        // Validate message
        if (messageInput.value.trim() === "") {
            alert("Please enter your message.");
            messageInput.focus();
            return false;
        }

        // If all validation passed, submit the form
        form.submit();
    });
});
