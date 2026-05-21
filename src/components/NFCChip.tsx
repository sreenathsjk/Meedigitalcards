/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function NFCChip({ color = '#D4A017' }: { color?: string }) {
  return (
    <div className="relative w-9 h-7 rounded bg-gradient-to-br from-amber-400 to-yellow-600 p-[1.5px] shadow-sm flex items-center justify-center shrink-0">
      <div className="w-full h-full rounded-[2.5px] bg-amber-500/10 flex flex-col justify-between p-1 relative overflow-hidden">
        {/* Core contact pads */}
        <div className="flex justify-between h-full w-full gap-[2px]">
          <div className="w-1/3 border-r border-yellow-700/60 flex flex-col justify-between py-[2px]">
            <div className="h-[2px] w-full bg-yellow-200/50" />
            <div className="h-[2px] w-full bg-yellow-200/50" />
            <div className="h-[2px] w-full bg-yellow-200/50" />
          </div>
          <div className="w-1/3 border-r border-yellow-700/60 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full border border-yellow-300/40 bg-yellow-600/30" />
          </div>
          <div className="w-1/3 flex flex-col justify-between py-[2px]">
            <div className="h-[2px] w-full bg-yellow-200/50" />
            <div className="h-[2px] w-full bg-yellow-200/50" />
            <div className="h-[2px] w-full bg-yellow-200/50" />
          </div>
        </div>
        {/* Chip accent line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-yellow-800/80" />
      </div>
    </div>
  );
}
