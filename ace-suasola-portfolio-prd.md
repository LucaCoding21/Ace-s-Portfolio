# ACE SUASOLA — Concert Photography Portfolio
## Product Requirements Document for Claude Code

---

# IMPORTANT: READ THIS FIRST

This is not a generic portfolio. This needs to be a **statement piece** — the kind of site that makes other photographers ask "who built this?" You are building for a concert photographer whose work lives in darkness, strobe lights, sweat, and chaos. The website must **feel** like that.

Do not play it safe. Do not default to boring. Every animation, every transition, every micro-interaction should have intention and personality. Think: Awwwards-worthy. Think: "I need to screenshot this and send it to someone."

Reference sites for the vibe:
- https://www.oshanehoward.com/ (the scattered gallery + horizontal rush animation)
- https://www.nateluebbe.com/ (cinematic presence)

---

# TECH STACK

- **Framework:** Next.js 14+ (App Router)
- **Animation:** GSAP with ScrollTrigger, useGSAP hook from @gsap/react
- **Styling:** Tailwind CSS
- **Fonts:** Bold serif for "ACE SUASOLA" (use a dramatic display serif like Playfair Display Black, or similar high-impact serif), clean sans-serif for body (Inter or similar)
- **Deployment:** Vercel-ready

---

# SITE STRUCTURE

```
/
├── / (Home - the main experience)
├── /show/[slug] (Individual show pages)
└── /contact (Contact form)
```

That's it. Keep it tight. The work speaks.

---

# THE EXPERIENCE FLOW

## Phase 1: The Loading Sequence

### 1A: Percentage Counter Loader

