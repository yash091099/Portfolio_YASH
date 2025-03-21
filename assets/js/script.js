const menuBtn = document.getElementById('menu-btn');
const navbar = document.querySelector('.navbar');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const scrollTop = document.getElementById('scroll-top');
const preloader = document.querySelector('.preloader');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.navbar ul li a');
const exitModal = document.getElementById('exit-modal');
const stayBtn = document.getElementById('stay-btn');
const leaveBtn = document.getElementById('leave-btn');

AOS.init({
  duration: 1000,
  easing: 'ease-out',
  once: true,
  offset: 100,
});

window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.code-progress span');
  
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 1;
    
    if (progress <= 100) {
      progressFill.style.width = `${progress}%`;
      
      if (progress < 25) {
        progressText.textContent = 'Loading assets...';
      } else if (progress < 50) {
        progressText.textContent = 'Initializing components...';
      } else if (progress < 75) {
        progressText.textContent = 'Fetching projects...';
        } else {
        progressText.textContent = 'Almost ready...';
      }
    }
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      progressText.textContent = 'Complete!';
      
      setTimeout(() => {
        preloader.classList.add('hidden');
        
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    }
  }, 50);
  
  const cursor = document.querySelector('.code-cursor');
  
  setTimeout(() => {
    setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);
  }, 5000);
});

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (theme === 'dark') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
};

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  setTheme(savedTheme);
} else if (prefersDark) {
  setTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
});

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  navbar.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuBtn.classList.remove('active');
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTop.classList.add('active');
  } else {
    scrollTop.classList.remove('active');
  }
});

scrollTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

const typed = new Typed('.typing-text', {
  strings: [
    'Senior Full Stack Developer',
    'MERN Stack Developer',
    'Web3 Specialist',
    'Blockchain Developer',
    'Frontend Developer',
    'Backend Developer'
  ],
  typeSpeed: 80,
  backSpeed: 40,
  backDelay: 1500,
    loop: true,
});

particlesJS('particles-js', {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#4361ee"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.3,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#4361ee",
      "opacity": 0.2,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 0.5
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 100,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    
    showEmptyProjectsMessage();
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      contactForm.reset();
      
      submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Sent Successfully!</span>';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }, 2000);
  });
}

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  });
});

const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementPosition < windowHeight - 100) {
      const animation = element.getAttribute('data-animation');
      element.classList.add(animation);
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll();

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === "visible") {
    document.title = "Portfolio | Yash Jangid";
    $("#favicon").attr("href", "./assets/images/favicon.png");
  } else {
    document.title = "Come Back To Portfolio";
    $("#favicon").attr("href", "./assets/images/favhand.png");
  }
});

const emptyProjectsDiv = document.getElementById('empty-projects');

