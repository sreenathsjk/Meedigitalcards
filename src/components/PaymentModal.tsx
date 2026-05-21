/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, CreditCard, Sparkles, Trophy } from 'lucide-react';
import { PlanType } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: 'free' | 'pro' | 'nfc') => void;
  selectedTemplateName?: string;
}

export function PaymentModal({ isOpen, onClose, onSelectPlan, selectedTemplateName }: PaymentModalProps) {
  const plans: { id: 'free' | 'pro' | 'nfc'; name: string; price: string; period: string; icon: any; color: string; badge?: string; desc: string; features: string[] }[] = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '₹0',
      period: 'forever',
      icon: Sparkles,
      color: 'border-neutral-800 text-white hover:border-neutral-700',
      desc: 'Perfect for beginners starting their networking.',
      features: [
        'Standard layouts access',
        'PNG canvas download',
        'Local card modifications',
        'Basic QR code tagging',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Digital',
      price: '₹99',
      period: 'per month',
      icon: Trophy,
      color: 'border-meecards-teal bg-meecards-teal/5 text-white',
      badge: 'Most Popular',
      desc: 'For builders who demand elite personal styling.',
      features: [
        'All 30 premium templates',
        '10 dynamic coded layouts',
        'Unlimited svg patterns',
        'No brand prints',
        'Dynamic website link target',
      ],
    },
    {
      id: 'nfc',
      name: 'NFC Elite',
      price: '₹398',
      period: 'one-time print',
      icon: CreditCard,
      color: 'border-meecards-saffron bg-meecards-saffron/5 text-white shadow-saffron/10',
      badge: 'Best Value',
      desc: 'Get your physical premium NFC card delivered.',
      features: [
        'Physical metallic card print',
        'Free shipping across India',
        'Tap to share instantly',
        'Lifetime cloud hosting sync',
        '24/7 priority elite assistance',
      ],
    },
  ];

  /*
  --- RAZORPAY INTEGRATION INTEGRITY POINT ---
  To activate production checkout, call the Razorpay API script and trigger:
  
  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",
    amount: planId === 'pro' ? 9900 : 39800, // in paise
    currency: "INR",
    name: "MeeCards SaaS",
    description: `Upgrade to ${planName} Plan`,
    handler: function (response) {
      alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      onSelectPlan(planId);
    },
    prefill: {
      email: "user@example.com",
      contact: "9999999999"
    },
    theme: {
      color: "#FF6B00"
    }
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
  */

  const handlePlanClick = (planId: 'free' | 'pro' | 'nfc') => {
    // Premium checkout feedback simulation
    onSelectPlan(planId);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-[#0a0a0d] border border-neutral-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 md:p-8 flex items-start justify-between border-b border-neutral-900 bg-[#060608]">
            <div>
              {selectedTemplateName && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-meecards-gold/10 border border-meecards-gold/30 text-meecards-gold text-xs font-semibold uppercase tracking-widest mb-2 font-mono">
                  <Sparkles className="w-3 h-3" />
                  Premium: {selectedTemplateName}
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight">
                Unlock Premium Networking
              </h2>
              <p className="text-neutral-400 text-sm mt-1 max-w-xl">
                Choose the perfect format to represent your professional identity. Instant delivery with zero hidden charges.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition p-2 rounded-full hover:bg-white/5 active:scale-95 cursor-pointer ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrolling Plans Area */}
          <div className="p-6 md:p-8 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 bg-[#0a0a0d] flex-1">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.color}`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-meecards-saffron text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
                      {plan.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-5 h-5 ${plan.id === 'pro' ? 'text-meecards-teal' : plan.id === 'nfc' ? 'text-meecards-saffron' : 'text-neutral-400'}`} />
                      <h3 className="font-bold text-lg text-white font-heading">{plan.name}</h3>
                    </div>

                    <p className="text-xs text-neutral-400 mb-4 h-10 overflow-hidden leading-relaxed">
                      {plan.desc}
                    </p>

                    <div className="flex items-baseline gap-1.5 mb-6 border-b border-white/5 pb-4">
                      <span className="text-3xl font-extrabold text-white tracking-tight">{plan.price}</span>
                      <span className="text-xs text-neutral-500 uppercase font-mono tracking-wider">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                          <Check className="w-4 h-4 text-meecards-teal shrink-0 mt-0.5" />
                          <span className="leading-tight no-wrap overflow-ellipsis whitespace-nowrap">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePlanClick(plan.id)}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
                      plan.id === 'free'
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        : plan.id === 'pro'
                        ? 'bg-meecards-teal text-neutral-950 font-bold hover:shadow-lg hover:shadow-meecards-teal/20'
                        : 'bg-meecards-saffron text-neutral-950 font-bold hover:shadow-lg hover:shadow-meecards-saffron/20'
                    }`}
                  >
                    {plan.id === 'free' ? 'Continue with Free' : `Activate ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer message */}
          <div className="p-4 bg-[#060608] border-t border-neutral-900 text-center">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-none font-mono">
              Secure transactions processed via Razorpay SSL • GST billing available
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
