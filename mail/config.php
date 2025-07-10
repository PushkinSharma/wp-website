<?php
/**
 * Contact Form Configuration
 * Update these settings according to your needs
 */

// Email Configuration
$config = [
    // Admin email where contact form submissions will be sent
    'admin_email' => 'info@abc.in',
    
    // From email (should be from your domain to avoid spam filters)
    'from_email' => 'noreply@yourdomain.com',
    
    // From name
    'from_name' => 'Your Website Contact Form',
    
    // Email subject
    'subject' => 'New Contact Form Submission',
    
    // Rate limiting settings
    'max_attempts' => 5,        // Maximum attempts per time window
    'time_window' => 3600,      // Time window in seconds (1 hour)
    
    // reCAPTCHA settings (get from https://www.google.com/recaptcha/admin)
    'recaptcha_site_key' => 'YOUR_RECAPTCHA_SITE_KEY',    // Frontend key
    'recaptcha_secret_key' => 'YOUR_RECAPTCHA_SECRET_KEY', // Backend key
    
    // Security settings
    'enable_csrf' => true,
    'enable_honeypot' => true,
    'enable_rate_limiting' => true,
    'enable_recaptcha' => true,
    
    // Logging settings
    'log_submissions' => true,
    'log_errors' => true,
    'log_file' => __DIR__ . '/contact_log.txt',
    
    // Email template settings
    'use_html_email' => false,  // Set to true for HTML emails
    'include_ip_info' => true,
    'include_user_agent' => true,
    
    // Notification settings
    'send_admin_notification' => true,
    'send_user_confirmation' => false,  // Set to true to send confirmation to user
    'user_confirmation_subject' => 'Thank you for contacting us',
    
    // File upload settings (if needed)
    'allow_file_uploads' => false,
    'max_file_size' => 5242880,  // 5MB in bytes
    'allowed_file_types' => ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    'upload_directory' => __DIR__ . '/uploads/',
];

// Database settings (optional - for storing submissions)
$db_config = [
    'use_database' => false,
    'host' => 'localhost',
    'username' => 'your_db_user',
    'password' => 'your_db_password',
    'database' => 'your_database',
    'table' => 'contact_submissions'
];

// SMTP settings (optional - for better email delivery)
$smtp_config = [
    'use_smtp' => false,
    'host' => 'smtp.yourdomain.com',
    'port' => 587,
    'username' => 'your_smtp_username',
    'password' => 'your_smtp_password',
    'encryption' => 'tls'  // tls or ssl
];

// Custom validation rules
$validation_rules = [
    'name' => [
        'required' => true,
        'min_length' => 2,
        'max_length' => 50,
        'pattern' => '/^[a-zA-Z\s]{2,50}$/'
    ],
    'email' => [
        'required' => true,
        'max_length' => 100,
        'pattern' => '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
    ],
    'phone' => [
        'required' => false,
        'max_length' => 20,
        'pattern' => '/^[\+]?[1-9][\d]{0,15}$/'
    ],
    'message' => [
        'required' => true,
        'min_length' => 10,
        'max_length' => 1000
    ]
];

// Error messages
$error_messages = [
    'name' => [
        'required' => 'Please enter your name',
        'invalid' => 'Name should be 2-50 characters, letters and spaces only',
        'too_short' => 'Name must be at least 2 characters long'
    ],
    'email' => [
        'required' => 'Please enter your email address',
        'invalid' => 'Please enter a valid email address'
    ],
    'phone' => [
        'invalid' => 'Please enter a valid phone number (10-15 digits)'
    ],
    'message' => [
        'required' => 'Please enter your message',
        'too_short' => 'Message must be at least 10 characters long',
        'too_long' => 'Message must be less than 1000 characters'
    ],
    'general' => [
        'csrf_invalid' => 'Security token invalid. Please refresh the page and try again.',
        'recaptcha_failed' => 'Please complete the reCAPTCHA verification.',
        'rate_limit_exceeded' => 'Too many submission attempts. Please try again later.',
        'honeypot_triggered' => 'Form submission blocked - suspicious activity detected',
        'server_error' => 'An error occurred. Please try again later.',
        'email_failed' => 'Failed to send message. Please try again later.'
    ]
];

// Success messages
$success_messages = [
    'submission_success' => 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
    'user_confirmation' => 'We have received your message and will respond within 24 hours.'
];

// Export configuration
return [
    'config' => $config,
    'db_config' => $db_config,
    'smtp_config' => $smtp_config,
    'validation_rules' => $validation_rules,
    'error_messages' => $error_messages,
    'success_messages' => $success_messages
];
?> 