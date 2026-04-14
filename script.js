/* ═══════════════════════════════════════════════
   INSPIRATO — LUXURY REDESIGN
   script.js — ES6+ Vanilla JS
═══════════════════════════════════════════════ */

"use strict";

/* ── 1. Custom Cursor Glow ──────────────────────── */
const cursorGlow = document.getElementById("cursorGlow");
let mouseX = 0,
  mouseY = 0,
  glowX = 0,
  glowY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.transform = `translate(${glowX - 200}px, ${
      glowY - 200
    }px)`;
  }
  requestAnimationFrame(animateCursor);
})();


/* ── 2. Navbar Scroll Behavior ──────────────────── */
const navbar = document.getElementById("navbar");
let lastScroll = 0;

const handleNavScroll = () => {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  lastScroll = scrollY;
};

window.addEventListener("scroll", handleNavScroll, { passive: true });

//  MAGNETIC FEATURE FOR CTA BUTTONS

const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  // Update dot instantly
  dot.style.left = `${posX}px`;
  dot.style.top = `${posY}px`;

  // Update outline (transition in CSS creates the "trailing" effect)
  outline.style.left = `${posX}px`;
  outline.style.top = `${posY}px`;
});

// Add hover effects for all links and buttons
const interactables = document.querySelectorAll("a, button, .nav-cta");

interactables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    document.body.classList.add("cursor-active");
  });
  el.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-active");
  });
});

/* ── 3. Mobile Navigation ───────────────────────── */
const hamburger = document.getElementById("navHamburger");
const navMenu = document.getElementById("navMenu");

// Create overlay
const navOverlay = document.createElement("div");
navOverlay.className = "nav-overlay";
document.body.appendChild(navOverlay);

const toggleNav = () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("open");
  navOverlay.classList.toggle("open");
  document.body.style.overflow = navMenu.classList.contains("open")
    ? "hidden"
    : "";
};

hamburger?.addEventListener("click", toggleNav);
navOverlay.addEventListener("click", toggleNav);

// Close on link click
navMenu?.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) toggleNav();
  });
});

/* ── 4. Hero Parallax ───────────────────────────── */
const heroLayer1 = document.querySelector(".hero-layer-1");
const heroLayer2 = document.querySelector(".hero-layer-2");

window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const heroH = hero.offsetHeight;
    if (scrollY < heroH) {
      const pct = scrollY / heroH;
      if (heroLayer1)
        heroLayer1.style.transform = `scale(1.08) translateY(${
          scrollY * 0.2
        }px)`;
      // Crossfade layers
      if (heroLayer2) heroLayer2.style.opacity = Math.min(pct * 2, 0.6);
    }
  },
  { passive: true }
);

/* ── 5. Scroll-Triggered Animations (IntersectionObserver) ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document
  .querySelectorAll(
    ".reveal-fade, .reveal-slide, .reveal-slide-up, .reveal-scale"
  )
  .forEach((el) => revealObserver.observe(el));

/* ── 6. Animated Counter (Stats) ────────────────── */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

document
  .querySelectorAll(".stat-num[data-count]")
  .forEach((el) => counterObserver.observe(el));

/* ── 7. Destination Filters ─────────────────────── */
const filterBtns = document.querySelectorAll(".filter-btn");
const destCards = document.querySelectorAll(".dest-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active state
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    destCards.forEach((card) => {
      const category = card.dataset.category;
      const show = filter === "all" || category === filter;

      if (show) {
        card.classList.remove("hidden");
        card.style.display = "";
      } else {
        card.classList.add("hidden");
        // After transition, hide
        setTimeout(() => {
          if (card.classList.contains("hidden")) card.style.display = "none";
        }, 450);
      }
    });
  });
});

/* ── 8. AI Trip Finder ──────────────────────────── */
const findBtn = document.getElementById("findTrip");
const findBtnText = document.getElementById("findBtnText");
const finderResults = document.getElementById("finderResults");
const destInput = document.getElementById("destInput");
const dateInput = document.getElementById("dateInput");
const moodInput = document.getElementById("moodInput");

