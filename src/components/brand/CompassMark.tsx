type CompassMarkProps = {
  className?: string;
  size?: number;
  opacity?: number;
  showLabels?: boolean;
  animated?: boolean;
};

export function CompassMark({
  className = "",
  size = 200,
  opacity = 1,
  showLabels = true,
  animated = false,
}: CompassMarkProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`${animated ? "animate-[spin_120s_linear_infinite]" : ""} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      {[0, 45, 90, 135].map((angle) => (
        <line
          key={angle}
          x1="100"
          y1="100"
          x2={100 + 88 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 88 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.4"
        />
      ))}
      <polygon
        points="100,18 108,92 100,78 92,92"
        fill="currentColor"
        opacity="0.9"
      />
      <polygon
        points="100,182 108,108 100,122 92,108"
        fill="currentColor"
        opacity="0.35"
      />
      <polygon
        points="18,100 92,108 78,100 92,92"
        fill="currentColor"
        opacity="0.35"
      />
      <polygon
        points="182,100 108,92 122,100 108,108"
        fill="currentColor"
        opacity="0.35"
      />
      <circle cx="100" cy="100" r="6" fill="currentColor" />
      {showLabels && (
        <>
          <text x="100" y="12" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">
            N
          </text>
          <text x="100" y="198" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">
            S
          </text>
          <text x="8" y="104" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">
            W
          </text>
          <text x="192" y="104" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">
            E
          </text>
        </>
      )}
    </svg>
  );
}
