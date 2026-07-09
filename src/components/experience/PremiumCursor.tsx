import { memo, useEffect, useRef } from 'react';

const PremiumCursor = () => {
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduceMotion || !finePointer) return undefined;

    const updateCursor = () => {
      document.documentElement.style.setProperty('--pulse-cursor-x', `${pointerRef.current.x}px`);
      document.documentElement.style.setProperty('--pulse-cursor-y', `${pointerRef.current.y}px`);
      frameRef.current = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateCursor);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <div className="premium-cursor-glow" aria-hidden="true" />;
};

export default memo(PremiumCursor);