function showEmptyProjectsMessage() {
  const visibleProjects = Array.from(projectCards).filter(card => 
    card.style.display !== 'none'
  );
  
  if (visibleProjects.length === 0) {
    emptyProjectsDiv.classList.add('show');
  } else {
    emptyProjectsDiv.classList.remove('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showEmptyProjectsMessage();
  
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(skill => {
    skill.addEventListener('click', function() {
      const skillName = this.querySelector('h4').textContent.trim().toLowerCase();
      let url;
      
      switch(skillName) {
        case 'javascript':
          url = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';
          break;
        case 'html5':
          url = 'https://developer.mozilla.org/en-US/docs/Web/HTML';
          break;
        case 'css3':
          url = 'https://developer.mozilla.org/en-US/docs/Web/CSS';
          break;
        case 'php':
          url = 'https://www.php.net/';
          break;
        case 'sql':
          url = 'https://www.mysql.com/';
          break;
        case 'typescript':
          url = 'https://www.typescriptlang.org/';
          break;
        case 'react':
          url = 'https://reactjs.org/';
          break;
        case 'angular':
          url = 'https://angular.io/';
          break;
        case 'react native':
          url = 'https://reactnative.dev/';
          break;
        case 'scss':
          url = 'https://sass-lang.com/';
          break;
        case 'bootstrap':
          url = 'https://getbootstrap.com/';
          break;
        case 'redux':
          url = 'https://redux.js.org/';
          break;
        case 'node.js':
          url = 'https://nodejs.org/';
          break;
        case 'express.js':
          url = 'https://expressjs.com/';
          break;
        case 'mongodb':
          url = 'https://www.mongodb.com/';
          break;
        case 'laravel':
          url = 'https://laravel.com/';
          break;
        case 'graphql':
          url = 'https://graphql.org/';
          break;
        case 'redis':
          url = 'https://redis.io/';
          break;
        case 'ethereum':
          url = 'https://ethereum.org/';
          break;
        case 'git':
          url = 'https://git-scm.com/';
          break;
        case 'docker':
          url = 'https://www.docker.com/';
          break;
        case 'aws':
          url = 'https://aws.amazon.com/';
          break;
        case 'digital ocean':
          url = 'https://www.digitalocean.com/';
          break;
        case 'blockchain':
          url = 'https://www.blockchain.com/';
          break;
        default:
          url = 'https://www.google.com/search?q=' + skillName;
      }
      
      window.open(url, '_blank');
    });
  });
  
  const contactCTAs = document.querySelectorAll('.contact-cta');
  contactCTAs.forEach(cta => {
    cta.addEventListener('click', function() {
      const content = this.textContent.trim();
      if (content.includes('@')) {
        window.location.href = 'mailto:' + content;
      } else if (content.includes('+91')) {
        window.location.href = 'tel:' + content.replace(/\s/g, '');
      }
    });
  });
});

const projectModal = document.getElementById('project-modal');
const modalIframe = document.getElementById('modal-iframe');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalLoader = document.querySelector('.modal-loader');

function openDemoModal(url, title) {
  modalTitle.textContent = title || 'Project Demo';
  modalLoader.style.display = 'block';
  
  if (url && url !== '#') {
    modalIframe.src = url;
  } else {
    modalIframe.src = 'https://gityash2024.github.io/portfolio-placeholder/';
  }
  
  projectModal.classList.add('show');
  
  modalIframe.onload = function() {
    modalLoader.style.display = 'none';
  };
  
  document.body.style.overflow = 'hidden';
}

function closeDemoModal() {
  projectModal.classList.add('fade-out');
  
  setTimeout(() => {
    projectModal.classList.remove('show');
    projectModal.classList.remove('fade-out');
    modalIframe.src = 'about:blank';
    document.body.style.overflow = '';
  }, 300);
}

modalClose.addEventListener('click', closeDemoModal);

projectModal.addEventListener('click', function(e) {
  if (e.target === projectModal) {
    closeDemoModal();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && projectModal.classList.contains('show')) {
    closeDemoModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const demoButtons = document.querySelectorAll('.project-links a:first-child');
  
  demoButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const projectTitle = this.closest('.project-content').querySelector('h3').textContent;
      const demoUrl = this.getAttribute('href');
      
      openDemoModal(demoUrl, projectTitle);
    });
  });
});

window.addEventListener('beforeunload', function (e) {
  if (!exitModalShown) {
    e.preventDefault();
    e.returnValue = '';
    showExitModal();
    return '';
  }
});

let exitModalShown = false;

function showExitModal() {
  exitModalShown = true;
  exitModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

if (stayBtn) {
  stayBtn.addEventListener('click', function() {
    exitModal.classList.remove('show');
    document.body.style.overflow = '';
    exitModalShown = false;
  });
}

if (leaveBtn) {
  leaveBtn.addEventListener('click', function() {
    window.location.href = 'about:blank';
  });
}

document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

$(document).ready(function () {
  $('#menu-btn').click(function () {
    $(this).toggleClass('active');
    $('.navbar').toggleClass('active');
  });

  $(window).on('scroll load', function () {
    $('#menu-btn').removeClass('active');
    $('.navbar').removeClass('active');

    if (window.scrollY > 60) {
      $('#scroll-top').addClass('active');
    } else {
      $('#scroll-top').removeClass('active');
    }
    
    $('section').each(function () {
      let height = $(this).height();
      let offset = $(this).offset().top - 200;
      let top = $(window).scrollTop();
      let id = $(this).attr('id');

      if (top > offset && top < offset + height) {
        $('.navbar ul li a').removeClass('active');
        $('.navbar').find(`[href="#${id}"]`).addClass('active');
      }
    });
  });
});