import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  const ring = document.getElementById('cursor-ring');
  const shadow = document.getElementById('cursor-shadow');
  let ringX = 0, ringY = 0, shadowX = 0, shadowY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
  });

  function lerpAll() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    shadowX += (mouseX - shadowX) * 0.055;
    shadowY += (mouseY - shadowY) * 0.055;
    shadow.style.left = shadowX + 'px';
    shadow.style.top = shadowY + 'px';
    requestAnimationFrame(lerpAll);
  }
  lerpAll();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { width: 6, height: 6, duration: 0.2 });
      gsap.to(ring, { width: 52, height: 52, borderColor: 'rgba(255,255,255,0.8)', duration: 0.2 });
      gsap.to(shadow, { width: 130, height: 130, duration: 0.4 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { width: 12, height: 12, duration: 0.2 });
      gsap.to(ring, { width: 36, height: 36, borderColor: 'rgba(255,255,255,0.5)', duration: 0.2 });
      gsap.to(shadow, { width: 90, height: 90, duration: 0.4 });
    });
  });
}

function initScrollArrow() {
  const arrow = document.getElementById('heroScrollArrow');
  const hero = document.getElementById('heroSection');
  const next = document.getElementById('aboutSection');

  const check = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    heroBottom > window.innerHeight * 0.15
      ? arrow.classList.add('visible')
      : arrow.classList.remove('visible');
  };

  window.addEventListener('scroll', check, { passive: true });
  setTimeout(check, 1200);
  arrow.addEventListener('click', () => next && next.scrollIntoView({ behavior: 'smooth' }));
}

function initHeroAnimations() {
  gsap.set('.hero-headline-intro', { y: 16, opacity: 0 });
  gsap.set('.hero-stat', { y: 16, opacity: 0 });
  gsap.set('#heroPhotoAnchor', { opacity: 0, scale: 0.5, x: 20, y: 10 });
  gsap.set('#heroRoleSuffix', { y: '110%' });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-headline-intro', { opacity: 1, y: 0, duration: 0.9, delay: 0.2 })
    .fromTo('.hero-headline', { y: 60, opacity: 0 }, { opacity: 1, y: 0, duration: 1.1 }, 0.3)
    .to('#heroRoleSuffix', { y: '0%', duration: 0.8, ease: 'back.out(2)' }, 1.0)
    .to('#heroPhotoAnchor', { opacity: 1, scale: 1, x: 0, y: 0, duration: 1.0, ease: 'back.out(1.6)' }, 0.9)
    .to('.hero-stat', { opacity: 1, y: 0, stagger: 0.12, duration: 0.7 }, 1.0)
    .call(initTypingAnimation, [], 1.5);
}

function initTypingAnimation() {
  const wordEl = document.getElementById('heroTypedWord');
  const suffixEl = document.getElementById('heroRoleSuffix');
  if (!wordEl || !suffixEl) return;

  const pairs = [
    { word: 'Frontend', suffix: 'Engineer' },
    { word: 'UI/UX', suffix: 'Designer' }
  ];

  let currentIndex = 0;

  function slideSuffixOut(newText, onDone) {
    gsap.to(suffixEl, {
      y: '-115%',
      duration: 0.38,
      ease: 'power2.in',
      onComplete: () => {
        suffixEl.textContent = newText;
        gsap.fromTo(suffixEl,
          { y: '115%' },
          { y: '0%', duration: 0.7, ease: 'back.out(2.2)', onComplete: onDone }
        );
      }
    });
  }

  function typeOut(text, onDone) {
    const tl = gsap.timeline({ onComplete: onDone });
    tl.set(wordEl, { textContent: text[0] });
    for (let i = 1; i < text.length; i++) {
      tl.to(wordEl, { duration: 0.1, textContent: text.substring(0, i + 1), ease: 'none' });
    }
  }

  function eraseOut(text, onDone) {
    const tl = gsap.timeline({ onComplete: onDone });
    for (let i = text.length - 1; i > 0; i--) {
      tl.to(wordEl, { duration: 0.06, textContent: text.substring(0, i), ease: 'none' });
    }
  }

  function runCycle() {
    const pair = pairs[currentIndex];
    const nextIndex = (currentIndex + 1) % pairs.length;
    const nextPair = pairs[nextIndex];

    typeOut(pair.word, () => {
      gsap.delayedCall(1.6, () => {
        eraseOut(pair.word, () => {
          gsap.delayedCall(0.25, () => {
            currentIndex = nextIndex;
            slideSuffixOut(nextPair.suffix, () => {
              runCycle();
            });
          });
        });
      });
    });
  }

  runCycle();
}

