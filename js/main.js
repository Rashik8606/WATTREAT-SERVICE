/**
 * Wattreat Services - Premium Homepage Scripts
 * Handles mobile menus, navigation scroll effects, stats counter, project filtering, form handling, and scroll reveal animations.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Header & Active Navigation Highlight on Scroll ---
  const header = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTargets = document.querySelectorAll('.id-scroll-target, .hero');

  window.addEventListener('scroll', () => {
    // Toggle sticky class on header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spying for Active Link Highlight
    let currentId = '';
    scrollTargets.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // Highlight if within section viewport offset bounds
      if (window.scrollY >= (sectionTop - 150)) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  });


  // --- 2. Mobile Hamburger Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');

      // Prevent body scrolling when menu is active
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  // --- 3. Scroll Reveal Animation using Intersection Observer ---
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));


  // --- 4. Interactive Statistics Counter ---
  const stats = document.querySelectorAll('.stat-number');
  const statsBar = document.querySelector('.stats-counter-bar');
  let countTriggered = false;

  const runCounter = () => {
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 2000; // Animation duration in ms
      const speed = target / (duration / 16); // 16ms per frame (~60fps)

      let current = 0;
      const updateCount = () => {
        current += speed;
        if (current < target) {
          stat.innerText = Math.floor(current);
          requestAnimationFrame(updateCount);
        } else {
          stat.innerText = target;
        }
      };
      updateCount();
    });
  };

  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countTriggered) {
          runCounter();
          countTriggered = true;
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    statsObserver.observe(statsBar);
  }


  // --- 5. Portfolio/Project Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        // Flexbox animation for filter transitions
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // --- 6. Interactive Contact Form Submission & Validation ---
  const contactForm = document.getElementById('consultationForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset alerts
      formSuccess.style.display = 'none';
      formError.style.display = 'none';

      // Inputs
      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phoneNum').value.trim();
      const email = document.getElementById('emailAddr').value.trim();
      const projectType = document.getElementById('projectType').value;

      // Simple regex checks
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[6-9]\d{9}$/;

      if (!name || !projectType || !emailRegex.test(email) || !phoneRegex.test(phone)) {
        formError.style.display = 'block';
        formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Success visual feedback (Simulated API Post)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

      const scriptURL = "https://script.google.com/macros/s/AKfycbws8IbFlNl-iUHFdnMxRv76IrlskCVgamgNyB4hwOXXmCoIXvWbjj5RPVnbKoDBONqi/exec";

fetch(scriptURL, {
    method: "POST",
    // mode:"no-cors",
    body: new FormData(contactForm)
})
.then(() => {

    formSuccess.style.display = "block";
    contactForm.reset();

    submitBtn.disabled = false;
    submitBtn.innerHTML = origBtnContent;

})
.catch(error => {

    formError.style.display = "block";

    submitBtn.disabled = false;
    submitBtn.innerHTML = origBtnContent;

    console.error(error);

});
    });
  }


  // --- 7. Newsletter Form Submission ---
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        alert(`Thank you! ${emailInput.value} has been subscribed to our technical updates newsletter.`);
        emailInput.value = '';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
      }, 1000);
    });
  }

});
