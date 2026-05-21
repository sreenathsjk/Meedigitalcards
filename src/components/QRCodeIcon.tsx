/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function QRCodeIcon({ color = 'currentColor', size = 48 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      {/* Top Left Finder Pattern */}
      <rect x="2" y="2" width="6" height="6" rx="1" strokeWidth="1.5" />
      <rect x="4" y="4" width="2" height="2" fill={color} stroke="none" />
      
      {/* Top Right Finder Pattern */}
      <rect x="16" y="2" width="6" height="6" rx="1" strokeWidth="1.5" />
      <rect x="18" y="4" width="2" height="2" fill={color} stroke="none" />
      
      {/* Bottom Left Finder Pattern */}
      <rect x="2" y="16" width="6" height="6" rx="1" strokeWidth="1.5" />
      <rect x="4" y="18" width="2" height="2" fill={color} stroke="none" />
      
      {/* Helper pixels and random structures */}
      <rect x="10" y="2" width="2" height="2" fill={color} stroke="none" />
      <rect x="10" y="6" width="2" height="2" fill={color} stroke="none" />
      <rect x="14" y="4" width="2" height="2" fill={color} stroke="none" />
      
      <rect x="2" y="10" width="2" height="2" fill={color} stroke="none" />
      <rect x="6" y="12" width="2" height="2" fill={color} stroke="none" />
      <rect x="10" y="10" width="4" height="2" fill={color} stroke="none" />
      
      <rect x="18" y="10" width="2" height="2" fill={color} stroke="none" />
      <rect x="14" y="12" width="2" height="2" fill={color} stroke="none" />
      
      <rect x="10" y="14" width="2" height="4" fill={color} stroke="none" />
      <rect x="14" y="16" width="4" height="2" fill={color} stroke="none" />
      <rect x="14" y="20" width="2" height="2" fill={color} stroke="none" />
      <rect x="18" y="18" width="4" height="4" fill={color} stroke="none" />
    </svg>
  );
}
