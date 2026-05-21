/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronDown, ChevronUp, Quote } from 'lucide-react';

export function TrustAndFaq() {
  // 6 Premium reviews / testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Aditi Sharma',
      role: 'Creative Director',
      company: 'Vivid Studio Delhi',
      comment: 'MeeCards completely replaced my bulk paper visiting cards. Now, I just tap my phone on clients mobiles or share my gorgeous Saffron card link. The design customization is unreal!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Rohan Mehta',
      role: 'Co-Founder',
      company: 'InnovateX Bangalore',
      comment: 'Secured the premium NFC Metal card. Absolute head turner at pitch events! It syncs flawlessly on both Android + iPhones. Razorpay billing was straightforward and shipping was super fast.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Sneha Rao',
      role: 'Freelance Architect',
      company: 'Rao Spaces',
      comment: 'I am a minimal fan and the Slate template fit perfectly. The interactive layout options allowed me to structure my Portfolio website and WhatsApp contacts into clean action capsules. Highly recommended!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Amit Patel',
      role: 'Real Estate Advisor',
      company: 'Apex Properties Mumbai',
      comment: 'Free canvas downloads are awesome, but the Pro templates with circuit pattern layers are on another level! Instant client rapport when I tap to share my coordinates.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    },
    {
      id: 5,
      name: 'Kshitiz Roy',
      role: 'Tech Consultant',
      company: 'Vanguard Systems',
      comment: 'Best digital business card builder out there. Period. No buggy third-party bloated libraries, just quick clean loading card visual layouts, QR patterns, and premium design tokens.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=150&auto=format&fit=crop',
    },
    {
      id: 6,
      name: 'Priyanka Das',
      role: 'Blogger & Influencer',
      company: 'Vibe Feed',
      comment: 'My followers love scanning my neon cyber layout. It captures all my socials in a compact button row. The local storage favourites option helped me customize several presets instantly.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    },
  ];

  // FAQ Accordion (only one open at once, first open by default)
  const faqs = [
    {
      question: 'How do I share my MeeCard with clients?',
      answer: 'Sharing is instant and frictionless. You can let clients scan your custom-generated QR code directly from your smartphone, tag it to an NFC chip, or share your vanity web URL (meecards.in/yourname) via WhatsApp or SMS. No app installation is required from your clients.',
    },
    {
      question: 'Will the physical NFC Elite card work on all smartphones?',
      answer: 'Yes! The NFC Elite physical card uses ISO/IEC 14443 standard tracking compatible with over 98% of modern smartphones, including Apple iPhone 7+ and all active Android devices. We also include a high-contrast dynamic QR link on the physical card for older phone models.',
    },
    {
      question: 'Can I change my card details (e.g., job role, phone) after printing?',
      answer: 'Absolutely! If you belong to the Pro Digital or NFC Elite tier, your card data lives on the MeeCards cloud registry. You can edit layouts, change phone numbers, emails, or swap themes anytime through your mobile builder tab. Updates reflect on the target card instantly in real time.',
    },
    {
      question: 'What benefits does the Pro Digital plan offer over Free plan?',
      answer: 'The Free plan offers access to classical layouts and allows exporting standard PNG canvas cards without limit. By upgrading to Pro Digital (₹99/mo), you unlock all 30 custom elite styles, 10 fully coded layouts, circuit vectors background pattern library, and remove meecards watermark print tags.',
    },
    {
      question: 'Is my data secure on MeeCards platform?',
      answer: 'We employ state-of-the-art security practices. Your contact details are stored in high-performance isolated container nodes and transmitted via secure TLS endpoints. We do not Sell or lease user contacts with third-party advertising modules.',
    },
  ];

  const [activeFAQ, setActiveFAQ] = useState<number | null>(0); // First FAQ open by default

  return (
    <div className="space-y-24">
      {/* 6 TESTIMONIALS SECTION */}
      <section id="reviews" className="scroll-mt-16 container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-meecards-saffron font-bold font-mono">Real Validation</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mt-1">
            Loved by 12,000+ Professionals
          </h2>
          <p className="text-neutral-400 text-sm mt-3">
            See how founders, designers, realtors, and independent builders use MeeCards to leave a premium lasting impression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ y: -4 }}
              className="bg-[#0a0a0d] border border-neutral-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Quote Icon Accent */}
              <Quote className="absolute right-4 top-4 text-white/5 w-16 h-16 pointer-events-none" />

              <div>
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-meecards-gold fill-meecards-gold" />
                  ))}
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed italic mb-6 relative z-10">
                  "{review.comment}"
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3 border-t border-white/[0.04] pt-4 mt-auto">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white font-heading truncate leading-tight">{review.name}</h4>
                  <p className="text-[11px] text-neutral-500 truncate leading-snug">
                    {review.role} • <span className="font-mono text-[10px]">{review.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="scroll-mt-16 container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-meecards-gold font-bold font-mono">Humble Answers</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-sm mt-3">
            Got queries about the digital builder, dynamic QR systems, design presets or NFC delivery? We’ve got you covered.
          </p>
        </div>

        <div className="bg-[#0a0a0d] border border-neutral-900 rounded-3xl p-2 md:p-4 space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = activeFAQ === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition duration-300 ${
                  isOpen ? 'bg-[#0f0f14] border border-neutral-800' : 'border border-transparent hover:bg-neutral-900/30'
                }`}
              >
                <button
                  onClick={() => setActiveFAQ(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left p-5 text-sm md:text-base font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <span className="font-heading tracking-tight pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-meecards-saffron shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-neutral-400 leading-relaxed border-t border-neutral-900/60 mt-1 max-w-3xl">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
