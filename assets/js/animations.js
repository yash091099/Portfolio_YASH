// Animations.js - Handles all animation related functionality

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 1000,
    easing: 'ease-out',
    once: false,
    offset: 100,
    delay: 100,
    mirror: true,
  });

  // Re-initialize AOS on window resize
  window.addEventListener('resize', () => {
    AOS.refresh();
  });
});

// Add mousemove parallax effect to shapes
document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.shape');
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  
  shapes.forEach((shape, index) => {
    const speed = index * 0.01 + 0.02;
    const x = (window.innerWidth - mouseX * speed) / 100;
    const y = (window.innerHeight - mouseY * speed) / 100;
    
    shape.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.5}deg)`;
  });
});

// Add hover effects to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-15px)';
    card.style.boxShadow = '0 15px 30px var(--shadow-color)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 5px 15px var(--shadow-color)';
  });
});

// Add hover effects to skill items
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-10px) scale(1.05)';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0) scale(1)';
  });
});

// Add tilt effect to images
const applyTiltEffect = (element, settings = {}) => {
  const defaults = {
    max: 15,
    perspective: 1000,
    scale: 1.05,
    speed: 300,
    easing: 'cubic-bezier(.03,.98,.52,.99)'
  };
  
  const config = { ...defaults, ...settings };
  
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercentage = x / rect.width;
    const yPercentage = y / rect.height;
    
    const xRotation = config.max * (0.5 - yPercentage);
    const yRotation = config.max * (xPercentage - 0.5);
    
    const transform = `
      perspective(${config.perspective}px)
      scale(${config.scale})
      rotateX(${xRotation}deg)
      rotateY(${yRotation}deg)
    `;
    
    element.style.transition = '';
    element.style.transform = transform;
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transition = `transform ${config.speed}ms ${config.easing}`;
    element.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
  });
};

// Apply tilt effect to profile image
const profileImage = document.querySelector('.about-content .image');
if (profileImage) {
  applyTiltEffect(profileImage, { max: 10 });
}

// Text reveal animation for section titles
const revealText = () => {
  const titles = document.querySelectorAll('.section-title');
  
  titles.forEach(title => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          title.classList.add('reveal');
          observer.unobserve(title);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(title);
  });
};

// Call the text reveal function
revealText();

// Add animation to timeline items
const animateTimeline = () => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.2}s`;
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          item.classList.add('animate');
          observer.unobserve(item);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(item);
  });
};

// Call the timeline animation function
animateTimeline();