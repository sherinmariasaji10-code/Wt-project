document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.visibility = 'hidden';
      preloader.style.display = 'none';
      document.body.style.overflowY = 'auto'; // ensure scrolling is enabled
    }, 500);
  });

  // --- Dark Mode Toggle with localStorage ---
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      icon.classList.replace('fa-sun', 'fa-moon');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
    }
  });

  // --- Mobile Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (mobileMenu.classList.contains('open')) {
      icon.classList.replace('fa-bars', 'fa-times');
    } else {
      icon.classList.replace('fa-times', 'fa-bars');
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
  });

  // --- Sticky Navbar & Active Section Highlighting ---
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Sticky nav styling
    if (window.scrollY > 50) {
      navbar.style.boxShadow = 'var(--shadow)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    // Active Section Scroll Spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // offset for fixed navbar
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll-to-Top Button ---
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Scroll Animations (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  fadeElements.forEach(el => appearOnScroll.observe(el));

  // --- Modal System ---
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const closeBtns = document.querySelectorAll('.close-modal');

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling
  };

  const closeModal = () => {
    modals.forEach(m => m.classList.remove('active'));
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // --- Global Search System ---
  const searchInput = document.getElementById('global-search');
  const searchItems = [
    ...document.querySelectorAll('.service-card'),
    ...document.querySelectorAll('.portfolio-item')
  ];

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    searchItems.forEach(item => {
      const text = item.innerText.toLowerCase();
      if (text.includes(term)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    // Reset portfolio filters when searching
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
  });

  // --- Portfolio Dynamic Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear search input if user clicks filter
      searchInput.value = '';

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        item.style.transform = 'scale(0)';
        item.style.opacity = '0';
        
        setTimeout(() => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.transform = 'scale(1)';
              item.style.opacity = '1';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // --- Contact Form Validation ---
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formFeedback = document.getElementById('form-feedback');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setInvalid = (input) => {
    input.parentElement.classList.add('invalid');
  };

  const setValid = (input) => {
    input.parentElement.classList.remove('invalid');
  };

  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') setValid(input);
      if (input.type === 'email' && validateEmail(input.value)) setValid(input);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim() === '') {
      setInvalid(nameInput);
      isValid = false;
    } else {
      setValid(nameInput);
    }

    if (!validateEmail(emailInput.value)) {
      setInvalid(emailInput);
      isValid = false;
    } else {
      setValid(emailInput);
    }

    if (messageInput.value.trim() === '') {
      setInvalid(messageInput);
      isValid = false;
    } else {
      setValid(messageInput);
    }

    if (isValid) {
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      btn.innerText = 'Sending...';
      btn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        formFeedback.innerText = 'Message sent successfully! We will get back to you soon.';
        formFeedback.className = 'form-feedback success';
        contactForm.reset();
        btn.innerText = originalText;
        btn.disabled = false;
        
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 5000);
      }, 1500);
    } else {
      formFeedback.innerText = 'Please correct the errors before submitting.';
      formFeedback.className = 'form-feedback error';
    }
  });

});
