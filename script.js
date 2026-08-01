// ============================================
// COSMETOLOGY EXPO ZAMBIA 2026 — SITE SCRIPT
// All interactive sliders + animations live here.
// Photo/highlight sliders run at 2s. The hero
// slideshow runs at 3s (title + description need
// slightly longer to read than a plain photo swap).
// Every auto-advancing slider NEVER pauses — on
// hover, on touch, or otherwise — except when the
// user's OS is set to prefers-reduced-motion, in
// which case sliders stay on their first slide.
// Clicking a dot/arrow jumps to that slide and the
// interval keeps running smoothly (no stacked timers).
// ============================================

(function () {
  const SLIDE_INTERVAL = 2000; // photo & highlight sliders
  const HERO_INTERVAL = 3000; // hero title + description

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ============================================
  // 1. HERO — BACKGROUND + TEXT SLIDESHOW
  // ============================================
  const heroSlides = [
    {
      image: "images/hero.jpg",
      title: "Glow & Grow",
      outline: "Sustainably",
      description: "Celebrating Zambia's inaugural Cosmetology Expo and MSME Finance Fair 2026."
    },
    {
      image: "images/hero2.jpg",
      title: "Connecting",
      outline: "Businesses",
      description: "Bringing together entrepreneurs, innovators, exhibitors and investors from across Zambia."
    },
    {
      image: "images/hero3.jpg",
      title: "Celebrating",
      outline: "Innovation",
      description: "Showcasing creativity, beauty, entrepreneurship and business excellence."
    },
    {
      image: "images/hero4.jpg",
      title: "Empowering",
      outline: "Entrepreneurs",
      description: "Creating opportunities for MSMEs through networking, exhibitions and collaboration."
    },
    {
      image: "images/hero5.jpg",
      title: "Relive The",
      outline: "Moments",
      description: "Relive the unforgettable moments through a beautiful gallery capturing the highlights, excitement and memories of the inaugural Cosmetology Expo."
    },
    {
      image: "images/hero7.jpg",
      title: "Thank You",
      outline: "Zambia",
      description: "Thank you to our visitors, exhibitors, speakers, partners and sponsors for making the inaugural Expo a remarkable success."
    }
  ];

  const heroTitle = document.getElementById("heroTitle");
  const heroOutline = document.getElementById("heroOutline");
  const heroDescription = document.getElementById("heroDescription");
  const heroLayer1 = document.getElementById("heroBgLayer1");
  const heroLayer2 = document.getElementById("heroBgLayer2");
  const heroDotsContainer = document.getElementById("heroDots");

  if (heroTitle && heroOutline && heroDescription && heroLayer1 && heroLayer2) {
    let heroIndex = 0;
    let heroShowingLayer1 = true;
    let heroTimer = null;

    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });

    function buildHeroDots() {
      if (!heroDotsContainer) return;
      heroSlides.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "hero-dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => {
          heroIndex = i;
          showHeroSlide(heroIndex);
          restartHeroTimer();
        });
        heroDotsContainer.appendChild(dot);
      });
    }

    function updateHeroDots(index) {
      if (!heroDotsContainer) return;
      [...heroDotsContainer.children].forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }

    function showHeroSlide(index) {
      const slide = heroSlides[index];
      const incoming = heroShowingLayer1 ? heroLayer2 : heroLayer1;
      const outgoing = heroShowingLayer1 ? heroLayer1 : heroLayer2;

      incoming.style.backgroundImage = `url('${slide.image}')`;
      incoming.classList.add("active");
      outgoing.classList.remove("active");
      heroShowingLayer1 = !heroShowingLayer1;

      heroTitle.textContent = slide.title;
      heroOutline.textContent = slide.outline;
      heroDescription.textContent = slide.description;

      updateHeroDots(index);
    }

    function nextHeroSlide() {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(heroIndex);
    }

    function restartHeroTimer() {
      if (reduceMotion) return;
      clearInterval(heroTimer);
      heroTimer = setInterval(nextHeroSlide, HERO_INTERVAL);
    }

    // Hero never pauses on hover/touch — no such listeners here.
    showHeroSlide(heroIndex);
    buildHeroDots();
    restartHeroTimer();
  }

  // ============================================
  // 2. PHOTO SLIDER — Opening Ceremony + Exhibitor Stands
  //    (any .photo-slider block on the page)
  //    Continuous — never pauses on hover or touch.
  // ============================================
  document.querySelectorAll(".photo-slider").forEach((sliderEl) => {
    const slides = sliderEl.querySelectorAll(".slider-slide");
    const dotsContainer = sliderEl.querySelector(".slider-dots");
    const prevBtn = sliderEl.querySelector(".slider-arrow.prev");
    const nextBtn = sliderEl.querySelector(".slider-arrow.next");
    if (!slides.length || !dotsContainer) return;

    // Preload every slide's image so the first auto-advance
    // doesn't stall on a not-yet-cached file.
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img && img.src) {
        const preload = new Image();
        preload.src = img.src;
      }
    });

    let current = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".dot");

    function goTo(index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }

    function next() {
      goTo(current + 1);
    }
    function prev() {
      goTo(current - 1);
    }

    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(next, SLIDE_INTERVAL);
    }

    if (nextBtn) nextBtn.addEventListener("click", () => { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restart(); });

    // No hover/touch pausing — slider runs continuously.
    restart();
  });

  // ============================================
  // 3. EVENT HIGHLIGHTS — CATEGORY SLIDERS
  //    (Hair, Nails, Makeup, Skin, Barbering, Awards)
  //    Continuous — never pauses on hover or touch.
  // ============================================
  document.querySelectorAll(".highlight-slider").forEach((sliderEl) => {
    const slides = sliderEl.querySelectorAll(".highlight-slide");
    const dotsContainer = sliderEl.querySelector(".highlight-dots");
    const prevBtn = sliderEl.querySelector(".highlight-arrow.prev");
    const nextBtn = sliderEl.querySelector(".highlight-arrow.next");
    if (!slides.length || !dotsContainer) return;

    // Preload every slide's image for smoother first transitions.
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img && img.src) {
        const preload = new Image();
        preload.src = img.src;
      }
    });

    let current = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "highlight-dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".highlight-dot");

    function goTo(index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }

    function next() {
      goTo(current + 1);
    }
    function prev() {
      goTo(current - 1);
    }

    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(next, SLIDE_INTERVAL);
    }

    if (nextBtn) nextBtn.addEventListener("click", () => { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restart(); });

    // No hover/touch pausing — slider runs continuously.
    restart();
  });

  // ============================================
  // 4. ABOUT SECTION — IMAGE SLIDESHOW
  //    (single implementation — previously this was
  //    duplicated in two places, which put two competing
  //    setInterval loops on the same background layers)
  // ============================================
  const aboutImages = [
    "images/about1.jpg",
    "images/about2.jpg",
    "images/about3.jpg",
    "images/about4.jpg",
    "images/about5.jpg",
    "images/about6.jpg"
  ];

  const aboutLayer1 = document.getElementById("aboutBgLayer1");
  const aboutLayer2 = document.getElementById("aboutBgLayer2");

  if (aboutLayer1 && aboutLayer2 && aboutImages.length) {
    let aboutIndex = 0;
    let aboutShowingLayer1 = true;

    // preload images
    aboutImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // show first image immediately
    aboutLayer1.style.backgroundImage = `url('${aboutImages[0]}')`;
    aboutLayer1.classList.add("active");

    function showAboutSlide(index) {
      const incoming = aboutShowingLayer1 ? aboutLayer2 : aboutLayer1;
      const outgoing = aboutShowingLayer1 ? aboutLayer1 : aboutLayer2;

      incoming.style.backgroundImage = `url('${aboutImages[index]}')`;
      incoming.classList.add("active");
      outgoing.classList.remove("active");
      aboutShowingLayer1 = !aboutShowingLayer1;
    }

    function nextAboutSlide() {
      aboutIndex = (aboutIndex + 1) % aboutImages.length;
      showAboutSlide(aboutIndex);
    }

    if (!reduceMotion) {
      setInterval(nextAboutSlide, SLIDE_INTERVAL);
    }
  }

  // ============================================
  // 5. ABOUT SECTION — STAT COUNT-UP ON SCROLL
  // ============================================
  const statEls = document.querySelectorAll(".about-stat strong[data-count]");
  if (statEls.length) {
    if ("IntersectionObserver" in window) {
      const animateCount = (el) => {
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1200;
        const startTime = performance.now();

        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      };

      const statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      statEls.forEach((el) => statObserver.observe(el));
    } else {
      // Fallback for browsers without IntersectionObserver support:
      // show the final numbers immediately instead of leaving them at 0.
      statEls.forEach((el) => {
        const target = el.getAttribute("data-count") || "0";
        const suffix = el.getAttribute("data-suffix") || "";
        el.textContent = target + suffix;
      });
    }
  }
})();