// Fake destination database
const tripDatabase = [
  {
    name: "Calliope",
    loc: "Mykonos, Greece",
    tag: "European Summer",
    keywords: ["beach", "europe", "greece", "mykonos", "romantic", "summer"],
  },
  {
    name: "La Pesa di Sopra",
    loc: "Tuscany, Italy",
    tag: "European Summer",
    keywords: ["italy", "tuscany", "europe", "wine", "cultural", "romantic"],
  },
  {
    name: "Villa Agata",
    loc: "Sicily, Italy",
    tag: "European Summer",
    keywords: ["italy", "sicily", "beach", "europe", "romantic"],
  },
  {
    name: "Shearwater",
    loc: "Nantucket, Massachusetts",
    tag: "Family Favorites",
    keywords: ["family", "beach", "east coast", "summer", "nantucket"],
  },
  {
    name: "Creek Hollow",
    loc: "Lake Travis, Texas",
    tag: "Lakeside Living",
    keywords: ["lake", "texas", "family", "water", "lakeside"],
  },
  {
    name: "Bear Paw",
    loc: "Aspen, Colorado",
    tag: "Mountain Escape",
    keywords: ["ski", "mountain", "aspen", "winter", "snow", "colorado"],
  },
  {
    name: "Villa Coya",
    loc: "Marbella, Spain",
    tag: "Trending Now",
    keywords: ["spain", "europe", "beach", "marbella", "luxury", "romantic"],
  },
  {
    name: "Villa Della Luna",
    loc: "Sonoma County, California",
    tag: "Wine Country",
    keywords: ["wine", "california", "culinary", "romantic", "sonoma"],
  },
  {
    name: "Chatham Bars Inn",
    loc: "Cape Cod, Massachusetts",
    tag: "Family Favorites",
    keywords: ["family", "cape cod", "beach", "new england", "summer"],
  },
  {
    name: "Fairmont Kea Lani",
    loc: "Wailea, Maui, Hawaii",
    tag: "Island Paradise",
    keywords: ["hawaii", "beach", "tropical", "romantic", "maui", "island"],
  },
  {
    name: "Grace Bay Club",
    loc: "Turks & Caicos",
    tag: "Caribbean",
    keywords: ["caribbean", "beach", "tropical", "romantic", "island"],
  },
  {
    name: "The Langham",
    loc: "London, England",
    tag: "City Culture",
    keywords: ["london", "europe", "city", "cultural", "uk"],
  },
];

const moodKeywordMap = {
  "Romantic Escape": ["romantic", "beach", "island", "europe"],
  "Family Adventure": ["family", "lake", "beach", "summer"],
  "Solo Retreat": ["mountain", "wine", "cultural", "city"],
  "Group Celebration": ["beach", "island", "europe", "luxury"],
  "Beach & Relaxation": ["beach", "tropical", "island", "caribbean"],
  "Mountain & Skiing": ["ski", "mountain", "snow", "winter"],
  "Cultural Immersion": ["cultural", "city", "europe", "wine"],
  "Culinary Journey": ["wine", "culinary", "italy", "culinary"],
};

