/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm max-w-[90vw] md:max-w-md ${
        type === 'success'
          ? 'bg-neutral-900 border-meecards-teal text-white shadow-meecards-teal/10'
          : 'bg-neutral-900 border-red-500 text-white shadow-red-500/10'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-meecards-teal shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      )}
      
      <span className="font-medium">{message}</span>
      
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-white transition p-0.5 rounded-lg hover:bg-white/5 active:scale-95 cursor-pointer ml-auto shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
