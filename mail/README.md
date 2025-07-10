# Enhanced Contact Form Setup Guide

## Overview

This enhanced contact form includes comprehensive security measures, validation, and email functionality. It's designed to be secure, user-friendly, and SEO-optimized.

## Features

### Security Features

- ✅ CSRF Protection
- ✅ Honeypot Anti-Spam
- ✅ Rate Limiting
- ✅ reCAPTCHA Integration
- ✅ Input Sanitization
- ✅ XSS Protection

### Validation Features

- ✅ Real-time Client-side Validation
- ✅ Server-side Validation
- ✅ Character Counters
- ✅ International Phone Support
- ✅ Email Format Validation

### User Experience

- ✅ Loading States
- ✅ Success/Error Messages
- ✅ Accessibility Support
- ✅ Mobile Responsive
- ✅ Keyboard Navigation

## Setup Instructions

### 1. File Structure

```
your-website/
├── index.html
├── css/
│   ├── styles.css
│   └── contact-form.css
├── js/
│   └── validateForm.js
└── mail/
    ├── process-contact.php
    ├── config.php
    └── README.md
```

### 2. Email Configuration

#### Update `mail/config.php`:

```php
$config = [
    'admin_email' => 'info@abc.in',  // Your email address
    'from_email' => 'noreply@yourdomain.com',  // Must be from your domain
    'from_name' => 'Your Website Contact Form',
    // ... other settings
];
```

#### Important Email Settings:

- **admin_email**: Where you want to receive contact form submissions
- **from_email**: Should be from your domain (e.g., noreply@yourdomain.com)
- **from_name**: Display name for the email sender

### 3. reCAPTCHA Setup

#### Get reCAPTCHA Keys:

1. Go to https://www.google.com/recaptcha/admin
2. Create a new site
3. Choose reCAPTCHA v2 "I'm not a robot"
4. Add your domain
5. Get Site Key and Secret Key

#### Update Configuration:

```php
// In mail/config.php
'recaptcha_site_key' => 'YOUR_SITE_KEY_HERE',
'recaptcha_secret_key' => 'YOUR_SECRET_KEY_HERE',
```

#### Update HTML:

```html
<!-- In index.html, replace YOUR_RECAPTCHA_SITE_KEY -->
<div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY_HERE"></div>
```

### 4. Server Requirements

#### PHP Requirements:

- PHP 7.4 or higher
- `mail()` function enabled
- `session` support
- `file_get_contents()` for reCAPTCHA

#### Recommended Extensions:

- `openssl` for secure token generation
- `curl` for better HTTP requests (optional)

### 5. File Permissions

Ensure the mail directory is writable for logging:

```bash
chmod 755 mail/
chmod 644 mail/*.php
```

### 6. Testing

#### Test the Form:

1. Fill out the contact form
2. Complete reCAPTCHA
3. Submit and check your email
4. Verify rate limiting works

#### Test Security Features:

1. Try submitting without reCAPTCHA
2. Fill the honeypot field
3. Submit multiple times quickly
4. Try XSS in the message field

## Customization

### Styling

Edit `css/contact-form.css` to match your website's design:

```css
.contact-form {
    /* Your custom styles */
}
```

### Validation Rules

Update validation rules in `mail/config.php`:

```php
$validation_rules = [
    'name' => [
        'required' => true,
        'min_length' => 2,
        'max_length' => 50,
        // ... other rules
    ],
    // ... other fields
];
```

### Error Messages

Customize error messages in `mail/config.php`:

```php
$error_messages = [
    'name' => [
        'required' => 'Your custom error message',
        // ... other messages
    ],
    // ... other fields
];
```

## Security Best Practices

### 1. HTTPS

Always use HTTPS in production to protect form data.

### 2. Email Security

- Use SPF, DKIM, and DMARC records
- Configure proper email headers
- Monitor spam reports

### 3. Server Security

- Keep PHP updated
- Use secure hosting
- Monitor server logs
- Implement firewall rules

### 4. Regular Maintenance

- Update reCAPTCHA keys periodically
- Monitor form submissions
- Check error logs
- Update dependencies

## Troubleshooting

### Common Issues

#### Emails Not Sending

1. Check server mail configuration
2. Verify `from_email` domain
3. Check spam folder
4. Review server error logs

#### reCAPTCHA Not Working

1. Verify site key and secret key
2. Check domain configuration
3. Ensure HTTPS is enabled
4. Clear browser cache

#### Form Validation Errors

1. Check JavaScript console
2. Verify PHP error logs
3. Test individual validation rules
4. Check file permissions

### Debug Mode

Enable debug mode in `mail/config.php`:

```php
'debug_mode' => true,
'log_errors' => true,
```

## Performance Optimization

### 1. Caching

- Enable browser caching for CSS/JS
- Use CDN for reCAPTCHA
- Optimize images

### 2. Loading

- Load reCAPTCHA asynchronously
- Minimize CSS/JS files
- Use lazy loading for images

### 3. Database (Optional)

For high-traffic sites, consider storing submissions in a database:

```php
$db_config = [
    'use_database' => true,
    // ... database settings
];
```

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review server error logs
3. Test with debug mode enabled
4. Verify all configuration settings

## Changelog

### Version 2.0 (Current)

- Enhanced security features
- Real-time validation
- Better user experience
- Comprehensive documentation

### Version 1.0

- Basic form functionality
- Simple validation
- Email sending

## License

This contact form is provided as-is for educational and commercial use. Please ensure compliance with your hosting provider's terms of service.
