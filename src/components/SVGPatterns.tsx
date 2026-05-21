/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function getSVGPattern(patternId: string | undefined): React.ReactNode {
  if (!patternId || patternId === 'none') return null;

  const style = { opacity: 0.12 };

  switch (patternId) {
    case '1': // Polka Dots
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style}>
          <defs>
            <pattern id="dotPattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      );
    case '2': // Diagonal Grid
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style}>
          <defs>
            <pattern id="diagonalPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0,20 L 20,0 M 0,0 L 20,20" stroke="currentColor" strokeWidth="0.8" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalPattern)" />
        </svg>
      );
    case '3': // Tech wave lines
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,30 Q25,20 50,50 T100,20 T150,40 M0,60 Q20,80 60,40 T100,70" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      );
    case '4': // Topographic contours
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none style" style={style} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M-10,50 C20,30 30,80 60,40 C80,20 90,80 110,60 M-10,70 Q30,50 60,90 T110,80 M10,10 Q50,40 90,10" stroke="currentColor" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case '5': // Cellular Tech Grid
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style}>
          <defs>
            <pattern id="cellularPattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="15" cy="15" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cellularPattern)" />
        </svg>
      );
    case '6': // Concentric circles
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style}>
          <defs>
            <pattern id="circlePattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="0.4" />
              <circle cx="20" cy="20" r="3" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circlePattern)" />
        </svg>
      );
    case '7': // Modern circuit line accents
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style} viewBox="0 0 400 240">
          <path d="M 10 10 H 120 L 140 30 V 100 L 160 120 H 300 M 340 50 V 90 L 320 110 H 260 M 50 200 H 210 L 230 180" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="300" cy="120" r="3" fill="currentColor" />
          <circle cx="140" cy="30" r="2.5" fill="currentColor" />
          <circle cx="230" cy="180" r="3" fill="currentColor" />
        </svg>
      );
    case '8': // Elegant Damask Spirals
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style}>
          <defs>
            <pattern id="spiralPattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 0 0 C 15 15, 35 15, 50 0 C 15 35, 15 15, 0 50 Q 25 25, 50 50" stroke="currentColor" strokeWidth="0.6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spiralPattern)" />
        </svg>
      );
    case '9': // Crosshairs Grid
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style}>
          <defs>
            <pattern id="crosshairPattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 12 0 V 24 M 0 12 H 24" stroke="currentColor" strokeWidth="0.4" />
              <rect x="10" y="10" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crosshairPattern)" />
        </svg>
      );
    case '10': // Honeycomb hex
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={style}>
          <defs>
            <pattern id="hexPattern" width="28" height="48" patternUnits="userSpaceOnUse">
              <path d="M0 0 L14 8 L28 0 M28 24 L14 16 L0 24 M0 24 L14 32 L28 24 M28 48 L14 40 L0 48 M0 0 V24 M28 0 V24 M14 8 V16 M14 32 V40" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPattern)" />
        </svg>
      );
    default:
      return null;
  }
}