findBtn?.addEventListener("click", () => {
  const dest = destInput.value.trim().toLowerCase();
  const mood = moodInput.value;
  const date = dateInput.value.trim();

  if (!dest && !mood && !date) {
    flashInput([destInput, dateInput, moodInput]);
    return;
  }

  // Show loading
  findBtnText.innerHTML = '<span class="spinner"></span>';
  findBtn.disabled = true;
  finderResults.classList.remove("active");
  finderResults.innerHTML = "";

  setTimeout(() => {
    findBtnText.textContent = "Find My Trip";
    findBtn.disabled = false;

    // Match logic
    let scores = tripDatabase.map((trip) => {
      let score = 0;
      const haystack = trip.keywords.join(" ");
      // Destination text match
      if (dest) {
        const words = dest.split(/\s+/);
        words.forEach((w) => {
          if (
            haystack.includes(w) ||
            trip.loc.toLowerCase().includes(w) ||
            trip.name.toLowerCase().includes(w)
          ) {
            score += 3;
          }
        });
      }
      // Mood match
      if (mood && moodKeywordMap[mood]) {
        moodKeywordMap[mood].forEach((kw) => {
          if (haystack.includes(kw)) score += 2;
        });
      }
      return { ...trip, score };
    });

    // Sort + take top 3
    scores.sort((a, b) => b.score - a.score);
    const results = scores.filter((r) => r.score > 0).slice(0, 3);

    finderResults.classList.add("active");

    if (results.length === 0) {
      finderResults.innerHTML = `
        <div class="finder-message">
          ✦ Every Inspirato destination awaits you. Speak with a Care specialist to find your perfect match.
        </div>`;
      return;
    }

    const html = `
      <div style="margin-bottom:16px; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold);">
        ✦ Curated for you
      </div>
      <div class="finder-result-list">
        ${results
          .map(
            (r) => `
          <div class="finder-result-item">
            <div class="result-name">${r.name}</div>
            <div class="result-loc">📍 ${r.loc}</div>
            <div class="result-tag">${r.tag}</div>
          </div>
        `
          )
          .join("")}
      </div>
      <div style="margin-top:20px; text-align:center;">
        <a href="#" style="font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold);">
          View all matching properties →
        </a>
      </div>
    `;
    finderResults.innerHTML = html;
  }, 1200);
});

// Flash invalid inputs
function flashInput(inputs) {
  inputs.forEach((inp) => {
    const wrap = inp.closest(".finder-input-wrap");
    if (!wrap) return;
    wrap.style.borderColor = "rgba(201,168,76,0.6)";
    wrap.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.1)";
    setTimeout(() => {
      wrap.style.borderColor = "";
      wrap.style.boxShadow = "";
    }, 800);
  });
}

/* ── 9. Testimonials Carousel ───────────────────── */
const testiTrack = document.getElementById("testiTrack");
const testiPrev = document.getElementById("testiPrev");
const testiNext = document.getElementById("testiNext");
const testiDots = document.getElementById("testiDots");

if (testiTrack) {
  const cards = testiTrack.querySelectorAll(".testi-card");
  let currentIdx = 0;
  const total = cards.length;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = `testi-dot${i === 0 ? " active" : ""}`;
    dot.addEventListener("click", () => goTo(i));
    testiDots?.appendChild(dot);
  });

  const goTo = (idx) => {
    currentIdx = (idx + total) % total;
    // Move: use CSS transform on each card
    cards.forEach((card, i) => {
      card.style.transition = "opacity 0.5s, transform 0.5s";
      const diff = i - currentIdx;
      if (diff === 0) {
        card.style.opacity = "1";
        card.style.transform = "translateX(0) scale(1)";
        card.style.position = "relative";
        card.style.zIndex = "2";
      } else {
        card.style.opacity = "0";
        card.style.transform = `translateX(${diff * 40}px) scale(0.97)`;
        card.style.position = "absolute";
        card.style.zIndex = "1";
        card.style.pointerEvents = "none";
      }
    });

    // Update dots
    const dots = testiDots?.querySelectorAll(".testi-dot");
    dots?.forEach((d, i) => d.classList.toggle("active", i === currentIdx));
  };

  // Wrap track for positioning
  testiTrack.style.position = "relative";
  testiTrack.style.minHeight = "280px";
  cards.forEach((card, i) => {
    card.style.position = i === 0 ? "relative" : "absolute";
    card.style.top = "0";
    card.style.left = "0";
    card.style.right = "0";
    if (i !== 0) {
      card.style.opacity = "0";
      card.style.zIndex = "1";
    }
  });

  testiPrev?.addEventListener("click", () => goTo(currentIdx - 1));
  testiNext?.addEventListener("click", () => goTo(currentIdx + 1));

  // Auto-advance
  let autoSlide = setInterval(() => goTo(currentIdx + 1), 5000);
  testiTrack.addEventListener("mouseenter", () => clearInterval(autoSlide));
  testiTrack.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => goTo(currentIdx + 1), 5000);
  });

  // Touch/swipe
  let touchStartX = 0;
  testiTrack.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  testiTrack.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIdx + 1 : currentIdx - 1);
  });
}

