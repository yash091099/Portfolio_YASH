
$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
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

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        event.preventDefault();
        document.getElementById("contact-form").reset();
        alert("Form Submitted Successfully");
        // Your EmailJS code to send the form data
        // emailjs.sendForm('contact_service', 'template_contact', this)
        //   .then(function (response) {
        //     console.log('SUCCESS!', response.status, response.text);
        //     document.getElementById("contact-form").reset();
        //     alert("Form Submitted Successfully");
        //   }, function (error) {
        //     console.log('FAILED...', error);
        //     alert("Form Submission Failed! Try Again");
        //   });
      });
      
    // <!-- emailjs to mail contact form data -->

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Yash Jangid";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["frontend development","web designing", "web development"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->
const skillsData=[
    {
        "name": "AngularJS",
        "icon": "https://img.icons8.com/?size=512&id=71257&format=png"
    },
    {
        "name": "ReactJS",
        "icon": "https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/000000/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png"
    },
    {
        "name": "JavaScript",
        "icon": "https://img.icons8.com/color/48/000000/javascript--v1.png"
    },
    {
        "name": "Python",
        "icon": "https://img.icons8.com/color/48/000000/python--v1.png"
    },
    {
        "name": "Bootstrap",
        "icon": "https://img.icons8.com/color/48/000000/bootstrap.png"
    },
    {
        "name": "HTML5",
        "icon": "https://img.icons8.com/color/48/000000/html-5--v1.png"
    },
    {
        "name": "CSS3",
        "icon": "https://img.icons8.com/color/48/000000/css3.png"
    },
    
    {
        "name": "ExpressJS",
        "icon": "https://img.icons8.com/fluency/48/000000/node-js.png"
    },
    {
        "name": "NodeJS",
        "icon": "https://img.icons8.com/color/48/000000/nodejs.png"
    },
   
   
    {
        "name": "MongoDB",
        "icon": "https://img.icons8.com/color/48/000000/mongodb.png"
    },
    {
        "name": "jQuery",
        "icon": "https://img.icons8.com/ios-filled/48/1169ae/jquery.png"
    },
   
    {
        "name": "GitHub",
        "icon": "https://img.icons8.com/glyph-neue/48/ffffff/github.png"
    }    
]

const projectsData=[
    {
      "name": "TDX Launchpad",
      "desc": "TDx is a launchpad with highly vetted projects where users can invest $100-$500 without the need to stake it like in other launchpads.",
      "image": "assets/images/projects/tdx.png",
      "category": "WebApp",
      "links": {
        "visit": "https://tdx.biz/",
        status:'Visit'
      }
    },
    {
      "name": "Bizthon",
      "desc": "BizThon is a Global Business Hackathon with the underlying mission to empower innovators, developers, and entrepreneurs building project ideas.",
      "image": "assets/images/projects/bizthon.png",
      "category": "WebApp",
      "links": {
        "visit":"https://bizthon.com/",
        status:'Visit'
      }

    },
    {
        "name": "Trade Dog",
        "desc": "Crypto Research & Analysis Platform where smart Investors get data driven AI/ML based trading strategies and experts advices.",
        "image": "assets/images/projects/tradeDog.png",
        "category": "Web App",
        "links": {
          "visit": "https://tradedog.io/",
          status:'Visit'
        }
      },
    
    {
      "name": "T-Pro",
      "desc": "Streamline projects with widget-centric management, fostering collaboration among teams and unifying task organization within a single platform.",
      "image": "assets/images/projects/tPro.png",
      "category": "Web App",
      "links": {
        "visit": "https://pro.ith.tech/",
        status:'Visit'
      }
    },
    {
        "name": "Chat Application",
        "desc": "A group chat web application made by socket.io and node JS fully responsive, there is no limit for number of peoples connected and have easy to understand user interface.",
        "image": "assets/images/projects/chatApplication.png",
        "category": "Code",
        "links": {
          "code": "https://github.com/yash500071155/chatApplication",
          status:'Code'
        }
      },
    {
      "name": "Social-X",
      "desc": "Marketing platform designed to help you grow & engage your social community.",
      "image": "assets/images/projects/socialx.png",
      "category": "Developing",
      "links": {
        status:'Developing...'
      }
    }
  ]
  

async function fetchData(type = "skills") {
    const data = type==="skills" ? skillsData : projectsData
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img class='stack-icon' src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    projects.slice(0, 10).forEach(project => {
        projectHTML += `
        <div class="box tilt">
      <img draggable="false" src="${project.image}" alt="project" />
      <div class="content">
        <div class="tag">
        <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            <a href="${project.links.status === 'Developing...' ? '#' : (project.links.visit || project.links.code)}" class="btn ${project.links.status === 'Developing...' ? 'disabled' : ''}" target="_blank">
                <i class="fas fa-eye"></i> ${project.links.status}
            </a>
          </div>
        </div>
      </div>
    </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .box', { interval: 200 });

}

fetchData().then(data => {
    console.log('fetching data.........................')
    showSkills(data);
});

fetchData("projects").then(data => {
    showProjects(data);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
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


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });