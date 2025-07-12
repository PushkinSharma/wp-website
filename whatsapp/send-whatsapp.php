<?php
/**
 * WhatsApp Message Sender
 * Handles form submission and sends WhatsApp messages using template
 */

// Prevent any output before JSON response
ob_start();

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Changed to 0 to prevent output

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Include configuration
    require_once 'config.php';
    
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }
    
    // Validate and sanitize form data
    $formData = validateAndSanitizeFormData($_POST);
    
    // Initialize configuration
    $config = new WhatsAppConfig();
    
    // Prepare WhatsApp message data
    $whatsappData = prepareWhatsAppData($formData, $config);
    
    // Send WhatsApp message
    $response = sendWhatsAppMessage($whatsappData, $config);
    
    // Clear any output buffer
    ob_clean();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully!',
        'data' => $response
    ]);
    
} catch (Exception $e) {
    // Clear any output buffer
    ob_clean();
    
    // Return error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

/**
 * Validate and sanitize form data
 */
function validateAndSanitizeFormData($postData) {
    $errors = [];
    $data = [];
    
    // Validate name
    if (empty($postData['name'])) {
        $errors[] = 'Name is required';
    } else {
        $data['name'] = trim(htmlspecialchars($postData['name'], ENT_QUOTES, 'UTF-8'));
        if (strlen($data['name']) < 2) {
            $errors[] = 'Name must be at least 2 characters long';
        }
    }
    
    // Validate email
    if (empty($postData['email'])) {
        $errors[] = 'Email is required';
    } else {
        $data['email'] = trim(filter_var($postData['email'], FILTER_SANITIZE_EMAIL));
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address';
        }
    }
    
    // Validate phone (optional but if provided, must be valid)
    if (!empty($postData['phone'])) {
        $data['phone'] = trim(htmlspecialchars($postData['phone'], ENT_QUOTES, 'UTF-8'));
        // Remove any non-digit characters
        $phoneDigits = preg_replace('/[^0-9]/', '', $data['phone']);
        if (strlen($phoneDigits) < 10) {
            $errors[] = 'Please enter a valid phone number (at least 10 digits)';
        } else {
            $data['phone'] = $phoneDigits;
        }
    } else {
        $data['phone'] = 'Not provided';
    }
    
    // Validate message
    if (empty($postData['message'])) {
        $errors[] = 'Message is required';
    } else {
        $data['message'] = trim(htmlspecialchars($postData['message'], ENT_QUOTES, 'UTF-8'));
        if (strlen($data['message']) < 10) {
            $errors[] = 'Message must be at least 10 characters long';
        }
    }
    
    // Check for honeypot (spam protection)
    if (!empty($postData['honeypot'])) {
        $errors[] = 'Invalid submission';
    }
    
    if (!empty($errors)) {
        throw new Exception(implode(', ', $errors));
    }
    
    return $data;
}

/**
 * Prepare WhatsApp message data
 */
function prepareWhatsAppData($formData, $config) {
    return [
        "messaging_product" => "whatsapp",
        "recipient_type" => "individual",
        "to" => $config->getPhoneNumber(),
        "type" => "template",
        "template" => [
            "name" => $config->getTemplateName(),
            "language" => [
                "code" => "en"
            ],
            "components" => [
                [
                    "type" => "body",
                    "parameters" => [
                        [
                            "type" => "text",
                            "text" => $formData['name']
                        ],
                        [
                            "type" => "text",
                            "text" => $formData['phone']
                        ],
                        [
                            "type" => "text",
                            "text" => $formData['email']
                        ],
                        [
                            "type" => "text",
                            "text" => $formData['message']
                        ]
                    ]
                ]
            ]
        ]
    ];
}

/**
 * Send WhatsApp message via API
 */
function sendWhatsAppMessage($data, $config) {
    $jsonData = json_encode($data);
    
    if ($jsonData === false) {
        throw new Exception('Failed to encode message data');
    }
    
    $curl = curl_init();
    
    if (!$curl) {
        throw new Exception('Failed to initialize cURL');
    }
    
    $url = "https://partnersv1.pinbot.ai/v3/" . $config->getAccountNumber() . "/messages";
    
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $jsonData,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "apikey: " . $config->getApiKey(),
        ],
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    
    curl_close($curl);
    
    if ($error) {
        throw new Exception('cURL Error: ' . $error);
    }
    
    if ($httpCode !== 200) {
        $responseData = json_decode($response, true);
        $errorMessage = isset($responseData['error']) ? $responseData['error']['message'] : 'Unknown API error';
        throw new Exception('WhatsApp API Error: ' . $errorMessage . ' (HTTP ' . $httpCode . ')');
    }
    
    return json_decode($response, true);
}
?>