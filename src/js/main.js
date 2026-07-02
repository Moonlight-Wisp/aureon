/**
 * Aureon — Main entry point
 *
 * We use a modular Vanilla JS architecture to maintain a clean global scope,
 * improve maintainability, and allow tree-shaking where applicable.
 */

import { initWebGL } from './webgl.js';
import { initAnimations } from './animations.js';
import { initCursor } from './cursor.js';
import { initROI } from './roi.js';
import { initForm } from './form.js';
import { initChatbot } from './chatbot.js';
import { initUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize generic UI components (Nav, Theme, Modals, Sliders)
  initUI();

  // 2. Initialize the WebGL Hero Background (Three.js)
  // Replaces the old CSS blobs with an interactive particle system.
  initWebGL();

  // 3. Initialize GSAP Animations and ScrollTriggers
  // Handles staggered entrances, parallax, and 3D tilt effects.
  initAnimations();

  // 4. Initialize Custom Magnetic Cursor
  initCursor();

  // 5. Initialize Interactive Components
  initROI();      // Chart.js integration
  initForm();     // Formspree integration
  initChatbot();  // In-page assistant widget
});
