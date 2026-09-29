import { useCallback, useRef } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  /** If true, animates children with .scroll-fade-up class instead of the container itself */
  animateChildren?: boolean;
}

/**
 * Adds `.is-visible` class to elements with scroll-fade-* classes
 * when they enter the viewport, triggering CSS transitions.
 * Uses a robust callback ref that works even after asynchronous data loads.
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.05, rootMargin = '0px 0px 50px 0px', animateChildren = false } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const callback = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      const trigger = (el: Element) => {
        el.classList.add('is-visible');
      };

      if (typeof IntersectionObserver === 'undefined') {
        if (animateChildren) {
          node.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right').forEach(trigger);
        } else {
          trigger(node);
        }
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (animateChildren) {
                entry.target
                  .querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right')
                  .forEach(trigger);
              } else {
                trigger(entry.target);
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold, rootMargin }
      );

      observerRef.current = observer;
      observer.observe(node);

      // Immediate viewport visibility check
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (animateChildren) {
          node.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right').forEach(trigger);
        } else {
          trigger(node);
        }
      }
    },
    [threshold, rootMargin, animateChildren]
  );

  Object.defineProperty(callback, 'current', {
    get: () => elementRef.current,
    set: (v) => {
      elementRef.current = v;
      callback(v);
    },
    configurable: true,
  });

  return callback as unknown as React.RefObject<HTMLDivElement> & ((node: HTMLElement | null) => void);
}

/**
 * Observes multiple child elements for scroll-reveal.
 * Attach this ref to a parent container, and all children
 * with scroll-fade-* classes will be individually observed.
 */
export function useScrollAnimationGroup(options: Omit<ScrollAnimationOptions, 'animateChildren'> = {}) {
  const { threshold = 0.05, rootMargin = '0px 0px 50px 0px' } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const callback = useCallback(
    (node: HTMLElement | null) => {
      elementRef.current = node;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      const trigger = (el: Element) => {
        el.classList.add('is-visible');
      };

      if (typeof IntersectionObserver === 'undefined') {
        node.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right').forEach(trigger);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              trigger(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold, rootMargin }
      );

      observerRef.current = observer;

      const observeChildren = () => {
        if (!node) return;
        const targets = node.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right');
        targets.forEach((target) => {
          observer.observe(target);
          const rect = target.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            trigger(target);
          }
        });
      };

      requestAnimationFrame(observeChildren);
    },
    [threshold, rootMargin]
  );

  Object.defineProperty(callback, 'current', {
    get: () => elementRef.current,
    set: (v) => {
      elementRef.current = v;
      callback(v);
    },
    configurable: true,
  });

  return callback as unknown as React.RefObject<HTMLDivElement> & ((node: HTMLElement | null) => void);
}
