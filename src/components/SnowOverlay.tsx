import { useMemo } from 'react';

const FLAKES = ['❄', '❅', '❆', '✦', '✧'];

export function SnowOverlay() {
  const flakes = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const size = 6 + Math.random() * 14;
      const left = Math.random() * 100;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 12;
      const drift = (Math.random() - 0.5) * 80;
      const opacity = 0.2 + Math.random() * 0.4;
      const char = FLAKES[Math.floor(Math.random() * FLAKES.length)];
      return { i, size, left, duration, delay, drift, opacity, char };
    });
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {flakes.map((f) => (
        <span
          key={f.i}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--snow-drift' as string]: `${f.drift}px`,
            ['--snow-opacity' as string]: f.opacity,
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  );
}
