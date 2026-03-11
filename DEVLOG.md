# Developer Log — Portfolio Website

A detailed technical journal documenting every design decision, implementation detail, and learning. Written to serve as an interview reference.

---

## Phase 1: Foundation, Hero Section & Navigation

### Architecture Decision: Vanilla HTML/CSS/JS

**Why no framework?**  
I deliberately chose vanilla HTML, CSS, and JavaScript over React or any framework. For a personal portfolio, a framework adds unnecessary bundle size and complexity. Vanilla JS gives me:
- **Zero dependencies** — no `node_modules`, no build step, no version conflicts
- **Full control** over rendering and animation performance
- **Faster load times** — the entire site is ~12KB (vs 100KB+ for a React bundle)
- **Demonstrates fundamentals** — shows I understand the web platform, not just abstractions

### Design System: CSS Custom Properties

I built a design token system using CSS custom properties (`style.css`, lines 6–35):

```css
:root {
  --bg-primary:    #060918;
  --accent-teal:   #00e5ff;
  --accent-violet: #a855f7;
  --gradient-aurora: linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #f472b6 100%);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Why custom properties over hardcoded values?**
- Single source of truth — change one variable, update everywhere
- Makes theming trivial (could add light mode by swapping variables)
- Self-documenting — `var(--accent-teal)` is clearer than `#00e5ff`

**Color palette rationale:**  
The "Aurora/Cosmic" palette was chosen for visual impact without being generic. Deep navy (`#060918`) provides high contrast. Teal (`#00e5ff`) is the primary accent — it's high-energy but not overused. Violet (`#a855f7`) adds warmth and depth. Gold (`#f5a623`) is reserved for highlights.

---

### Preloader: Constellation Animation

**File:** `script.js` → `initConstellation()`

**How it works:**
1. Creates a full-screen `<canvas>` element
2. Spawns 100 `Particle` objects with random positions, velocities, and sizes
3. Each frame: updates positions (bouncing off edges), draws particles, then draws lines between particles within 150px of each other
4. Line opacity is inversely proportional to distance — closer particles have brighter connections
5. When user clicks "Explore", the animation is cleaned up with `cancelAnimationFrame()` to prevent memory leaks

**Key code — connection drawing:**
```javascript
if (dist < CONNECTION_DIST) {
  const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
  ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
  ctx.lineWidth = 0.5;
}
```

**Interview talking point:** "I used the Canvas 2D API to render a particle system. The connection lines use distance-based alpha blending — as particles move farther apart, the line fades out, creating a natural constellation effect. I made sure to clean up the animation frame when transitioning to prevent memory leaks."

---

### Hero Section: Typing Animation

**File:** `script.js` → `startTyping()`

**How it works:**
- Maintains a `strIndex` (which string) and `charIndex` (which character)
- Types forward character-by-character with randomized delay (80–120ms) for a human feel
- Pauses 2 seconds at the end of each string
- Deletes backward at 40ms per character (faster, like a real person)
- Loops infinitely through the array

**Why not use a library like Typed.js?**  
The typing logic is only ~25 lines. Adding a library would be 10KB+ for something trivially implementable. Writing it myself also lets me customize the timing curve.

**Interview talking point:** "I implemented a custom typing animation without any library. The speed has subtle randomization — each character takes 80ms plus a random 0–40ms — which makes it feel natural rather than robotic."

---

### Glassmorphism Navbar

**File:** `style.css` → `.navbar.scrolled`

**How it works:**
- Navbar starts fully transparent
- JavaScript adds `.scrolled` class when `scrollY > 50px`
- CSS transitions apply `backdrop-filter: blur(16px)` and a semi-transparent background
- `border-bottom: 1px solid rgba(255,255,255,0.06)` adds a subtle edge

```css
.navbar.scrolled {
  background: rgba(12, 16, 36, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

**Interview talking point:** "The navbar uses CSS `backdrop-filter` for the frosted glass effect. I chose `rgba` backgrounds with low alpha over solid colors because it lets the starfield bleed through, maintaining visual continuity."

---

### Aurora Background: Starfield + Gradient Blobs

**File:** `script.js` → `initAuroraBackground()`

**How it works:**
1. **Stars:** 180 dots with random positions, sizes, and twinkle phases. Each star's opacity pulses using `Math.sin()` with its own phase offset
2. **Aurora blobs:** Two radial gradients (`createRadialGradient`) that slowly drift using `Math.sin/cos(time)` — one teal, one violet
3. Both layers are composited on a single canvas

**Why canvas instead of CSS gradients?**  
CSS `background: radial-gradient(...)` is static. Canvas lets me animate the gradient center positions smoothly, creating the "breathing aurora" effect without layout thrashing.

---

### Responsive Design: Mobile-First Patterns

**Breakpoints used:**
- `768px` — Switches to hamburger menu, hides dot nav, stacks CTA buttons
- `480px` — Reduces badge size, social icon sizes

**Mobile overlay navigation:**
- Full-screen overlay with `backdrop-filter: blur(30px)` 
- Links are large touch targets (font-size scales with viewport)
- Hamburger animates to X using CSS transforms on three `<span>` elements

```css
.menu-toggle.active .hamburger-line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.menu-toggle.active .hamburger-line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
```

---

### Performance Considerations

1. **Canvas cleanup:** `cancelAnimationFrame()` on preloader exit prevents two canvases running simultaneously
2. **CSS `will-change`:** Not overused — only applied implicitly through `transform` and `opacity` animations
3. **Font loading:** `font-display: swap` via Google Fonts prevents FOIT (Flash of Invisible Text)
4. **Scroll handler:** Kept lightweight — only class toggles and offset checks, no DOM reads in loops

---

### Files Created in Phase 1

| File | Lines | Purpose |
|---|---|---|
| `index.html` | ~180 | Semantic HTML5 structure, SEO meta tags, all section placeholders |
| `style.css` | ~520 | Full design system, component styles, animations, responsive breakpoints |
| `script.js` | ~250 | Canvas animations, typing effect, nav behaviors, scroll tracking |
| `README.md` | ~30 | Project overview and setup |
| `.gitignore` | ~12 | Standard ignore rules |

---

*Next: Phase 2 will document the About section and Skills showcase.*
