<?php
/**
 * Test file to debug WhatsApp configuration
 * Access this file directly in your browser to test the setup
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>WhatsApp Configuration Test</h1>";

try {
    // Test if config file exists
    if (!file_exists('config.php')) {
        throw new Exception('config.php file not found');
    }
    
    echo "<p>✅ config.php file found</p>";
    
    // Include configuration
    require_once 'config.php';
    
    echo "<p>✅ config.php loaded successfully</p>";
    
    // Test environment file
    $envFile = __DIR__ . '/../.env';
    if (!file_exists($envFile)) {
        throw new Exception('.env file not found. Please copy env.example to .env and configure your settings.');
    }
    
    echo "<p>✅ .env file found</p>";
    
    // Initialize configuration
    $config = new WhatsAppConfig();
    
    echo "<p>✅ WhatsAppConfig initialized successfully</p>";
    
    // Test configuration values
    echo "<h2>Configuration Values:</h2>";
    echo "<ul>";
    echo "<li><strong>Phone Number:</strong> " . $config->getPhoneNumber() . "</li>";
    echo "<li><strong>Account Number:</strong> " . $config->getAccountNumber() . "</li>";
    echo "<li><strong>API Key:</strong> " . substr($config->getApiKey(), 0, 10) . "...</li>";
    echo "<li><strong>Template Name:</strong> " . $config->getTemplateName() . "</li>";
    echo "</ul>";
    
    echo "<h2>Test Form Data:</h2>";
    $testData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '1234567890',
        'message' => 'This is a test message from the test script.'
    ];
    
    echo "<p>Test data prepared successfully</p>";
    
    // Test WhatsApp data preparation
    $whatsappData = [
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
                            "text" => $testData['name']
                        ],
                        [
                            "type" => "text",
                            "text" => $testData['phone']
                        ],
                        [
                            "type" => "text",
                            "text" => $testData['email']
                        ],
                        [
                            "type" => "text",
                            "text" => $testData['message']
                        ]
                    ]
                ]
            ]
        ]
    ];
    
    echo "<p>✅ WhatsApp data structure prepared</p>";
    
    // Test JSON encoding
    $jsonData = json_encode($whatsappData);
    if ($jsonData === false) {
        throw new Exception('Failed to encode test data to JSON');
    }
    
    echo "<p>✅ JSON encoding successful</p>";
    
    // Test cURL availability
    if (!function_exists('curl_init')) {
        throw new Exception('cURL extension is not available');
    }
    
    echo "<p>✅ cURL extension available</p>";
    
    echo "<h2>✅ All tests passed! Your configuration is working correctly.</h2>";
    echo "<p><strong>Note:</strong> This test doesn't actually send a WhatsApp message. It only validates your configuration.</p>";
    
} catch (Exception $e) {
    echo "<h2>❌ Error:</h2>";
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
    
    echo "<h3>Debugging Steps:</h3>";
    echo "<ol>";
    echo "<li>Make sure you've copied <code>env.example</code> to <code>.env</code></li>";
    echo "<li>Check that all required values are filled in your <code>.env</code> file</li>";
    echo "<li>Verify your PHP version supports the features used</li>";
    echo "<li>Check that cURL extension is enabled in PHP</li>";
    echo "</ol>";
}
?> 