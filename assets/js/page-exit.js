// Page Exit Confirmation
document.addEventListener('DOMContentLoaded', function() {
    // Add confirmation when leaving the website
    window.addEventListener('beforeunload', function (e) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
        
        // This message may not be displayed in modern browsers 
        // as they have their own standard messages
        return 'Are you sure you want to leave this page?';
    });
    
    console.log('Page exit confirmation added');
}); 