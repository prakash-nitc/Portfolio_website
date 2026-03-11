/* ═══════════════════════════════════════════════════════
   AURORA PORTFOLIO — Main Script
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ─── DOM Elements ───────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const preloader     = $('#preloader');
  const constellationCanvas = $('#constellation-canvas');
  const enterBtn      = $('#enter-btn');
  const site          = $('#site');
  const auroraBg      = $('#aurora-bg');
  const navbar        = $('#navbar');
  const menuToggle    = $('#menu-toggle');
  const mobileNav     = $('#mobile-nav');
  const typingText    = $('#typing-text');
  const navLinks      = $$('.nav-link');
  const mobileNavLinks = $$('.mobile-nav-link');
  const dots          = $$('.dot');
  const sections      = $$('.section, .hero-section');

  // ─── Typing Strings ────────────────────────────────
  const typingStrings = [
    'Full Stack Developer',
    'Java & Spring Boot Enthusiast',
    'AI/ML Explorer',
    'Problem Solver @ LeetCode',
    'M.Tech CS @ NIT Calicut',
    'Building scalable systems'
  ];

  // ═══════════════════════════════════════════════════
  // CONSTELLATION INTRO ANIMATION
  // ═══════════════════════════════════════════════════
  function initConstellation() {
    const canvas = constellationCanvas;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    const PARTICLE_COUNT = 100;
    const CONNECTION_DIST = 150;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    // Init particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      animId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animId);
      particles = [];
    };
  }

  const cleanupConstellation = initConstellation();

  // ═══════════════════════════════════════════════════
  // ENTER SITE
  // ═══════════════════════════════════════════════════
  enterBtn.addEventListener('click', () => {
    preloader.classList.add('fade-out');
    cleanupConstellation();

    setTimeout(() => {
      preloader.style.display = 'none';
      site.classList.remove('hidden');
      site.style.opacity = '1';
      site.style.pointerEvents = 'auto';
      initAuroraBackground();
      startTyping();
    }, 800);
  });

  // ═══════════════════════════════════════════════════
  // AURORA BACKGROUND
  // ═══════════════════════════════════════════════════
  function initAuroraBackground() {
    const canvas = auroraBg;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 180;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Stars
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    function drawAurora() {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle aurora gradient blobs
      const auroraGradient1 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time * 0.7) * 100,
        canvas.height * 0.2 + Math.cos(time * 0.5) * 50,
        0,
        canvas.width * 0.3,
        canvas.height * 0.2,
        canvas.width * 0.4
      );
      auroraGradient1.addColorStop(0, 'rgba(0, 229, 255, 0.03)');
      auroraGradient1.addColorStop(1, 'transparent');
      ctx.fillStyle = auroraGradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const auroraGradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(time * 0.4) * 80,
        canvas.height * 0.6 + Math.sin(time * 0.6) * 60,
        0,
        canvas.width * 0.7,
        canvas.height * 0.6,
        canvas.width * 0.35
      );
      auroraGradient2.addColorStop(0, 'rgba(168, 85, 247, 0.025)');
      auroraGradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = auroraGradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * 100 * star.speed + star.phase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 240, ${star.alpha * twinkle * 0.6})`;
        ctx.fill();
      });

      requestAnimationFrame(drawAurora);
    }

    drawAurora();
  }

  // ═══════════════════════════════════════════════════
  // TYPING ANIMATION
  // ═══════════════════════════════════════════════════
  function startTyping() {
    let strIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
      const currentStr = typingStrings[strIndex];

      if (isDeleting) {
        charIndex--;
        typeSpeed = 40;
      } else {
        charIndex++;
        typeSpeed = 80 + Math.random() * 40; // Slightly random for human feel
      }

      typingText.textContent = currentStr.substring(0, charIndex);

      if (!isDeleting && charIndex === currentStr.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        strIndex = (strIndex + 1) % typingStrings.length;
        typeSpeed = 500; // Brief pause before next word
      }

      setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1500);
  }

  // ═══════════════════════════════════════════════════
  // NAVBAR SCROLL BEHAVIOR
  // ═══════════════════════════════════════════════════
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add/remove scrolled class
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active section
    updateActiveSection();

    lastScroll = scrollY;
  });

  // ═══════════════════════════════════════════════════
  // ACTIVE SECTION TRACKING
  // ═══════════════════════════════════════════════════
  function updateActiveSection() {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    // Update nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });

    // Update dots
    dots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.dataset.section === current) {
        dot.classList.add('active');
      }
    });
  }

  // ═══════════════════════════════════════════════════
  // MOBILE MENU
  // ═══════════════════════════════════════════════════
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ═══════════════════════════════════════════════════
  // SMOOTH SCROLL FOR NAV LINKS
  // ═══════════════════════════════════════════════════
  [...navLinks, ...mobileNavLinks, ...dots].forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ═══════════════════════════════════════════════════
  // SCROLL INDICATOR HIDE ON SCROLL
  // ═══════════════════════════════════════════════════
  const scrollIndicator = $('#scroll-indicator');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      scrollIndicator.style.opacity = '0';
    } else {
      scrollIndicator.style.opacity = '';
    }
  });

})();
