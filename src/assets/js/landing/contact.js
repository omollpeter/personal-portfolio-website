import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function initEntranceAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('#conHeadline', { opacity: 1, y: 0, duration: 1.1, delay: 0.1 })
        .to('#conHeroImg', { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power2.out' }, 0.3);

    const blocks = document.querySelectorAll('.con-block');
    blocks.forEach((block, i) => {
        gsap.to(block, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: block,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            delay: (i % 3) * 0.08
        });
    });

    gsap.to('#conCopyright', {
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#conCopyright',
            start: 'top 92%',
            toggleActions: 'play none none reverse'
        }
    });
}

export function initContact() {
    gsap.registerPlugin(ScrollTrigger);
    initEntranceAnimations();
}