/* ═══════════════════════════════════════════════
   ELEVATED INDIA — PRIVATE TRAVEL HOUSE
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
  glowX += (mouseX - glowX) * 0.06;
  glowY += (mouseY - glowY) * 0.06;
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
  if (scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  lastScroll = scrollY;
};

window.addEventListener("scroll", handleNavScroll, { passive: true });

/* ── Magnetic Cursor Feature ───────────────────── */
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  if (dot) {
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;
  }

  if (outline) {
    outline.style.left = `${posX}px`;
    outline.style.top = `${posY}px`;
  }
});

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
        heroLayer1.style.transform = `scale(1.05) translateY(${
          scrollY * 0.15
        }px)`;
      if (heroLayer2) heroLayer2.style.opacity = Math.min(pct * 2, 0.5);
    }
  },
  { passive: true }
);

/* ── 5. Scroll-Triggered Animations ── */
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
      const duration = 2000;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
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
const destCards = document.querySelectorAll("#destGridFilter .dest-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
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
        setTimeout(() => {
          if (card.classList.contains("hidden")) card.style.display = "none";
        }, 450);
      }
    });
  });
});

/* ── 8. Inquiry Form Handling ───────────────────── */
const inquiryForm = document.getElementById("inquiryForm");
const submitBtn = document.getElementById("submitInquiry");
const btnText = document.getElementById("findBtnText");
const finderResults = document.getElementById("finderResults");

inquiryForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const interestInput = document.getElementById("interestInput");

  // Simple validation
  if (!nameInput.value || !emailInput.value || !interestInput.value) {
    finderResults.classList.add("active");
    finderResults.innerHTML = `
      <div class="finder-message">
        Please complete all required fields to begin your consultation.
      </div>
    `;
    setTimeout(() => {
      finderResults.classList.remove("active");
      finderResults.innerHTML = "";
    }, 3000);
    return;
  }

  // Show loading
  btnText.innerHTML = '<span class="spinner"></span>';
  submitBtn.disabled = true;

  setTimeout(() => {
    finderResults.classList.add("active");
    finderResults.innerHTML = `
      <div class="finder-message">
        Thank you for your inquiry. A travel curator will be in touch within 24 hours 
        to begin designing your journey.
      </div>
    `;

    btnText.textContent = "Request Sent";
    submitBtn.style.background = "#2a6b2a";

    // Reset after delay
    setTimeout(() => {
      inquiryForm.reset();
      btnText.textContent = "Request Private Consultation";
      submitBtn.disabled = false;
      submitBtn.style.background = "";
      finderResults.classList.remove("active");
      finderResults.innerHTML = "";
    }, 5000);
  }, 1500);
});

/* ── 9. Testimonials Carousel ───────────────────── */
const testiTrack = document.getElementById("testiTrack");
const testiPrev = document.getElementById("testiPrev");
const testiNext = document.getElementById("testiNext");
const testiDots = document.getElementById("testiDots");

if (testiTrack) {
  const cards = testiTrack.querySelectorAll(".testi-card");
  let currentIdx = 0;
  const total = cards.length;

  cards.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = `testi-dot${i === 0 ? " active" : ""}`;
    dot.addEventListener("click", () => goTo(i));
    testiDots?.appendChild(dot);
  });

  const goTo = (idx) => {
    currentIdx = (idx + total) % total;
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

    const dots = testiDots?.querySelectorAll(".testi-dot");
    dots?.forEach((d, i) => d.classList.toggle("active", i === currentIdx));
  };

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

  let autoSlide = setInterval(() => goTo(currentIdx + 1), 6000);
  testiTrack.addEventListener("mouseenter", () => clearInterval(autoSlide));
  testiTrack.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => goTo(currentIdx + 1), 6000);
  });

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
    newsEmail.style.borderColor = "rgba(154, 123, 79, 0.6)";
    newsEmail.focus();
    setTimeout(() => {
      newsEmail.style.borderColor = "";
    }, 800);
    return;
  }

  const original = newsSubmit.textContent;
  newsSubmit.textContent = "Subscribed";
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
            link.style.color = "var(--charcoal)";
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
  "image/hero1.png",
  "image/hero2.png",
  "image/hero3.png",
  "image/hero4.png",
];
let heroIdx = 0;

if (heroLayer1) {
  setInterval(() => {
    heroIdx = (heroIdx + 1) % heroImages.length;
    if (heroLayer2) {
      heroLayer2.style.backgroundImage = `url('${heroImages[heroIdx]}')`;
      heroLayer2.style.transition = "opacity 2.5s ease";
      heroLayer2.style.opacity = "1";

      setTimeout(() => {
        heroLayer1.style.backgroundImage = `url('${heroImages[heroIdx]}')`;
        heroLayer2.style.transition = "none";
        heroLayer2.style.opacity = "0";
      }, 2600);
    }
  }, 8000);
}

/* ── 14. Scroll Reveal for dynamically hidden cards ─ */
const filteredObserver = new MutationObserver(() => {
  document.querySelectorAll(".dest-card:not(.hidden)").forEach((card) => {
    if (!card.classList.contains("revealed")) {
      revealObserver.observe(card);
    }
  });
});

const destGridFilter = document.getElementById("destGridFilter");
if (destGridFilter) {
  filteredObserver.observe(destGridFilter, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
}

/* ── 15. Page Entry Animation ───────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.6s ease";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = "1";
    });
  });
});

/* ── 16. Hover Effects on Cards ────────────────────── */
document
  .querySelectorAll(".dest-card, .exp-card, .hotel-card")
  .forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });

console.log(
  "%cELEVATED INDIA",
  "color: #9a7b4f; font-size: 22px; font-weight: bold; font-family: Georgia, serif;"
);
console.log(
  "%cBespoke Luxury Journeys Across India",
  "color: #6b6b6b; font-size: 11px; font-family: sans-serif;"
);
