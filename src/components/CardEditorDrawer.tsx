/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { CardCustomization, UserCardData } from '../types';
import { CardLayoutRenderer } from './CardLayoutRenderer';

interface CardEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserCardData;
  initialCustomization: CardCustomization;
  onApply: (updated: CardCustomization) => void;
}

export function CardEditorDrawer({ isOpen, onClose, data, initialCustomization, onApply }: CardEditorDrawerProps) {
  const [customizer, setCustomizer] = useState<CardCustomization>(initialCustomization);

  useEffect(() => {
    setCustomizer(initialCustomization);
  }, [initialCustomization, isOpen]);

  // Seven styled font family entries
  const fontFamilies = [
    'Instrument Sans',
    'Syne',
    'Space Grotesk',
    'Playfair Display',
    'JetBrains Mono',
    'Inter',
    'Helvetica',
  ];

  // 15 Premium Background Presets (solid/gradient combinations)
  const bgPresets: { start: string; end: string; text: string; accent: string; type: 'solid' | 'gradient' }[] = [
    { start: '#FF6B00', end: '#060608', text: '#FFFFFF', accent: '#FF6B00', type: 'gradient' }, // saffron/dark
    { start: '#00C9A7', end: '#060608', text: '#FFFFFF', accent: '#00C9A7', type: 'gradient' }, // teal/dark
    { start: '#D4A017', end: '#060608', text: '#FFFFFF', accent: '#D4A017', type: 'gradient' }, // gold/dark
    { start: '#121214', end: '#121214', text: '#FFFFFF', accent: '#FFFFFF', type: 'solid' },    // slate black solid
    { start: '#FFFFFF', end: '#FFFFFF', text: '#060608', accent: '#060608', type: 'solid' },    // chalk white solid
    { start: '#FF007F', end: '#060608', text: '#FFFFFF', accent: '#FF007F', type: 'gradient' }, // magenta/dark
    { start: '#805AD5', end: '#1A0B2E', text: '#FFFFFF', accent: '#D6BCFA', type: 'gradient' }, // purple gradient
    { start: '#1E293B', end: '#0F172A', text: '#F8FAFC', accent: '#38BDF8', type: 'gradient' }, // deep oceanic
    { start: '#276749', end: '#060608', text: '#FFFFFF', accent: '#D4A017', type: 'gradient' }, // emerald luxury
    { start: '#9B2C2C', end: '#1A202C', text: '#FFF5F5', accent: '#D4A017', type: 'gradient' }, // gold crimson
    { start: '#F5F5DC', end: '#F5F5DC', text: '#4A3B32', accent: '#8C6239', type: 'solid' },    // sand solid
    { start: '#E6FFFA', end: '#B2F5EA', text: '#234E52', accent: '#319795', type: 'gradient' }, // sweet mint
    { start: '#B7791F', end: '#1A202C', text: '#FFFFF0', accent: '#ED8936', type: 'gradient' }, // brass gradient
    { start: '#CBD5E1', end: '#94A3B8', text: '#0F172A', accent: '#475569', type: 'gradient' }, // steel metal
    { start: '#4F46E5', end: '#060608', text: '#FFFFFF', accent: '#818CF8', type: 'gradient' }, // royal indigo
  ];

  // 15 Accent Color Presets
  const accentPresets = [
    '#FF6B00', // saffron
    '#D4A017', // gold
    '#00C9A7', // teal
    '#FF007F', // hot magenta
    '#3B82F6', // royal blue
    '#10B981', // emerald
    '#8B5CF6', // purple
    '#EC4899', // rose
    '#F59E0B', // amber
    '#EF4444', // red
    '#FFFFFF', // white
    '#000000', // black
    '#A1A1AA', // zinc grey
    '#38BDF8', // sky blue
    '#F472B6', // pink pastel
  ];

  // Layout list of 10 fully supported styles
  const layouts: { id: typeof initialCustomization.layout; name: string }[] = [
    { id: 'standard', name: 'Standard classic' },
    { id: 'compact', name: 'Dense compact' },
    { id: 'wide-avatar', name: 'Wide Avatar card' },
    { id: 'minimal', name: 'Sparse Minimalist' },
    { id: 'bold-name', name: 'Bold Name focus' },
    { id: 'centered', name: 'Symmetric Center' },
    { id: 'split', name: 'Dual Split sections' },
    { id: 'pill-contacts', name: 'Interactive Pills' },
    { id: 'icon-row', name: 'Horizontal icon Row' },
    { id: 'sidebar', name: 'Left Sidebar rail' },
  ];

  // Pattern descriptors
  const patterns = [
    { id: 'none', label: 'Solid Clean' },
    { id: '1', label: 'Polka Dots' },
    { id: '2', label: 'Diagonal grid' },
    { id: '3', label: 'Cyber lines wave' },
    { id: '4', label: 'Topo lines contours' },
    { id: '5', label: 'Cellular grid dots' },
    { id: '6', label: 'Concentric circle rings' },
    { id: '7', label: 'Circuit traces' },
    { id: '8', label: 'Elegant spirals' },
    { id: '9', label: 'Crosshair targets' },
    { id: '10', label: 'Honeycomb hexagon' },
  ];

  // Preset Applicator
  const applyBgPreset = (idx: number) => {
    const pr = bgPresets[idx];
    setCustomizer((prev) => ({
      ...prev,
      backgroundType: pr.type,
      bgSolid: pr.start,
      bgGradientStart: pr.start,
      bgGradientEnd: pr.end,
      textColor: pr.text,
      accentColor: pr.accent,
      bgPresetIndex: idx,
    }));
  };

  const updateProp = <K extends keyof CardCustomization>(key: K, val: CardCustomization[K]) => {
    setCustomizer((prev) => ({ ...prev, [key]: val }));
  };

  const handleApplyClick = () => {
    onApply(customizer);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer container body */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="relative bg-[#08080a] border-l border-neutral-800 w-full max-w-lg md:max-w-xl h-screen shadow-2xl flex flex-col justify-between"
        >
          {/* Header Panel */}
          <div className="p-4 md:p-5 border-b border-neutral-900 bg-[#060608] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg font-heading text-white">MeeCard Studio Editor</h3>
              <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-mono">Personal styling terminal</p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition p-2 rounded-full hover:bg-white/5 active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scroll Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
            {/* STICKY CARD LIVE PREVIEW DOCKED AT TOP */}
            <div className="bg-[#0c0c10] border border-neutral-800/60 p-4 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A017] mb-2 font-mono">Instant render preview</span>
              <div className="w-[315px] h-[180px] rounded-xl overflow-hidden aspect-[1.75/1] shadow-2xl">
                <CardLayoutRenderer
                  data={data}
                  customization={customizer}
                  isMiniPreview={true}
                />
              </div>
            </div>

            {/* CONTROL BLOCK: LAYOUT TYPE SWITCHER */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-widest text-neutral-400">1. Switch Design Layout</h4>
              <div className="grid grid-cols-2 gap-2">
                {layouts.map((lay) => (
                  <button
                    key={lay.id}
                    type="button"
                    onClick={() => updateProp('layout', lay.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs text-left font-medium border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      customizer.layout === lay.id
                        ? 'bg-meecards-saffron/10 border-meecards-saffron text-meecards-saffron'
                        : 'border-neutral-800 bg-[#0a0a0d] text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span>{lay.name}</span>
                    {customizer.layout === lay.id && <span className="w-1.5 h-1.5 rounded-full bg-meecards-saffron" />}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTROL BLOCK: 15 BACKGROUND PRESETS */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-widest text-neutral-400">2. Apply Quick Palette Presets</h4>
              <div className="grid grid-cols-5 gap-2">
                {bgPresets.map((pr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyBgPreset(idx)}
                    title={`Preset ${idx + 1}`}
                    className={`h-10 rounded-lg relative overflow-hidden flex items-center justify-center border-2 transition active:scale-90 cursor-pointer ${
                      customizer.bgPresetIndex === idx ? 'border-white' : 'border-transparent'
                    }`}
                    style={{
                      background: pr.type === 'solid' ? pr.start : `linear-gradient(135deg, ${pr.start}, ${pr.end})`,
                    }}
                  >
                    {customizer.bgPresetIndex === idx && (
                      <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50">
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTROL BLOCK: CUSTOM COLOR PICKERS */}
            <div className="space-y-3 bg-[#0a0a0d] p-3 rounded-xl border border-neutral-900/40">
              <h4 className="text-xs uppercase font-bold tracking-widest text-neutral-400">3. Refine Background Canvas</h4>
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="bgType"
                    checked={customizer.backgroundType === 'solid'}
                    onChange={() => updateProp('backgroundType', 'solid')}
                    className="accent-meecards-saffron"
                  />
                  <span>Solid color</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="bgType"
                    checked={customizer.backgroundType === 'gradient'}
                    onChange={() => updateProp('backgroundType', 'gradient')}
                    className="accent-meecards-saffron"
                  />
                  <span>Gradient wash</span>
                </label>
              </div>

              {customizer.backgroundType === 'solid' ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">Canvas Color:</span>
                  <input
                    type="color"
                    value={customizer.bgSolid}
                    onChange={(e) => updateProp('bgSolid', e.target.value)}
                    className="w-12 h-8 rounded border border-neutral-800 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-neutral-400">{customizer.bgSolid}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400">Start:</span>
                      <input
                        type="color"
                        value={customizer.bgGradientStart}
                        onChange={(e) => updateProp('bgGradientStart', e.target.value)}
                        className="w-10 h-7 rounded border border-neutral-800 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-neutral-500">{customizer.bgGradientStart}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400">End:</span>
                      <input
                        type="color"
                        value={customizer.bgGradientEnd}
                        onChange={(e) => updateProp('bgGradientEnd', e.target.value)}
                        className="w-10 h-7 rounded border border-neutral-800 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-neutral-500">{customizer.bgGradientEnd}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Gradient Angle</span>
                      <span className="font-mono text-[10px]">{customizer.bgGradientAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={customizer.bgGradientAngle}
                      onChange={(e) => updateProp('bgGradientAngle', parseInt(e.target.value))}
                      className="w-full accent-meecards-saffron h-1.5 bg-neutral-900 rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ACCENT COLOUR PRESETS */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-widest text-neutral-400">4. Select Accent Color</h4>
              <div className="grid grid-cols-5 gap-2">
                {accentPresets.map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateProp('accentColor', col);
                      updateProp('accentPresetIndex', idx);
                    }}
                    title={col}
                    className="h-8 rounded-lg relative overflow-hidden flex items-center justify-center border transition cursor-pointer active:scale-95"
                    style={{ backgroundColor: col, borderColor: col === '#FFFFFF' ? '#000' : 'transparent' }}
                  >
                    {customizer.accentColor.toLowerCase() === col.toLowerCase() && (
                      <div className="w-5 h-5 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* BACKGROUND SVG PATTERN SELECTOR */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4A017] flex items-center gap-1">5. Background Pattern Overlay</h4>
              <select
                value={customizer.svgPattern}
                onChange={(e) => updateProp('svgPattern', e.target.value)}
                className="w-full bg-[#0a0a0d] text-white py-3 px-4 rounded-xl text-xs border border-neutral-800 focus:outline-none focus:border-meecards-saffron"
              >
                {patterns.map((pat) => (
                  <option key={pat.id} value={pat.id}>{pat.label}</option>
                ))}
              </select>
            </div>

            {/* FONTS AND ADJUSTMENTS */}
            <div className="space-y-4 bg-[#0a0a0d] p-3 rounded-xl border border-neutral-900/40">
              <h4 className="text-xs uppercase font-bold tracking-widest text-neutral-400">6. Fine-Tune Typography</h4>
              
              <div className="space-y-1">
                <label className="text-xs text-neutral-450 block">Font Family Pairing</label>
                <select
                  value={customizer.fontFamily}
                  onChange={(e) => updateProp('fontFamily', e.target.value)}
                  className="w-full bg-[#060608] text-white py-2.5 px-3 rounded-lg text-xs border border-neutral-800 focus:outline-none focus:border-meecards-saffron"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-450">
                  <span>Name Size</span>
                  <span className="font-mono text-[10px]">{customizer.nameSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="36"
                  value={customizer.nameSize}
                  onChange={(e) => updateProp('nameSize', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-900 rounded accent-meecards-saffron focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-450">
                  <span>Contact Labels Size</span>
                  <span className="font-mono text-[10px]">{customizer.bodySize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="18"
                  value={customizer.bodySize}
                  onChange={(e) => updateProp('bodySize', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-900 rounded accent-meecards-saffron focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-450">
                  <span>Corner Radius</span>
                  <span className="font-mono text-[10px]">{customizer.cornerRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={customizer.cornerRadius}
                  onChange={(e) => updateProp('cornerRadius', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-900 rounded accent-meecards-saffron focus:outline-none"
                />
              </div>
            </div>

            {/* BUTTON TOGGLES */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-xs text-neutral-300 font-medium select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={customizer.showShadow}
                  onChange={(e) => updateProp('showShadow', e.target.checked)}
                  className="w-4 h-4 rounded accent-meecards-saffron border-neutral-800"
                />
                <span>Enable Card Shadow</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-neutral-300 font-medium select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={customizer.showBorder}
                  onChange={(e) => updateProp('showBorder', e.target.checked)}
                  className="w-4 h-4 rounded accent-meecards-saffron border-neutral-800"
                />
                <span>Accent Outer Border</span>
              </label>
            </div>
          </div>

          {/* Apply & Close Controls */}
          <div className="p-4 bg-[#060608] border-t border-neutral-900 grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-3 rounded-xl border border-neutral-800 text-xs text-neutral-400 font-bold uppercase tracking-wider hover:bg-neutral-900 transition active:scale-95 cursor-pointer"
            >
              Reset / Cancel
            </button>
            <button
              onClick={handleApplyClick}
              className="py-3 rounded-xl bg-gradient-to-r from-meecards-saffron to-amber-500 text-xs text-black font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-meecards-saffron/15 transition active:scale-95 cursor-pointer"
            >
              Apply & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
