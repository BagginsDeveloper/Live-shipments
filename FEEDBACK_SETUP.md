# Feedback Email Setup Guide

## Current Implementation

The feedback modal currently has two options for sending emails:

### Option 1: Formspree (Recommended)
1. Go to [https://formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form
4. Copy your form ID (it will look like `xrgjqjqj`)
5. Replace `YOUR_FORM_ID` in `src/components/FeedbackModal.tsx` with your actual form ID
6. Configure the form to forward emails to `Cameron@3plsystems.com` and `Michael@3plsystems.com`

### Option 2: EmailJS (Alternative)
If you prefer to use EmailJS:

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Create an account and set up an email service
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Replace the placeholder values in the code with your actual IDs

### Option 3: Fallback (Current)
If neither service is configured, the system will open the user's default email client with a pre-filled email to the specified addresses.

## Configuration Steps

### For Formspree:
1. Update line 18 in `src/components/FeedbackModal.tsx`:
   ```javascript
   const formspreeEndpoint = 'https://formspree.io/f/YOUR_ACTUAL_FORM_ID';
   ```

### For EmailJS:
1. Uncomment the EmailJS import
2. Replace the placeholder values:
   ```javascript
   const serviceId = 'your_service_id';
   const templateId = 'your_template_id';
   const publicKey = 'your_public_key';
   ```

## Testing
After setup, test the feedback form to ensure emails are being sent to the correct addresses.

## Security Notes
- Formspree and EmailJS are third-party services
- Consider implementing server-side email sending for production use
- The current implementation includes fallback options for reliability 