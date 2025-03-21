// Exit Modal Handler
document.addEventListener('DOMContentLoaded', function() {
    const exitModal = document.getElementById('exit-modal');
    const stayBtn = document.getElementById('stay-btn');
    const leaveBtn = document.getElementById('leave-btn');
    let isExiting = false;
    let isInternalNavigation = false;
    let hasShownExitIntent = false;
    let mouseLeaveSensitivity = 20; // How many pixels from top to trigger
    
    // Track internal link clicks to avoid showing exit modal for internal navigation
    document.querySelectorAll('a').forEach(link => {
        // Only apply to internal links
        if (
            link.host === window.location.host || 
            link.getAttribute('href')?.startsWith('#') ||
            link.getAttribute('href')?.startsWith('/')
        ) {
            link.addEventListener('click', function() {
                isInternalNavigation = true;
                // Reset after a short time to handle cancel navigation
                setTimeout(() => {
                    isInternalNavigation = false;
                }, 100);
            });
        }
    });
    
    // Handle form submissions as internal navigation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            isInternalNavigation = true;
            setTimeout(() => {
                isInternalNavigation = false;
            }, 100);
        });
    });
    
    // Track mouse movement for exit intent
    document.addEventListener('mousemove', function(e) {
        // If the visitor's mouse moves to the top of the page, assume they're leaving
        if (!hasShownExitIntent && !isInternalNavigation && e.clientY < mouseLeaveSensitivity) {
            showExitModal();
            hasShownExitIntent = true;
        }
    });
    
    // Backup: show exit modal when user tries to leave (may not work in all browsers)
    window.addEventListener('beforeunload', function(e) {
        // Skip if it's internal navigation, already showing exit intent, or already confirmed exit
        if (!isExiting && !isInternalNavigation && !hasShownExitIntent) {
            showExitModal();
            
            // Some browsers might still use this message
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = '';
            return '';
        }
    });
    
    // Function to show exit modal
    function showExitModal() {
        // Only show once per session
        if (hasShownExitIntent) return;
        
        exitModal?.style?.display = 'flex';
        
        // Add subtle animation
        setTimeout(() => {
            exitModal?.style?.opacity = '1';
            exitModal.classList.add('active');
        }, 10);
        
        hasShownExitIntent = true;
    }
    
    // Hide exit modal
    function hideExitModal() {
        exitModal?.style?.opacity = '0';
        exitModal.classList.remove('active');
        
        setTimeout(() => {
            exitModal.style.display = 'none';
        }, 300);
    }
    
    // Stay button - user decides to stay
    stayBtn.addEventListener('click', function() {
        hideExitModal();
    });
    
    // Leave button - user confirms they want to leave
    leaveBtn.addEventListener('click', function() {
        isExiting = true;
        hideExitModal();
        
        // Redirect to an external site or just close
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 300);
    });
    
    // Close modal if user clicks outside of content
    exitModal.addEventListener('click', function(e) {
        if (e.target === exitModal) {
            hideExitModal();
        }
    });
    
    // Make sure to handle ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && exitModal.style.display === 'flex') {
            hideExitModal();
        }
    });
    
    // Reset exit intent detection after some time (30 seconds)
    setInterval(() => {
        if (!exitModal.classList.contains('active')) {
            hasShownExitIntent = false;
        }
    }, 30000);
}); 