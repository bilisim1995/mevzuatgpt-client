'use client';

import { useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

type HeroLottieProps = {
  className?: string;
  path?: string;
  ariaLabel?: string;
};

export default function HeroLottie({
  className,
  path = '/hero.json',
  ariaLabel = 'İlBilge animasyonu',
}: HeroLottieProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path,
    });

    return () => {
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
    />
  );
}
