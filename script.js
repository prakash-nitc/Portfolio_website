/* ═══════════════════════════════════════════════════════
   AURORA PORTFOLIO — Main Script
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ─── DOM shorthand ──────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const preloader      = $('#preloader');
  const constCanvas    = $('#constellation-canvas');
  const site           = $('#site');
  const auroraBg       = $('#aurora-bg');
  const navbar         = $('#navbar');
  const menuToggle     = $('#menu-toggle');
  const mobileNav      = $('#mobile-nav');
  const typingText     = $('#typing-text');
  const navLinks       = $$('.nav-link');
  const mobileNavLinks = $$('.mobile-nav-link');
  const dots           = $$('.dot');
  const sections       = $$('.section, .hero-section');

  // ─── Typing strings ─────────────────────────────────
  const typingStrings = [
    'Full Stack Developer',
    'Java & Spring Boot Engineer',
    'AI / ML Explorer',
    'M.Tech CS @ NIT Calicut',
    'Systems Programmer',
    'Building scalable solutions'
  ];

  // ═══════════════════════════════════════════════════
  // CONSTELLATION (preloader background)
  // ═══════════════════════════════════════════════════
  function initConstellation() {
    const canvas = constCanvas;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    const COUNT = 100;
    const DIST = 150;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r  = Math.random() * 2 + 0.5;
        this.a  = Math.random() * 0.6 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${this.a})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${(1 - d / DIST) * 0.14})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => { cancelAnimationFrame(animId); particles = []; };
  }

  const stopConstellation = initConstellation();

  // ═══════════════════════════════════════════════════
  // CINEMATIC PRELOADER — auto-runs, no button
  // ═══════════════════════════════════════════════════
  function runPreloader() {
    const counterEl  = $('#pre-counter');
    const fillEl     = $('#pre-fill');
    const nameEl     = $('#pre-name');
    const preUI      = document.querySelector('.preloader-ui');
    const curtainTop = $('#curtain-top');
    const curtainBot = $('#curtain-bottom');

    const FINAL = 'PRAKASH KUMAR SARANGI';
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ▓░▒■□@#$%';

    function scramble(pct) {
      const revealed = Math.floor((pct / 100) * FINAL.length);
      return [...FINAL].map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < revealed) return ch;
        return (Math.random() < 0.55) ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('');
    }

    let progress = 0;

    function tick() {
      // Variable speed: fast start → dramatic slow finish
      const spd = progress < 30 ? 1.9 : progress < 65 ? 1.2 : progress < 88 ? 0.6 : 0.2;
      progress = Math.min(100, progress + spd * (0.7 + Math.random() * 0.6));

      const floor = Math.floor(progress);
      if (counterEl) counterEl.textContent = String(floor).padStart(2, '0');
      if (fillEl)    fillEl.style.width = progress + '%';
      if (nameEl)    nameEl.textContent = scramble(progress);

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        if (nameEl) nameEl.textContent = FINAL;
        setTimeout(() => revealSite(preUI, curtainTop, curtainBot), 550);
      }
    }

    // Brief pause before starting (let CSS animations settle)
    setTimeout(() => requestAnimationFrame(tick), 420);
  }

  runPreloader();

  // ═══════════════════════════════════════════════════
  // CURTAIN REVEAL
  // ═══════════════════════════════════════════════════
  function revealSite(preUI, curtainTop, curtainBot) {
    // Fade out UI text
    if (preUI) preUI.style.opacity = '0';

    // Fade out constellation canvas so site shows through curtain gap
    constCanvas.style.transition = 'opacity 0.5s ease';
    constCanvas.style.opacity = '0';

    // Activate the main site behind the preloader
    site.classList.remove('hidden');
    site.style.opacity = '1';
    site.style.pointerEvents = 'auto';
    initAuroraBackground();
    startTyping();
    initScrollReveal();
    initCardGlow();
    initContactForm();
    initCursor();
    stopConstellation();

    // Split curtains after canvas fades (site now visible through the gap)
    setTimeout(() => {
      if (curtainTop) curtainTop.classList.add('reveal');
      if (curtainBot) curtainBot.classList.add('reveal');
    }, 380);

    setTimeout(() => { preloader.style.display = 'none'; }, 1900);
  }

  // ═══════════════════════════════════════════════════
  // AURORA STARFIELD BACKGROUND
  // ═══════════════════════════════════════════════════
  function initAuroraBackground() {
    const canvas = auroraBg;
    const ctx = canvas.getContext('2d');
    const STARS = 200;
    let stars = [];

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < STARS; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.4 + 0.3,
        a:     Math.random(),
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2
      });
    }

    let t = 0;

    function draw() {
      t += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Two drifting aurora blobs
      const g1 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(t * 0.7) * 100,
        canvas.height * 0.2 + Math.cos(t * 0.5) * 50,
        0,
        canvas.width * 0.3, canvas.height * 0.2,
        canvas.width * 0.42
      );
      g1.addColorStop(0, 'rgba(0,229,255,0.032)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const g2 = ctx.createRadialGradient(
        canvas.width * 0.72 + Math.cos(t * 0.4) * 80,
        canvas.height * 0.65 + Math.sin(t * 0.6) * 60,
        0,
        canvas.width * 0.72, canvas.height * 0.65,
        canvas.width * 0.36
      );
      g2.addColorStop(0, 'rgba(168,85,247,0.026)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Twinkling stars
      stars.forEach(s => {
        const twinkle = Math.sin(t * 100 * s.speed + s.phase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,210,240,${s.a * twinkle * 0.55})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  // ═══════════════════════════════════════════════════
  // TYPING ANIMATION
  // ═══════════════════════════════════════════════════
  function startTyping() {
    let si = 0, ci = 0, deleting = false, spd = 80;

    function type() {
      const str = typingStrings[si];

      if (deleting) {
        ci--;
        spd = 38;
      } else {
        ci++;
        spd = 75 + Math.random() * 45;
      }

      typingText.textContent = str.substring(0, ci);

      if (!deleting && ci === str.length) {
        spd = 2200;
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        si = (si + 1) % typingStrings.length;
        spd = 500;
      }

      setTimeout(type, spd);
    }

    setTimeout(type, 1400);
  }

  // ═══════════════════════════════════════════════════
  // CUSTOM MAGNETIC CURSOR
  // ═══════════════════════════════════════════════════
  function initCursor() {
    const dot  = $('#cursor-dot');
    const ring = $('#cursor-ring');
    if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

    dot.style.display  = 'block';
    ring.style.display = 'block';
    document.documentElement.classList.add('cursor-active');

    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let rx = cx, ry = cy;

    document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

    function animateCursor() {
      rx += (cx - rx) * 0.13;
      ry += (cy - ry) * 0.13;
      dot.style.transform  = `translate(${cx - 4}px, ${cy - 4}px)`;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand ring on interactive elements
    $$('a, button, .project-card, .skill-pill, .stat-card, .edu-card, .cert-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
      el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
    });
  }

  // ═══════════════════════════════════════════════════
  // NAVBAR SCROLL
  // ═══════════════════════════════════════════════════
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveSection();
  });

  function updateActiveSection() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - sec.offsetHeight / 3) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
    dots.forEach(d => d.classList.toggle('active', d.dataset.section === current));
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
  // SMOOTH SCROLL
  // ═══════════════════════════════════════════════════
  [...navLinks, ...mobileNavLinks, ...dots].forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ═══════════════════════════════════════════════════
  // SCROLL INDICATOR
  // ═══════════════════════════════════════════════════
  const scrollIndicator = $('#scroll-indicator');
  window.addEventListener('scroll', () => {
    scrollIndicator.style.opacity = window.scrollY > 200 ? '0' : '';
  });

  // ═══════════════════════════════════════════════════
  // SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════════════════════
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    $$('.reveal-on-scroll').forEach(el => observer.observe(el));
  }

  // ═══════════════════════════════════════════════════
  // PROJECT CARD MOUSE GLOW
  // ═══════════════════════════════════════════════════
  function initCardGlow() {
    $$('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--mouse-y', ((e.clientY - r.top)  / r.height * 100) + '%');
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // CONTACT FORM — mailto fallback
  // ═══════════════════════════════════════════════════
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = form.querySelector('#cf-name').value.trim();
      const email   = form.querySelector('#cf-email').value.trim();
      const subject = form.querySelector('#cf-subject').value.trim();
      const message = form.querySelector('#cf-message').value.trim();
      const body    = `From: ${name} (${email})\n\n${message}`;
      window.location.href = `mailto:prakashsarangi0070@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

})();