/* ── 10. Newsletter Form ────────────────────────── */
const newsSubmit = document.getElementById("newsSubmit");
const newsEmail = document.getElementById("newsEmail");

newsSubmit?.addEventListener("click", () => {
  const email = newsEmail?.value.trim();
  if (!email || !email.includes("@")) {
    newsEmail.style.borderColor = "rgba(201,168,76,0.6)";
    newsEmail.focus();
    setTimeout(() => {
      newsEmail.style.borderColor = "";
    }, 800);
    return;
  }

  const original = newsSubmit.textContent;
  newsSubmit.textContent = "Subscribed ✦";
  newsSubmit.style.background = "#2a6b2a";
  newsSubmit.disabled = true;
  newsEmail.value = "";

  setTimeout(() => {
    newsSubmit.textContent = original;
    newsSubmit.style.background = "";
    newsSubmit.disabled = false;
  }, 3000);
});

/* ── 11. Button Ripple Effect ───────────────────── */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      width: 4px; height: 4px;
      left: ${x}px; top: ${y}px;
      transform: translate(-50%, -50%) scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    `;
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: translate(-50%, -50%) scale(80); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ── 12. Smooth Active Nav Links ────────────────── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = "";
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.style.color = "var(--white)";
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ── 13. Hero Image Slideshow ───────────────────── */
const heroImages = [
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=85",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=85",
  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=85",
];
let heroIdx = 0;

if (heroLayer1) {
  setInterval(() => {
    heroIdx = (heroIdx + 1) % heroImages.length;
    // Fade to new image
    if (heroLayer2) {
      heroLayer2.style.backgroundImage = `url('${heroImages[heroIdx]}')`;
      heroLayer2.style.transition = "opacity 2s ease";
      heroLayer2.style.opacity = "1";

      setTimeout(() => {
        heroLayer1.style.backgroundImage = `url('${heroImages[heroIdx]}')`;
        heroLayer2.style.transition = "none";
        heroLayer2.style.opacity = "0";
      }, 2100);
    }
  }, 6000);
}

/* ── 14. Scroll Reveal for dynamically hidden cards ─ */
// Re-observe after filter changes
const filteredObserver = new MutationObserver(() => {
  document.querySelectorAll(".dest-card:not(.hidden)").forEach((card) => {
    if (!card.classList.contains("revealed")) {
      revealObserver.observe(card);
    }
  });
});
const destGrid = document.getElementById("destGrid");
if (destGrid) {
  filteredObserver.observe(destGrid, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
}

/* ── 15. Page Entry Animation ───────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = "1";
    });
  });
});

/* ── 16. Hover Glow on Cards ────────────────────── */
document
  .querySelectorAll(".dest-card, .exp-card, .plan-card, .hotel-card")
  .forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });

/* ── 17. Number formatting in stats ─────────────── */
// Already handled by counter animation above

/* ── 18. Trust bar on small screens ─────────────── */
const trustDots = document.querySelectorAll(".trust-dot");
if (window.innerWidth < 600) {
  trustDots.forEach((d) => {
    d.style.display = "none";
  });
}

console.log(
  "%c✦ INSPIRATO",
  "color: #c9a84c; font-size: 24px; font-weight: bold; font-family: Georgia, serif;"
);
console.log(
  "%cLuxury Travel. Reimagined.",
  "color: #7a7570; font-size: 12px; font-family: sans-serif;"
);
