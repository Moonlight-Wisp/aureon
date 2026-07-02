import { gsap } from 'gsap';

export function initCursor() {
  const cursor = document.querySelector('.cursor-glow');
  if (!cursor || window.matchMedia('(hover: none)').matches) return;

  // We change the basic cursor glow into a more advanced cursor
  cursor.style.width = '20px';
  cursor.style.height = '20px';
  cursor.style.background = 'var(--cobalt)';
  cursor.style.borderRadius = '50%';
  cursor.style.position = 'fixed';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '9999';
  cursor.style.mixBlendMode = 'difference';
  cursor.style.transform = 'translate(-50%, -50%)';

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  // Use GSAP quickTo for performant cursor tracking.
  // A short duration keeps the glowing dot tight to the pointer (a larger
  // value makes it visibly lag/trail behind the real cursor).
  const xTo = gsap.quickTo(cursor, "left", { duration: 0.045, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "top", { duration: 0.045, ease: "power3" });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    xTo(mouseX);
    yTo(mouseY);
  });

  // Magnetic and hover effects
  const interactiveElements = document.querySelectorAll('a, button, input, .bento');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 3, duration: 0.3, backgroundColor: 'var(--lime)' });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, backgroundColor: 'var(--cobalt)' });
    });
  });
}
