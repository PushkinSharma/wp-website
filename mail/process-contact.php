<?php
/**
 * Secure Contact Form Processor
 * Handles form validation, security checks, and email sending
 */

// Start session for CSRF protection
session_start();

// Set content type to JSON
header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Configuration
$config = [
    'admin_email' => 'info@abc.in',
    'from_email' => 'noreply@yourdomain.com',
    'from_name' => 'Your Website Contact Form',
    'subject' => 'New Contact Form Submission',
    'max_attempts' => 5,
    'time_window' => 3600, // 1 hour
    'recaptcha_secret' => 'YOUR_RECAPTCHA_SECRET_KEY', // Replace with your secret key
];

// Response function
function sendResponse($success, $message, $data = []) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => time()
    ]);
    exit;
}

// Sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) && 
           preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email);
}

// Validate phone number
function validatePhone($phone) {
    if (empty($phone)) return true; // Optional field
    return preg_match('/^[\+]?[1-9][\d]{0,15}$/', $phone);
}

// Rate limiting check
function checkRateLimit($ip) {
    global $config;
    
    $attempts_file = sys_get_temp_dir() . '/contact_attempts_' . md5($ip) . '.json';
    $current_time = time();
    
    if (file_exists($attempts_file)) {
        $attempts = json_decode(file_get_contents($attempts_file), true);
        
        // Remove old attempts outside time window
        $attempts = array_filter($attempts, function($timestamp) use ($current_time, $config) {
            return ($current_time - $timestamp) < $config['time_window'];
        });
        
        if (count($attempts) >= $config['max_attempts']) {
            return false;
        }
    } else {
        $attempts = [];
    }
    
    // Add current attempt
    $attempts[] = $current_time;
    file_put_contents($attempts_file, json_encode($attempts));
    
    return true;
}

// Verify reCAPTCHA
function verifyRecaptcha($recaptcha_response) {
    global $config;
    
    if (empty($config['recaptcha_secret'])) {
        return true; // Skip if not configured
    }
    
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => $config['recaptcha_secret'],
        'response' => $recaptcha_response,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $response = json_decode($result, true);
    
    return $response['success'] ?? false;
}

// Generate CSRF token
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Verify CSRF token
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Main processing logic
try {
    // Check if it's a POST request
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, 'Invalid request method');
    }
    
    // Get client IP
    $client_ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Rate limiting check
    if (!checkRateLimit($client_ip)) {
        sendResponse(false, 'Too many submission attempts. Please try again later.');
    }
    
    // Get and sanitize form data
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $phone = sanitizeInput($_POST['phone'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    $csrf_token = $_POST['csrf_token'] ?? '';
    $recaptcha_response = $_POST['g-recaptcha-response'] ?? '';
    $honeypot = $_POST['website'] ?? ''; // Honeypot field
    
    // Check honeypot
    if (!empty($honeypot)) {
        error_log("Honeypot triggered from IP: $client_ip");
        sendResponse(false, 'Form submission blocked');
    }
    
    // Verify CSRF token
    if (!verifyCSRFToken($csrf_token)) {
        sendResponse(false, 'Security token invalid. Please refresh the page and try again.');
    }
    
    // Verify reCAPTCHA
    if (!verifyRecaptcha($recaptcha_response)) {
        sendResponse(false, 'Please complete the reCAPTCHA verification.');
    }
    
    // Validate required fields
    if (empty($name) || strlen($name) < 2 || strlen($name) > 50) {
        sendResponse(false, 'Please enter a valid name (2-50 characters)');
    }
    
    if (empty($email) || !validateEmail($email)) {
        sendResponse(false, 'Please enter a valid email address');
    }
    
    if (empty($message) || strlen($message) < 10 || strlen($message) > 1000) {
        sendResponse(false, 'Please enter a message (10-1000 characters)');
    }
    
    // Validate phone (optional)
    if (!empty($phone) && !validatePhone($phone)) {
        sendResponse(false, 'Please enter a valid phone number');
    }
    
    // Prepare email content
    $email_body = "
New Contact Form Submission

Name: $name
Email: $email
Phone: " . ($phone ?: 'Not provided') . "
Message:
$message

---
Submitted from: " . $_SERVER['HTTP_REFERER'] ?? 'Unknown' . "
IP Address: $client_ip
Timestamp: " . date('Y-m-d H:i:s') . "
User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "
    ";
    
    // Email headers
    $headers = [
        'From: ' . $config['from_name'] . ' <' . $config['from_email'] . '>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion(),
        'X-IP: ' . $client_ip
    ];
    
    // Send email
    $mail_sent = mail(
        $config['admin_email'],
        $config['subject'] . ' - ' . $name,
        $email_body,
        implode("\r\n", $headers)
    );
    
    if (!$mail_sent) {
        error_log("Failed to send contact form email from: $email");
        sendResponse(false, 'Failed to send message. Please try again later.');
    }
    
    // Log successful submission
    error_log("Contact form submitted successfully from: $email (IP: $client_ip)");
    
    // Send success response
    sendResponse(true, 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
    
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    sendResponse(false, 'An error occurred. Please try again later.');
}
?> 