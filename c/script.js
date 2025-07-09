// Import the functions you need from the SDKs you need
import { ref, push } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { logEvent } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";

// Get the initialized database and analytics instances
const database = window.firebaseDatabase;
const analytics = window.analytics;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('status');

    // Replace with your Google Apps Script Web App URL
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzg7IDQxhbHI7W-3bzQETf8wpCtV7bhQ9uy9-6S1RsxERXCeZhKDmwQPRVwTB4PPrt9ww/exec';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim(),
            timestamp: new Date().toISOString()
        };

        try {
            // Show loading status
            showStatus('Sending...', 'info');

            // Send to Firebase
            await saveToFirebase(formData);

            // Send to Google Sheets
            await saveToGoogleSheets(formData);

            // Log successful submission to analytics
            logEvent(analytics, 'form_submission', {
                success: true
            });

            // Show success message
            showStatus('Form submitted successfully!', 'success');
            
            // Reset form
            form.reset();

        } catch (error) {
            console.error('Error:', error);
            // Log failed submission to analytics
            logEvent(analytics, 'form_submission', {
                success: false,
                error: error.message
            });
            showStatus(`Error: ${error.message}`, 'error');
        }
    });

    async function saveToFirebase(data) {
        try {
            console.log('Saving to Firebase:', data);
            // Get a reference to the submissions node
            const submissionsRef = ref(database, 'submissions');
            
            // Push data to 'submissions' node
            const result = await push(submissionsRef, data);
            console.log('Successfully saved to Firebase:', result);
        } catch (error) {
            console.error('Firebase Error:', error);
            throw new Error(`Firebase Error: ${error.message}`);
        }
    }

    async function saveToGoogleSheets(data) {
        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Due to CORS restrictions, we can't actually check the response
            // The no-cors mode doesn't allow us to read the response
            // We'll assume it worked if no error was thrown
        } catch (error) {
            console.error('Google Sheets Error:', error);
            throw new Error(`Google Sheets Error: ${error.message}`);
        }
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        
        if (type === 'success' || type === 'error') {
            // Clear status after 5 seconds
            setTimeout(() => {
                statusDiv.className = 'status';
                statusDiv.textContent = '';
            }, 5000);
        }
    }
}); 