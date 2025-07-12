<?php
/**
 * WhatsApp Configuration
 * Loads environment variables and provides configuration for WhatsApp API
 */

class WhatsAppConfig {
    private $phoneNumber;
    private $accountNumber;
    private $apiKey;
    private $templateName;
    
    public function __construct() {
        $this->loadEnvironmentVariables();
    }
    
    /**
     * Load environment variables from .env file
     */
    private function loadEnvironmentVariables() {
        $envFile = __DIR__ . '/../.env';
        
        if (!file_exists($envFile)) {
            throw new Exception('.env file not found. Please copy env.example to .env and configure your settings.');
        }
        
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            if (strpos($line, '#') === 0) {
                continue; // Skip comments
            }
            
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                $value = trim($value, '"\'');
                
                switch ($key) {
                    case 'WHATSAPP_PHONE_NUMBER':
                        $this->phoneNumber = $value;
                        break;
                    case 'WHATSAPP_ACCOUNT_NUMBER':
                        $this->accountNumber = $value;
                        break;
                    case 'WHATSAPP_API_KEY':
                        $this->apiKey = $value;
                        break;
                    case 'WHATSAPP_TEMPLATE_NAME':
                        $this->templateName = $value;
                        break;
                }
            }
        }
        
        // Validate required variables
        $this->validateConfiguration();
    }
    
    /**
     * Validate that all required configuration is present
     */
    private function validateConfiguration() {
        $required = ['phoneNumber', 'accountNumber', 'apiKey', 'templateName'];
        
        foreach ($required as $field) {
            if (empty($this->$field)) {
                throw new Exception("Missing required configuration: $field");
            }
        }
    }
    
    /**
     * Get phone number
     */
    public function getPhoneNumber() {
        return $this->phoneNumber;
    }
    
    /**
     * Get account number
     */
    public function getAccountNumber() {
        return $this->accountNumber;
    }
    
    /**
     * Get API key
     */
    public function getApiKey() {
        return $this->apiKey;
    }
    
    /**
     * Get template name
     */
    public function getTemplateName() {
        return $this->templateName;
    }
}
?> 