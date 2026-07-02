import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // Staggered entrance on page load
  gsap.from('.site-header .nav > *', {
    y: -20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 0.5,
    // Clear inline transforms once the entrance finishes, otherwise GSAP
    // leaves a residual translate on the nav items (the logo ends up ~20px
    // too high) and it also blocks the CSS :hover transform on .brand.
    clearProps: 'transform,opacity'
  });

  gsap.from('.hero-copy > *', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.8,
    clearProps: 'transform,opacity'
  });

  // Scroll reveals: animate each element into view with GSAP.
  // We drive them with an IntersectionObserver rather than a ScrollTrigger
  // per element, because ScrollTrigger's "play" toggle can be skipped when
  // the user jumps straight to an anchor (e.g. the "Impact" nav/footer links):
  // the element would then stay stuck at opacity 0. IntersectionObserver
  // re-evaluates on any scroll or instant jump, so content is never hidden.
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      gsap.to(entry.target, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealElements.forEach((el) => {
    // Remove the original class so the old CSS reveal doesn't conflict.
    el.classList.remove('reveal');
    gsap.set(el, { y: 40, opacity: 0 });
    revealObserver.observe(el);
  });

  // Parallax for hero elements
  gsap.to('.hero-visual', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 100,
    ease: 'none'
  });

  // 3D Tilt Effect on Bento Cards
  const bentoCards = document.querySelectorAll('.bento');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      gsap.to(card, {
        duration: 0.3,
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'power1.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        duration: 0.5,
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out'
      });
    });
  });
}