**What the user sees:**
- Black screen (#0a0a0a or similar deep black)
- Centered percentage counter: "0%" → "100%"
- The number should be LARGE (think 20vw font size) and use a bold monospace or display font
- Subtle: "ACE SUASOLA" in small text below or above the counter, barely visible (opacity 0.3)

**Animation details:**
- Counter increments smoothly, not linearly — use GSAP's easing to make it feel organic
- Start slow, accelerate in the middle, slow down approaching 100%
- Duration: ~2.5-3 seconds (enough to build anticipation, not so long it's annoying)
- The percentage text should have a subtle "flicker" or "scan line" effect — like an old CRT monitor warming up (use CSS or GSAP to achieve this)

**Code approach:**
```javascript
// Pseudo-code for the counter
gsap.to(counterRef, {
  innerText: 100,
  duration: 2.8,
  ease: "power2.inOut",
  snap: { innerText: 1 },
  onUpdate: () => {
    // Update displayed text
  }
});
```

### 1B: The Horizontal Rush + Hero Expansion (CRITICAL ANIMATION)

**What happens when counter hits 100%:**

This is the signature moment. Reference: oshanehoward.com

**The sequence:**
1. At 100%, brief pause (300ms) — let it breathe
2. The percentage counter scales up slightly and fades out
3. A **centered frame** appears (92vw × 90vh) — subtle black borders around it
4. A train of 6 rush images (hero image is the LAST one) slides from right to left through the frame
5. **As the rush slides, the frame gradually expands** (borders shrink from 92vw → 96vw)
6. When the hero (last) image is centered in the frame, the rush stops
7. Other images **fade out** while the hero **scales up** to fill the frame
8. Frame expands smoothly to **100% fullscreen** — no borders remain
9. "ACE SUASOLA" text fades in with **outlined/stroke typography**

**Key insight:** The hero image is part of the rush train (the last image), NOT a separate background. As the train slides left, the hero naturally ends up centered because it's at the end. The frame expansion happens simultaneously with the rush, creating a smooth "borders shrinking" effect.

**Technical approach for the rush:**
```javascript
// All images in one train - hero is the LAST one
const ALL_RUSH_IMAGES = rushImages.slice(0, 6);
const HERO_INDEX = 5;

const tl = gsap.timeline();

// Initial: frame slightly smaller (subtle borders), track off-screen right
gsap.set(frameRef, { width: "92vw", height: "90vh" });
gsap.set(trackRef, { x: window.innerWidth });

// Phase 1: Rush slides left + frame expands (simultaneous)
tl.to(trackRef, {
  x: calcFinalX(), // Position hero centered in frame
  duration: 2.5,
  ease: "power2.inOut",
});
tl.to(frameRef, {
  width: "96vw",
  height: "95vh",
  duration: 2.5,
  ease: "power2.inOut",
}, "<"); // Same time

// Phase 2: Fade out other images, hero scales up, frame goes fullscreen
tl.to(otherImages, { opacity: 0, duration: 0.6 });
tl.to(frameRef, {
  position: "absolute", inset: 0,
  width: "100%", height: "100%",
  duration: 1.0
}, "<");
tl.to(heroWrapper, { scale: 2.5, duration: 1.0 }, "<");

// Phase 3: Text fades in
tl.fromTo(textRef,
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0, duration: 0.8 }
);
```

**Visual style:**
- Frame has black background — only images visible inside it
- Black borders start subtle (~4% of viewport) and shrink to zero
- Images are 40vw wide, full color, object-fit: cover
- Hero text uses `-webkit-text-stroke` for outlined/stroke typography
- Smooth, continuous animation — no snapping or glitches

### 1C: Settling into the Scatter Gallery

After the rush, images don't just stop — they **settle** into their scattered positions with a satisfying ease. Think of it like throwing cards on a table and watching them land.

---

## Phase 2: The Main Scattered Gallery (Homepage)

### The Concept

The homepage IS the portfolio. No separate gallery page needed. The scattered images represent different shows, and scrolling reveals/moves them.

### Initial State (After Rush Settles)

- Dark background (#0a0a0a to #1a1a1a gradient, subtle)
- Images scattered across the viewport in an intentional but organic composition
- Each image represents a SHOW (clicking goes to that show's page)
- Images overlap slightly, creating depth
- "ACE SUASOLA" text positioned dramatically — could be:
  - Split across the screen (ACE on left, SUASOLA on right)
  - Vertically along the side
  - Large and behind the images (z-index layering)
- Subtle text: "Concert Photography" or "Photographer" somewhere elegant
- Navigation: minimal — maybe just a hamburger or subtle text links

### The Scroll Behavior (GSAP ScrollTrigger)

**This is where the magic happens.**

As the user scrolls DOWN:

1. **Images scatter outward** — they move away from center, some go left, some right, some up, some down
2. **Parallax depths** — each image moves at a different rate, creating dimensional depth
3. **Rotation** — images gain slight rotation as they move (±5-15 degrees)
4. **Scale** — some images scale up slightly, others scale down
5. **The scatter reveals the show titles** — as images spread apart, text labels fade in beneath/beside each image cluster

**The math of scattering:**
Each image needs unique transform values. Create a system:

```javascript
const scatterConfigs = [
  { x: -30, y: -20, rotation: -8, scale: 1.1 },   // vw/vh percentages
  { x: 45, y: 15, rotation: 12, scale: 0.95 },
  { x: -50, y: 40, rotation: -5, scale: 1.05 },
  // ... etc for each image
];

images.forEach((img, i) => {
  gsap.to(img, {
    x: `${scatterConfigs[i].x}vw`,
    y: `${scatterConfigs[i].y}vh`,
    rotation: scatterConfigs[i].rotation,
    scale: scatterConfigs[i].scale,
    scrollTrigger: {
      trigger: ".gallery-section",
      start: "top top",
      end: "bottom top",
      scrub: 1.5, // Smooth scrubbing
    }
  });
});
```

### Scroll Continuation

As user continues scrolling past the initial scatter:

- Images continue their trajectories (some exit viewport)
- New content sections can appear:
  - A "Selected Shows" text that animates in
  - Brief bio/intro text
  - Eventually leads to more structured content or footer

### Hover States on Images

When hovering over a scattered image:

1. **Image lifts** — subtle scale (1.05) and shadow increase
2. **Other images dim** — reduce opacity of non-hovered images to 0.6
3. **Show title appears** — the name of the show fades in near the image
4. **Cursor changes** — custom cursor or pointer indicating clickable
5. **Subtle color shift** — maybe a very slight brightness increase

```javascript
// Hover timeline for each image
const hoverTl = gsap.timeline({ paused: true });
hoverTl
  .to(image, { scale: 1.05, boxShadow: "0 25px 50px rgba(0,0,0,0.5)", duration: 0.3 })
  .to(otherImages, { opacity: 0.6, duration: 0.3 }, 0)
  .to(showTitle, { opacity: 1, y: 0, duration: 0.3 }, 0);

image.addEventListener("mouseenter", () => hoverTl.play());
image.addEventListener("mouseleave", () => hoverTl.reverse());
```

---

## Phase 3: Individual Show Pages (/show/[slug])

### Page Transition

When clicking a show image from the homepage:

1. **Clicked image scales up** to fill more of the screen
2. **Other images fade out** quickly
3. **Background transitions** (could pull dominant color from the image)
4. **Page transition** — could use Next.js page transitions or GSAP Flip plugin

### Show Page Layout

**Hero Section:**
- Large show title (e.g., "LYNY" or "Bass Coast 2024") — big, bold typography
- Maybe a date or venue subtitle
- Hero image or the same image that was clicked, now full-width

**Gallery Section:**
- Grid or masonry layout of all photos from that show
- On scroll, images animate in with stagger:

```javascript
gsap.from(".gallery-image", {
  y: 100,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".gallery-grid",
    start: "top 80%",
  }
});
```

**Image Interactions:**
- Click to open lightbox (full-screen view)
- Lightbox should have smooth GSAP open/close animations
- Arrow key navigation in lightbox
- Swipe support on mobile

**Back Navigation:**
- Sticky back button or gesture
- Animate back to homepage with reverse of the entry animation

---

## Phase 4: Contact Page

### Simple but Stylish

- Same dark aesthetic
- Large "LET'S WORK" or "GET IN TOUCH" headline
- Contact form:
  - Name
  - Email
  - Type of shoot (dropdown: Concert, Festival, Artist Promo, Other)
  - Message
  - Submit button with loading state
- Form should have micro-animations:
  - Input focus states (underline grows, label floats)
  - Submit button has hover effect
  - Success state animation

### Form Handling

For now, can use Formspree, Netlify Forms, or just log to console. The PRD focus is on the frontend experience.

---

# MICRO-INTERACTIONS & DETAILS

These separate good from great:

### Cursor
Consider a custom cursor:
- Default: small dot or crosshair (photography vibes)
- On hoverable elements: expands into a circle
- On images: maybe shows "VIEW" text inside cursor

```javascript
// Custom cursor following mouse with GSAP
gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

window.addEventListener("mousemove", (e) => {
  gsap.to(".cursor", {
    x: e.clientX,
    y: e.clientY,
    duration: 0.2,
    ease: "power2.out"
  });
});
```

### Page Transitions
Smooth transitions between pages. Options:
- Fade through black
- Slide/wipe effect
- The clicked element morphs into the new page (GSAP Flip)

### Scroll Indicator
On homepage, subtle animated indicator suggesting user should scroll:
- Could be a small arrow
- Or text: "SCROLL TO EXPLORE"
- Fades out once user starts scrolling

### Text Animations
Headlines shouldn't just appear — they should animate:
- Split text into characters or words
- Stagger them in with GSAP SplitText (or manual splitting)
- Example: "ACE SUASOLA" letters slide up from below with stagger

```javascript
gsap.from(".hero-title span", {
  y: 100,
  opacity: 0,
  duration: 0.8,
  stagger: 0.05,
  ease: "power3.out"
});
```

### Sound (Optional but sick)
If you want to go crazy:
- Subtle camera shutter sound on image hover
- Low ambient tone on page load
- Keep it minimal and give users a mute option

---

# VISUAL DESIGN SPECS

### Colors
```css
--bg-primary: #0a0a0a;
--bg-secondary: #141414;
--text-primary: #ffffff;
--text-secondary: #888888;
--accent: #ffffff; /* Keep it monochrome, let photos be the color */
```

### Typography
```css
--font-display: 'Playfair Display', serif; /* Or similar dramatic serif */
--font-body: 'Inter', sans-serif;

/* Sizes */
--text-hero: clamp(4rem, 15vw, 12rem);
--text-section: clamp(2rem, 5vw, 4rem);
--text-body: 1rem;
```

### Spacing
- Generous whitespace (or in this case, blackspace)
- Let images breathe
- Asymmetry is good — don't center everything

### Image Treatment
- No filters on images — they should look exactly as shot
- Subtle shadows for depth in scattered layout
- Border radius: 0 or very minimal (2-4px max) — keep it editorial

---

# RESPONSIVE BEHAVIOR

### Desktop (1200px+)
- Full scattered gallery experience
- All animations at full complexity
- Custom cursor

### Tablet (768px - 1199px)
- Simplified scatter (fewer images visible at once)
- Reduced parallax intensity
- Touch-friendly hover states

### Mobile (< 768px)
- Scatter effect becomes vertical scroll gallery
- Images stack with scroll-triggered animations
- Hamburger navigation
- No custom cursor
- Simplified loader (keep percentage, simplify rush to vertical)

---

# PERFORMANCE CONSIDERATIONS

### Images
- Use Next.js Image component for optimization
- Implement blur placeholder (blurDataURL)
- Lazy load below-fold images
- Serve WebP with fallbacks
- Size appropriately:
  - Thumbnails in scatter: ~800px wide max
  - Full gallery images: ~1600px wide max
  - Lightbox: ~2400px wide max

### Animations
- Use `will-change` sparingly and remove after animation
- Prefer `transform` and `opacity` (GPU accelerated)
- Use GSAP's `force3D: true` for smoother animations
- Implement reduced motion media query:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable or simplify animations
}
```

### Code Splitting
- Dynamically import GSAP plugins only when needed
- Use Next.js dynamic imports for heavy components

---

# FILE STRUCTURE

```
/app
  /layout.tsx          # Root layout with fonts, metadata
  /page.tsx            # Homepage (loader + scatter gallery)
  /show
    /[slug]
      /page.tsx        # Individual show page
  /contact
    /page.tsx          # Contact form
  /globals.css         # Global styles, CSS variables

/components
  /Loader.tsx          # Loading sequence component
  /HorizontalRush.tsx  # The fast image rush animation
  /ScatterGallery.tsx  # Main scattered image gallery
  /ShowCard.tsx        # Individual image in scatter
  /Navigation.tsx      # Site navigation
  /CustomCursor.tsx    # Custom cursor component
  /Lightbox.tsx        # Image lightbox
  /ContactForm.tsx     # Contact form component

/hooks
  /useGsapContext.ts   # GSAP context hook wrapper

/lib
  /shows.ts            # Show data (titles, slugs, images)
  /animations.ts       # Reusable GSAP animation configs

/public
  /images
    /shows
      /lyny
        /cover.jpg
        /1.jpg
        /2.jpg
        ...
      /bass-coast-2024
        /cover.jpg
        ...
```

---

# DATA STRUCTURE

```typescript
// lib/shows.ts

export interface Show {
  slug: string;
  title: string;
  date: string;
  venue?: string;
  coverImage: string;
  images: string[];
  scatterPosition: {
    x: number;      // vw offset from center
    y: number;      // vh offset from center
    rotation: number;
    scale: number;
    zIndex: number;
  };
}

export const shows: Show[] = [
  {
    slug: "lyny",
    title: "LYNY",
    date: "2024",
    coverImage: "/images/shows/lyny/cover.jpg",
    images: [
      "/images/shows/lyny/1.jpg",
      "/images/shows/lyny/2.jpg",
      // ...
    ],
    scatterPosition: {
      x: -25,
      y: -10,
      rotation: -8,
      scale: 1.1,
      zIndex: 3,
    }
  },
  // ... more shows
];
```

---

# IMPLEMENTATION ORDER

Build in this sequence:

1. **Project Setup**
   - Next.js init with TypeScript
   - Tailwind config
   - Font setup
   - Basic file structure

2. **Loader Component**
   - Percentage counter animation
   - Styling and positioning
   - Test timing feels right

3. **Horizontal Rush**
   - Static layout of rush images first
   - Animate the container
   - Connect to loader completion

4. **Scatter Gallery (Static)**
   - Position images in scattered layout
   - Get the composition looking good WITHOUT animation first
   - This is crucial — nail the static design

5. **Scatter Gallery (Animated)**
   - Add ScrollTrigger
   - Implement scatter on scroll
   - Add hover states

6. **Show Pages**
   - Build individual show page template
   - Gallery grid
   - Lightbox

7. **Navigation & Transitions**
   - Page transitions
   - Back navigation
   - Menu

8. **Contact Page**
   - Form UI
   - Animations
   - Form handling

9. **Polish**
   - Custom cursor
   - Text animations
   - Performance optimization
   - Responsive testing

10. **Final Review**
    - Cross-browser testing
    - Mobile testing
    - Performance audit

---

# PLACEHOLDER CONTENT

Until real images are provided, use these placeholders:

```typescript
// Temporary show data
export const shows = [
  { slug: "show-1", title: "SHOW ONE", coverImage: "/placeholder-1.jpg" },
  { slug: "show-2", title: "SHOW TWO", coverImage: "/placeholder-2.jpg" },
  { slug: "show-3", title: "SHOW THREE", coverImage: "/placeholder-3.jpg" },
  { slug: "show-4", title: "SHOW FOUR", coverImage: "/placeholder-4.jpg" },
  { slug: "show-5", title: "SHOW FIVE", coverImage: "/placeholder-5.jpg" },
];
```

Use Unsplash concert photography for placeholders:
- https://unsplash.com/s/photos/concert
- Or solid color blocks with text labels

---

# FINAL NOTES FOR CLAUDE CODE

### DO:
- Make it feel like an EXPERIENCE, not just a website
- Sweat the animation timing — milliseconds matter
- Create depth with layering, shadows, and parallax
- Let the photography be the hero
- Test every animation on scroll, on hover, on click
- Make it feel fast and responsive even with complex animations
- Add personality — this is for a concert photographer, it should feel energetic

### DON'T:
- Make it feel like a template
- Over-animate (know when to let things be still)
- Compromise mobile experience
- Forget accessibility (keyboard nav, reduced motion, alt text)
- Use low-quality placeholder images — they'll make everything feel cheap
- Rush the loader/rush sequence — this is the first impression

### THE VIBE CHECK:
When someone lands on this site, they should think:
- "Whoa, this is different"
- "This person clearly knows what they're doing"
- "I want to see more"
- "I want to hire this photographer"

The website IS the portfolio in itself. The design and animation quality should match the photography quality.

---

Now go build something incredible.
