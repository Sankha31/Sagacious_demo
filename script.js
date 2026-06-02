/* =========================================================
   සැගෂස් (Sagasus) - JavaScript
   Navigation | Animations | Slider | Form | FAQ | Lightbox
   ========================================================= */

/* ---------- LOADING SCREEN ---------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 1000);
});

/* ---------- NAVBAR ---------- */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link, .nav-cta");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  // Back to top
  document
    .getElementById("backTop")
    .classList.toggle("show", window.scrollY > 400);
  // Active link
  updateActiveLink();
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
  });
});

function updateActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.scrollY + 120;
  sections.forEach((sec) => {
    if (
      scrollY >= sec.offsetTop &&
      scrollY < sec.offsetTop + sec.offsetHeight
    ) {
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}

/* ---------- BACK TO TOP ---------- */
document.getElementById("backTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll(
  ".course-card, .teacher-card, .feature, .info-card, .faq-item"
);
revealEls.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => io.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
const counters = document.querySelectorAll(".counter");
const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);
counters.forEach((c) => counterIO.observe(c));

function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 2000;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent =
      Math.floor(eased * target) +
      (target >= 98 && target < 100 ? "%" : target >= 1000 ? "+" : "");
    if (progress < 1) requestAnimationFrame(tick);
    else
      el.textContent =
        target + (target === 98 ? "%" : target >= 1000 ? "+" : "");
  }
  requestAnimationFrame(tick);
}

/* ---------- TESTIMONIAL SLIDER ---------- */
const slidesEl = document.getElementById("slides");
const dotsEl = document.getElementById("sliderDots");
const totalSlides = slidesEl.children.length;
let currentSlide = 0;

for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Slide ${i + 1}`);
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i));
  dotsEl.appendChild(dot);
}

function goToSlide(i) {
  currentSlide = i;
  slidesEl.style.transform = `translateX(-${i * 100}%)`;
  dotsEl.querySelectorAll("button").forEach((d, idx) => {
    d.classList.toggle("active", idx === i);
  });
}

setInterval(() => {
  goToSlide((currentSlide + 1) % totalSlides);
}, 5000);

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll(".faq-item").forEach((item) => {
  item.querySelector(".faq-q").addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document
      .querySelectorAll(".faq-item")
      .forEach((i) => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

/* ---------- GALLERY LIGHTBOX ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImg.src = item.dataset.img;
    lightbox.classList.add("show");
  });
});
lightboxClose.addEventListener("click", () =>
  lightbox.classList.remove("show"),
);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("show");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.classList.remove("show");
});

/* ---------- FORM VALIDATION ---------- */
const form = document.getElementById("registerForm");
const formSuccess = document.getElementById("formSuccess");

const validators = {
  studentName: (v) => v.trim().length >= 2 || "Please enter a valid name",
  grade: (v) => v !== "" || "Please select a grade",
  parentName: (v) => v.trim().length >= 2 || "Please enter parent name",
  phone: (v) =>
    /^(?:\+94|0)?[0-9]{9,10}$/.test(v.trim()) ||
    "Please enter a valid Sri Lankan phone number",
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email",
  subject: (v) => v.trim().length >= 2 || "Please enter a subject",
};

function validateField(name, value) {
  const field = document.getElementById(name);
  const group = field.closest(".form-group");
  const errorEl = group.querySelector(".error");
  const result = validators[name] ? validators[name](value) : true;
  if (result === true) {
    group.classList.remove("invalid");
    errorEl.textContent = "";
    return true;
  } else {
    group.classList.add("invalid");
    errorEl.textContent = result;
    return false;
  }
}

Object.keys(validators).forEach((name) => {
  const el = document.getElementById(name);
  if (el) {
    el.addEventListener("blur", () => validateField(name, el.value));
    el.addEventListener("input", () => {
      if (el.closest(".form-group").classList.contains("invalid")) {
        validateField(name, el.value);
      }
    });
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  Object.keys(validators).forEach((name) => {
    const el = document.getElementById(name);
    if (!validateField(name, el.value)) valid = false;
  });
  if (valid) {
    formSuccess.classList.add("show");
    form.reset();
    setTimeout(() => formSuccess.classList.remove("show"), 6000);
  } else {
    const firstInvalid = form.querySelector(".form-group.invalid");
    if (firstInvalid)
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

/* ---------- SMOOTH SCROLL (fallback for older browsers) ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth",
        });
      }
    }
  });
});
