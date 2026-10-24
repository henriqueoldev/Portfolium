import { gsap } from "gsap";

/** Shared animation tokens so every element moves with the same rhythm. */
export const MOTION = {
  ease: "power3.out",
  duration: 0.6,
  stagger: 0.07,
} as const;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let menuTimeline: gsap.core.Timeline | null = null;

/** Card entrance + decorative reveals. Safe to call on every navigation. */
export function initAnimations(): void {
  if (reducedMotion()) {
    gsap.set(".contentCard, .socialIcon, .liner", { clearProps: "all" });
    return;
  }

  revealCards();
  revealLiners();
  initSocialIcons();
  initScrollingTitles();
}

function revealCards(): void {
  const cards = gsap.utils.toArray<HTMLElement>(".contentCard");
  if (cards.length === 0) return;

  gsap.fromTo(
    cards,
    { autoAlpha: 0, y: 18 },
    {
      autoAlpha: 1,
      y: 0,
      duration: MOTION.duration,
      stagger: MOTION.stagger,
      ease: MOTION.ease,
      overwrite: "auto",
    },
  );
}

function revealLiners(): void {
  const liners = gsap.utils.toArray<HTMLElement>(".liner");
  if (liners.length === 0) return;

  gsap.fromTo(
    liners,
    { scaleX: 0, opacity: 0, transformOrigin: "left center" },
    {
      scaleX: 1,
      opacity: 1,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.15,
      ease: MOTION.ease,
      overwrite: "auto",
    },
  );
}

function initSocialIcons(): void {
  gsap.utils.toArray<HTMLElement>(".socialLink").forEach((link) => {
    const icon = link.querySelector<HTMLElement>(".socialIcon");
    if (!icon) return;

    const enter = () =>
      gsap.to(icon, {
        rotate: 8,
        scale: 1.08,
        duration: 0.18,
        ease: "sine.out",
        overwrite: "auto",
      });
    const leave = () =>
      gsap.to(icon, {
        rotate: 0,
        scale: 1,
        duration: 0.3,
        ease: "sine.inOut",
        overwrite: "auto",
      });

    link.addEventListener("mouseenter", enter);
    link.addEventListener("mouseleave", leave);
    link.addEventListener("focusin", enter);
    link.addEventListener("focusout", leave);
  });
}

/** Slides a truncated card title sideways while the card is hovered. */
function initScrollingTitles(): void {
  gsap.utils.toArray<HTMLElement>(".contentCardTitle").forEach((title) => {
    const viewport = title.closest<HTMLElement>(".titleViewport");
    const distance = title.scrollWidth - (viewport?.clientWidth ?? 0);
    if (distance < 4) return;

    const card = title.closest<HTMLElement>(".contentCard");
    const target = card ?? title;

    const tween = gsap.fromTo(
      title,
      { x: 0 },
      {
        x: -distance,
        duration: Math.max(1.4, distance / 55),
        ease: "none",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.7,
        paused: true,
      },
    );

    target.addEventListener("mouseenter", () => {
      gsap.set(title, { textOverflow: "clip" });
      tween.play();
    });
    target.addEventListener("mouseleave", () => {
      tween.pause();
      gsap.to(title, {
        x: 0,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => gsap.set(title, { clearProps: "overflow,textOverflow" }),
      });
    });
  });
}

export function openMenu(): void {
  const modal = document.querySelector<HTMLElement>("#modal");
  const panel = document.querySelector<HTMLElement>("#modalNav");
  if (!modal || !panel) return;

  document.body.style.overflow = "hidden";
  const items = gsap.utils.toArray<HTMLElement>("[data-menu-item]");

  if (reducedMotion()) {
    gsap.set(modal, { display: "flex", opacity: 1 });
    gsap.set(panel, { xPercent: 0 });
    return;
  }

  menuTimeline?.kill();
  menuTimeline = gsap
    .timeline()
    .set(modal, { display: "flex" })
    .fromTo(
      modal,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power1.out" },
    )
    .fromTo(
      panel,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.45, ease: "power3.out" },
      0,
    )
    .fromTo(
      items,
      { xPercent: 18, opacity: 0 },
      {
        xPercent: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
      },
      0.08,
    );
}

export function closeMenu(): void {
  const modal = document.querySelector<HTMLElement>("#modal");
  const panel = document.querySelector<HTMLElement>("#modalNav");
  if (!modal || !panel) return;

  document.body.style.overflow = "";

  const reset = () => {
    gsap.set(modal, { clearProps: "display,opacity" });
    gsap.set(panel, { clearProps: "transform" });
  };

  if (reducedMotion()) {
    reset();
    return;
  }

  menuTimeline?.kill();
  menuTimeline = gsap
    .timeline({ onComplete: reset })
    .to(panel, { xPercent: 100, duration: 0.35, ease: "power3.in" })
    .to(modal, { opacity: 0, duration: 0.2, ease: "power1.in" }, 0.1);
}
