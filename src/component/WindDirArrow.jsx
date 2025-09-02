import React from "react";

/**
 * Simple arrow that rotates by `angle` degrees.
 * Open-Meteo winddirection is meteorological (wind from). We rotate arrow so it points toward the direction the wind is coming from.
 */
export default function WindDirArrow({ angle = 0, size = 48 }) {
  const style = {
    transform: `rotate(${angle}deg)`,
    transformOrigin: "center",
    display: "inline-block",
    color: "#111",
  };

  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 24 24" width={size} height={size} style={style}>
        <g transform="translate(12,12)">
          <path d="M0,-9 L4,-1 L1,-1 L1,9 L-1,9 L-1,-1 L-4,-1 Z" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}
