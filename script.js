// NFC Business Card Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Add click handlers for contact actions
    initializeContactActions();
    
    // Add NFC simulation
    initializeNFCFeatures();
    
    // Add smooth scrolling
    initializeSmoothScrolling();
});

// Animation initialization
function initializeAnimations() {
    // Add loading animation to elements
    const animatedElements = document.querySelectorAll('.contact-item, .social-link, .action-btn, .about');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Contact actions initialization
function initializeContactActions() {
    // Phone number click handler
    const phoneElements = document.querySelectorAll('[onclick*="tel:"]');
    phoneElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('onclick').match(/tel:([^']+)/)[1];
            if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
                window.location.href = `tel:${phoneNumber}`;
            } else {
                copyToClipboard(phoneNumber);
                showNotification('Phone number copied to clipboard!');
            }
        });
    });
    
    // Email click handler
    const emailElements = document.querySelectorAll('[onclick*="mailto:"]');
    emailElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('onclick').match(/mailto:([^']+)/)[1];
            if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
                window.location.href = `mailto:${email}`;
            } else {
                copyToClipboard(email);
                showNotification('Email address copied to clipboard!');
            }
        });
    });
}

// NFC features simulation
function initializeNFCFeatures() {
    // Add NFC tap simulation
    const nfcIndicator = document.querySelector('.nfc-indicator');
    if (nfcIndicator) {
        nfcIndicator.addEventListener('click', function() {
            simulateNFCTap();
        });
    }
    
    // Add vibration feedback for mobile devices
    if ('vibrate' in navigator) {
        document.addEventListener('click', function(e) {
            if (e.target.closest('.action-btn, .social-link, .contact-item')) {
                navigator.vibrate(50);
            }
        });
    }
}

// Smooth scrolling initialization
function initializeSmoothScrolling() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const scrollElements = document.querySelectorAll('.contact-item, .social-link, .action-btn, .about');
    scrollElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #1e1e96 0%, #4764bb 50%);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(30, 30, 150, 0.3);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function simulateNFCTap() {
    // Add visual feedback for NFC tap
    const container = document.querySelector('.container');
    container.style.transform = 'scale(0.98)';
    container.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 100);
    
    // Show NFC sharing notification
    showNotification('📱 NFC Card Shared Successfully!');
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Save contact function
function saveContact() {
    const contactData = {
        name: document.querySelector('.name').textContent,
        title: document.querySelector('.title').textContent,
        company: document.querySelector('.company').textContent,
        phone: document.querySelector('.contact-item:nth-child(1) .value').textContent,
        email: document.querySelector('.contact-item:nth-child(2) .value').textContent,
        location: document.querySelector('.contact-item:nth-child(3) .value').textContent,
        website: document.querySelector('.contact-item:nth-child(4) .value').textContent
    };
    
    // Create vCard format
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contactData.name}
ORG:${contactData.company}
TITLE:${contactData.title}
TEL:${contactData.phone}
EMAIL:${contactData.email}
ADR:;;${contactData.location};;;
URL:${contactData.website}
END:VCARD`;
    
    // Create downloadable file
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contactData.name.replace(/\s+/g, '_')}_contact.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('Contact saved to device!');
}

// Add touch feedback for mobile devices
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        const target = e.target.closest('.contact-item, .social-link, .action-btn');
        if (target) {
            target.style.transform = 'scale(0.98)';
        }
    });
    
    document.addEventListener('touchend', function(e) {
        const target = e.target.closest('.contact-item, .social-link, .action-btn');
        if (target) {
            setTimeout(() => {
                target.style.transform = '';
            }, 100);
        }
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focused = document.activeElement;
        if (focused && (focused.classList.contains('action-btn') || focused.classList.contains('social-link'))) {
            e.preventDefault();
            focused.click();
        }
    }
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll events here if needed
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Add loading state
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add entrance animation
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px) rotateX(10deg)';
    container.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0) rotateX(0deg)';
    }, 200);
    
    // Add staggered animations for elements
    const animatedElements = document.querySelectorAll('.contact-item-3d, .social-link, .action-btn, .about');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px) rotateX(20deg)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) rotateX(0deg)';
        }, 500 + (index * 150));
    });
});

// Add error handling
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
    // You can add error reporting here
});

// Add offline detection
window.addEventListener('online', function() {
    showNotification('Connection restored!');
});

window.addEventListener('offline', function() {
    showNotification('You are offline. Some features may not work.');
});
