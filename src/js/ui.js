export function initUI() {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const progressBar = document.querySelector(".scroll-progress span");
  const backToTop = document.querySelector(".back-to-top");
  
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Theme toggle */
  const themeToggles = document.querySelectorAll(".theme-toggle");
  const getTheme = () => document.documentElement.getAttribute("data-theme") || "light";

  const setTheme = (theme, announce = true) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("aureon-theme", theme);

    themeToggles.forEach((btn) => {
      const isDark = theme === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Activer le mode clair" : "Activer le mode sombre");
    });
  };

  const toggleTheme = () => setTheme(getTheme() === "dark" ? "light" : "dark");
  themeToggles.forEach((btn) => btn.addEventListener("click", toggleTheme));

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("aureon-theme")) setTheme(e.matches ? "dark" : "light", false);
  });

  /* Page loader */
  window.addEventListener("load", () => {
    document.documentElement.classList.add("loaded");
    setTimeout(() => {
      document.querySelector(".page-loader")?.remove();
    }, 700);
  });

  /* Scroll: header, progress, back-to-top */
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    header?.classList.toggle("scrolled", scrollY > 16);
    if (progressBar) progressBar.style.width = `${progress}%`;
    backToTop?.classList.toggle("visible", scrollY > 600);
  }, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* Mobile menu */
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      mobileMenu.classList.toggle("open", !open);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.classList.remove("open");
      });
    });
  }

  /* Stat counters */
  const animateNumber = (element) => {
    const target = Number(element.dataset.count);
    const decimal = String(target).includes(".");
    const duration = 1400;
    const started = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = decimal ? value.toFixed(1) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll("[data-count]").forEach(animateNumber);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll(".stats").forEach((item) => statObserver.observe(item));

  /* Testimonial carousel - swipe support */
  const tSlides = document.querySelectorAll(".testimonial-slide");
  const tDots = document.querySelectorAll(".t-dot");
  const tPrev = document.querySelector(".t-prev");
  const tNext = document.querySelector(".t-next");
  const track = document.querySelector(".testimonial-track");
  let tIndex = 0;
  let tAutoplay;

  const goToSlide = (index) => {
    if (!tSlides.length) return;
    tIndex = (index + tSlides.length) % tSlides.length;
    tSlides.forEach((s, i) => s.classList.toggle("active", i === tIndex));
    tDots.forEach((d, i) => {
      d.classList.toggle("active", i === tIndex);
      d.setAttribute("aria-selected", String(i === tIndex));
    });
  };

  const startAutoplay = () => {
    clearInterval(tAutoplay);
    if (!prefersReducedMotion) tAutoplay = setInterval(() => goToSlide(tIndex + 1), 6000);
  };

  tPrev?.addEventListener("click", () => { goToSlide(tIndex - 1); startAutoplay(); });
  tNext?.addEventListener("click", () => { goToSlide(tIndex + 1); startAutoplay(); });
  tDots.forEach((dot, i) => dot.addEventListener("click", () => { goToSlide(i); startAutoplay(); }));
  if (tSlides.length) startAutoplay();

  // Swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  if(track) {
    track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(tAutoplay);
    }, {passive: true});
    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) goToSlide(tIndex + 1); // Swipe left
      if (touchEndX - touchStartX > 50) goToSlide(tIndex - 1); // Swipe right
      startAutoplay();
    }, {passive: true});
  }

  /* Live dashboard simulation */
  const activityFeed = document.querySelector(".activity");
  const dashObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Simulate live events natively
      dashObserver.disconnect();
    }
  }, { threshold: 0.3 });
  if (activityFeed) dashObserver.observe(activityFeed);

  /* Video modal */
  const videoModal = document.getElementById("video-modal");
  const videoOpenBtn = document.querySelector("[data-video-open]");
  
  const openVideo = () => {
    videoModal?.classList.add("open");
    videoModal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const closeVideo = () => {
    videoModal?.classList.remove("open");
    videoModal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  videoOpenBtn?.addEventListener("click", openVideo);
  videoModal?.querySelectorAll("[data-video-close]").forEach((el) => {
    el.addEventListener("click", closeVideo);
  });

  /* FAQ */
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        document.querySelectorAll(".faq-item").forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
}
