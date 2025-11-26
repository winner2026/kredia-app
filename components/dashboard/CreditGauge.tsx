// CreditGauge.tsx
"use client";

import { useMemo } from "react";

type CreditGaugeProps = {
  percentageUsed: number;
};

const SEGMENTS = 10;
const COLORS = [
  "#20b36a", // green deep
  "#26c273",
  "#46c87a",
  "#7acd62", // yellow-green
  "#c8ce38", // yellow
  "#e0b624",
  "#f39c1a", // orange
  "#f47e1b",
  "#ef5c26", // red-orange
  "#e23c34", // red
];

export default function CreditGauge({ percentageUsed }: CreditGaugeProps) {
  const clamped = Math.max(0, Math.min(100, percentageUsed));
  const needleAngle = -90 + (clamped / 100) * 180;

  const segments = useMemo(() => {
    const radiusOuter = 140;
    const radiusInner = 100;
    const cx = 150;
    const cy = 150;
    const step = Math.PI / SEGMENTS;
    const items = [];

    for (let i = 0; i < SEGMENTS; i++) {
      const start = Math.PI + i * step;
      const end = Math.PI + (i + 1) * step;
      const x1o = cx + radiusOuter * Math.cos(start);
      const y1o = cy + radiusOuter * Math.sin(start);
      const x2o = cx + radiusOuter * Math.cos(end);
      const y2o = cy + radiusOuter * Math.sin(end);

      const x1i = cx + radiusInner * Math.cos(start);
      const y1i = cy + radiusInner * Math.sin(start);
      const x2i = cx + radiusInner * Math.cos(end);
      const y2i = cy + radiusInner * Math.sin(end);

      const d = [
        `M ${x1o} ${y1o}`,
        `A ${radiusOuter} ${radiusOuter} 0 0 1 ${x2o} ${y2o}`,
        `L ${x2i} ${y2i}`,
        `A ${radiusInner} ${radiusInner} 0 0 0 ${x1i} ${y1i}`,
        "Z",
      ].join(" ");

      items.push({ d, color: COLORS[i] });
    }
    return items;
  }, []);

  return (
    <svg viewBox="0 0 300 200" className="w-full max-w-md" role="img" aria-label={`Uso del crédito ${clamped}%`}>
      <rect width="300" height="200" fill="#0d1218" rx="8" />

      <g>
        {segments.map((seg, idx) => (
          <path key={idx} d={seg.d} fill={seg.color} />
        ))}
      </g>

      {/* Gauge base */}
      <path
        d="M 10 150 A 140 140 0 0 1 290 150"
        fill="none"
        stroke="#0d1218"
        strokeWidth="16"
      />

      {/* Needle */}
      <g
        style={{
          transformOrigin: "150px 150px",
          transform: `rotate(${needleAngle}deg)`,
          transition: "transform 300ms ease-out",
        }}
      >
        <polygon
          points="150,150 160,155 250,150 160,145"
          fill="#f5f1e8"
          stroke="#f5f1e8"
          strokeLinejoin="round"
        />
        <circle cx="150" cy="150" r="10" fill="#0d1218" />
        <circle cx="150" cy="150" r="6" fill="#f5f1e8" />
      </g>
    </svg>
  );
}