function initPhotoScrollTransition() {
  const realPhoto = document.getElementById('heroPhotoReal');
  const proxy = document.getElementById('heroPhotoProxy');
  const photoRing = document.getElementById('heroPhotoRing');
  const placeholder = document.getElementById('aboutPhotoPlaceholder');

  const ASPECT = 776 / 1080;

  const targetW = () => window.innerHeight * ASPECT;
  const targetH = () => window.innerHeight;

  function getSrcRect() { return realPhoto.getBoundingClientRect(); }

  function getDestCenter() {
    const layer = document.getElementById('aboutImageLayer');
    const r = layer.getBoundingClientRect();
    const tH = targetH();
    return { cx: r.left + r.width / 2, cy: r.top + tH / 2 };
  }

  function syncProxyToSource() {
    const r = getSrcRect();
    gsap.set(proxy, {
      width: r.width, height: r.height,
      x: r.left, y: r.top,
      borderRadius: '50%', opacity: 1,
      filter: 'grayscale(20%)', scale: 1,
      objectPosition: 'center center'
    });
  }

  ScrollTrigger.create({
    trigger: '#heroSection',
    start: 'bottom 92%',
    onEnter: () => {
      proxy.style.display = 'block';
      gsap.set(realPhoto, { opacity: 0 });
      gsap.set(photoRing, { opacity: 0 });
      syncProxyToSource();
    },
    onLeaveBack: () => {
      proxy.style.display = 'none';
      gsap.set(realPhoto, { opacity: 1 });
      gsap.set(photoRing, { opacity: 1 });
      gsap.set(placeholder, { opacity: 0 });
    }
  });

  ScrollTrigger.create({
    trigger: '#aboutSection',
    start: 'top bottom',
    end: 'top 15%',
    scrub: 1.2,
    onUpdate: (self) => {
      const p = self.progress;
      const eased = gsap.parseEase('power2.inOut')(p);
      const src = getSrcRect();
      const dest = getDestCenter();
      const tW = targetW();
      const tH = targetH();
      const currentX = src.left + (dest.cx - tW / 2 - src.left) * eased;
      const currentY = src.top + (dest.cy - tH / 2 - src.top) * eased;
      const currentW = src.width + (tW - src.width) * eased;
      const currentH = src.height + (tH - src.height) * eased;
      const currentRadius = 50 * (1 - eased);
      gsap.set(proxy, {
        x: currentX, y: currentY,
        width: currentW, height: currentH,
        borderRadius: `${currentRadius}%`,
        filter: 'none',
        objectPosition: 'top center'
      });
      const fadeThreshold = 0.88;
      if (p > fadeThreshold) {
        const fade = (p - fadeThreshold) / (1 - fadeThreshold);
        gsap.set(placeholder, { opacity: fade });
        gsap.set(proxy, { opacity: 1 - fade });
      } else {
        gsap.set(placeholder, { opacity: 0 });
        gsap.set(proxy, { opacity: 1 });
      }
    },
    onLeave: () => { proxy.style.display = 'none'; gsap.set(placeholder, { opacity: 1 }); },
    onEnterBack: () => {
      proxy.style.display = 'block';
      gsap.set(placeholder, { opacity: 0 });
      syncProxyToSource();
    }
  });

  window.addEventListener('resize', () => {
    if (proxy.style.display === 'block') syncProxyToSource();
  }, { passive: true });
}

function initAboutAnimations() {
  gsap.to('.about-body', {
    opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: '#aboutBodyLayer', start: 'top 88%', toggleActions: 'play none none reverse' }
  });

  gsap.to('.about-photo-placeholder', {
    opacity: 1, duration: 0.01,
    scrollTrigger: { trigger: '#aboutSection', start: 'top 5%', toggleActions: 'play none none reverse' }
  });
}

function initGridParallax() {
  const grid = document.querySelector('.global-grid');
  window.addEventListener('scroll', () => {
    const shift = (window.scrollY * 0.08) % 48;
    grid.style.backgroundPosition = `0 ${shift}px`;
  }, { passive: true });
}

function initMouseParallax() {
  const center = document.querySelector('.hero-center');
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    gsap.to(center, { x, y, duration: 1.2, ease: 'power2.out' });
  });
}

export function initHeroAbout() {
  gsap.registerPlugin(ScrollTrigger);
  initCursor();
  initHeroAnimations();
  initScrollArrow();
  initGridParallax();
  initMouseParallax();
  initPhotoScrollTransition();
  initAboutAnimations();
}