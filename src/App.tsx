 /**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { UserCardData, CardCustomization, CardTemplate } from './types';
import { CARD_TEMPLATES_DATA } from './templatesData';
import { CardLayoutRenderer } from './components/CardLayoutRenderer';
import { CardEditorDrawer } from './components/CardEditorDrawer';
import { PaymentModal } from './components/PaymentModal';
import { CardBuilder } from './components/CardBuilder';
import { TrustAndFaq } from './components/TrustAndFaq';
import { Toast } from './components/Toast';
import { renderCardToPNG } from './utils/canvasRenderer';

export default function App() {
  // Navigation hamburger menu state
  const [isHamOpen, setIsHamOpen] = useState(false);
  const hamRef = useRef<HTMLDivElement>(null);

  // Scroll Progress State
  const [scrollProgress, setScrollProgress] = useState(0);

  // Stats Counters
  const [stats, setStats] = useState({ cards: 0, saved: 0, satisfaction: 0 });
  const statsSectionRef = useRef<HTMLDivElement>(null);

  // User input data and Active visual customized values
  const [userData, setUserData] = useState<UserCardData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(CARD_TEMPLATES_DATA[0]);
  const [userCustomizations, setUserCustomizations] = useState<Record<string, CardCustomization>>({});
  
  // Gallery System States
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [templatesList, setTemplatesList] = useState<CardTemplate[]>(CARD_TEMPLATES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'premium' | 'trending' | 'new'>('all');
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);

  // Drawer and Dialog States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentScope, setPaymentScope] = useState<'free' | 'pro' | 'nfc'>('free');

  // Download details
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  // Toast notification module
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Trigger Notification helper
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Click-to-reveal plan card type details
  const [activeRevealedType, setActiveRevealedType] = useState<number>(0);

  // Initial loading from storage
  useEffect(() => {
    const saved = localStorage.getItem('mee-favourites');
    if (saved) {
      setFavourites(JSON.parse(saved));
    }
  }, []);

  // Keyboard accessibility bindings (Escape closes any overlays)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsHamOpen(false);
        setIsEditorOpen(false);
        setIsCheckoutOpen(false);
        setDownloadProgress(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mobile hamburger outside click detection
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isHamOpen && hamRef.current && !hamRef.current.contains(e.target as Node)) {
        setIsHamOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isHamOpen]);

  // Scroll Progress tracking calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stat Counter Increment Intersections Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Increment animation values slowly
          let cardsTrigger = 0;
          let savedTrigger = 0;
          let satTrigger = 0;

          const cardsTarget = 14240;
          const savedTarget = 48200;
          const satTarget = 99;

          const interval = setInterval(() => {
            let done = true;
            if (cardsTrigger < cardsTarget) {
              cardsTrigger = Math.min(cardsTrigger + 400, cardsTarget);
              done = false;
            }
            if (savedTrigger < savedTarget) {
              savedTrigger = Math.min(savedTrigger + 1100, savedTarget);
              done = false;
            }
            if (satTrigger < satTarget) {
              satTrigger = Math.min(satTrigger + 3, satTarget);
              done = false;
            }

            setStats({ cards: cardsTrigger, saved: savedTrigger, satisfaction: satTrigger });

            if (done) clearInterval(interval);
          }, 24);
        }
      },
      { threshold: 0.15 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Update current template customized style safely
  const handleEditorApply = (customVal: CardCustomization) => {
    setUserCustomizations((prev) => ({
      ...prev,
      [selectedTemplate.id]: customVal,
    }));
    showToast(`Successfully applied design configurations!`, 'success');
  };

  const getActiveCustomization = (template: CardTemplate): CardCustomization => {
    const saved = userCustomizations[template.id];
    if (saved) return saved;

    // Build default customization based on template guidelines
    return {
      backgroundType: template.style.backgroundType || 'solid',
      bgSolid: template.style.bgSolid || '#060608',
      bgGradientStart: template.style.bgGradientStart || '#060608',
      bgGradientEnd: template.style.bgGradientEnd || '#060608',
      bgGradientAngle: template.style.bgGradientAngle || 135,
      bgPresetIndex: 0,
      fontFamily: template.style.fontFamily || 'Instrument Sans',
      nameSize: template.style.nameSize || 26,
      bodySize: template.style.bodySize || 13,
      textColor: template.style.textColor || '#FFFFFF',
      accentColor: template.style.accentColor || '#FF6B00',
      accentPresetIndex: 0,
      cornerRadius: template.style.cornerRadius !== undefined ? template.style.cornerRadius : 16,
      svgPattern: template.style.svgPattern || '3',
      showShadow: template.style.showShadow ?? true,
      showBorder: template.style.showBorder ?? false,
      layout: template.style.layout || 'standard',
    };
  };

  // Gallery actions mapping
  const toggleFavourite = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favourites.includes(templateId)) {
      updated = favourites.filter((id) => id !== templateId);
      showToast('Removed template from Saved Favourites', 'success');
    } else {
      updated = [...favourites, templateId];
      showToast('Saved template to local Favourites Shelf!', 'success');
    }
    setFavourites(updated);
    localStorage.setItem('mee-favourites', JSON.stringify(updated));
  };

  // Click handler for template grid entry
  const handleSelectTemplate = (template: CardTemplate) => {
    setSelectedTemplate(template);
    if (template.category === 'premium') {
      setIsCheckoutOpen(true);
    } else {
      showToast(`Selected style "${template.name}"`, 'success');
    }
  };

  const handlePlanCheckoutSelect = (planId: 'free' | 'pro' | 'nfc') => {
    setPaymentScope(planId);
    setIsCheckoutOpen(false);
    if (planId === 'free') {
      showToast('Free status kept. Feel free to download Free templates.', 'success');
      // If they selected free but template was premium, fallback to saffron
      if (selectedTemplate.category === 'premium') {
        setSelectedTemplate(CARD_TEMPLATES_DATA[0]);
      }
    } else {
      showToast(`Completed mock purchase for ${planId === 'pro' ? 'Pro Digital' : 'NFC Elite'}! Enforcing full styling access.`, 'success');
      // Force selected premium template to behave as "free" (unlocked) for their workspace session
      selectedTemplate.category = 'free'; 
    }
  };

  // Perform PNG Canvas Download Action
  const triggerCanvasPNGDownload = async () => {
    if (!userData) return;
    try {
      setDownloadProgress(20);
      const style = getActiveCustomization(selectedTemplate);
      
      const dataUrl = await renderCardToPNG(userData, style, (p) => {
        setDownloadProgress(p);
      });

      // Simple browser downloader triggering
      const link = document.createElement('a');
      link.download = `meecard_${selectedTemplate.id}.png`;
      link.href = dataUrl;
      link.click();

      showToast('PNG Card downloaded successfully! 🚀', 'success');
      setTimeout(() => setDownloadProgress(null), 1200);
    } catch (err) {
      console.error(err);
      showToast('Could not compile PNG onto Canvas', 'error');
      setDownloadProgress(null);
    }
  };

  // Filter templates list based on search and selected drug tags
  const filteredTemplates = templatesList.filter((tpl) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = tpl.name.toLowerCase().includes(q) || tpl.tags.some((t) => t.includes(q));
    
    if (activeFilter === 'all') return matchesQuery;
    if (activeFilter === 'free') return matchesQuery && tpl.category === 'free';
    if (activeFilter === 'premium') return matchesQuery && tpl.category === 'premium';
    if (activeFilter === 'trending') return matchesQuery && tpl.trending;
    if (activeFilter === 'new') return matchesQuery && tpl.tags.includes('exclusive') || tpl.tags.includes('high-contrast');
    
    return matchesQuery;
  });

  const handleCardBuilderSubmit = (data: UserCardData) => {
    setUserData(data);
    setLoadingTemplates(true);
    // Smooth transition simulation
    setTimeout(() => {
      setLoadingTemplates(false);
      setIsGalleryOpen(true);
      showToast('Gallery of 30 premium designs successfully prepared!', 'success');
      // Scroll to gallery section
      const galleriesBlock = document.getElementById('gallery-system');
      if (galleriesBlock) {
        galleriesBlock.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1300);
  };

  // 6 Card Types Definition
  const cardTypes = [
    {
      title: 'Free Digital Starter',
      subtitle: 'For Beginners',
      desc: 'Simple interactive networking containing contact cards and direct links.',
      icon: Icons.Award,
      chips: ['All standard layouts', 'Free static QR code', 'PNG Card download'],
      highlight: 'Standard customization',
    },
    {
      title: 'Pro Professional Digital',
      subtitle: 'For Founders & Creators',
      desc: 'Full studio customization with premium vectors, custom patterns and no branding tags.',
      icon: Icons.Sparkles,
      chips: ['30 premium template options', '10 coded layouts', 'Unlimited background patterns', 'Dynamic redirection target'],
      highlight: 'Zero brand print tags',
    },
    {
      title: 'Metallic NFC Elite',
      subtitle: 'For Executives & CEOs',
      desc: 'Top-tier solid steel laser engraved card. Tap to share contacts instantly without apps.',
      icon: Icons.CreditCard,
      chips: ['Premium physical NFC card', 'Tap-sharing compatibility', 'Free shipping India', 'Lifetime dynamic hosting'],
      highlight: 'Premium steel laser engrave',
    },
    {
      title: 'Student Connect Pass',
      subtitle: 'For Young Innovators',
      desc: 'Affordable academic dynamic profile card to easily secure internships and college networking.',
      icon: Icons.BookOpen,
      chips: ['Resume cloud attachments', 'Link to LinkedIn / GitHub', 'Standard clean grid layout'],
      highlight: 'Academic promo pricing',
    },
    {
      title: 'Independent Freelancer',
      subtitle: 'For Solopreneurs',
      desc: 'A professional platform card to showcase services, customer reviews, and project budgets.',
      icon: Icons.Compass,
      chips: ['Services listing module', 'WhatsApp instant chat links', 'Custom accent buttons row'],
      highlight: 'Interactive Service pills',
    },
    {
      title: 'Enterprise Team Suit',
      subtitle: 'For Startups & Agencies',
      desc: 'Manage company roles with unified layouts, customized team tracking dashboard and corporate branding.',
      icon: Icons.Users,
      chips: ['Team manager dashboard', 'Dynamic analytical charts', 'Corporate domain sync'],
      highlight: 'Unified dashboard panels',
    },
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-meecards-saffron selection:text-black">
      {/* Scroll progress bar */}
      <div className="fixed top-0 inset-x-0 h-[3px] bg-neutral-900 z-50">
        <div className="h-full bg-gradient-to-r from-meecards-saffron to-meecards-teal transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* SECTION 1: FIXED NAV WITH CTAs */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-[#060603]/85 backdrop-blur-md border-b border-neutral-900/60 z-40 px-4 md:px-8 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 select-none group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-meecards-saffron to-amber-500 p-[1.5px] shadow-lg shadow-meecards-saffron/10 flex items-center justify-center transform group-hover:rotate-6 transition duration-300">
            <div className="w-full h-full rounded-[6px] bg-neutral-950 flex items-center justify-center">
              <span className="font-heading font-black text-meecards-saffron text-sm tracking-tighter">M</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base text-white tracking-widest leading-none">MeeCards</span>
            <span className="text-[9px] font-mono tracking-widest text-neutral-500 mt-0.5">meecards.in</span>
          </div>
        </a>

        {/* Desktop Nav links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-300">
          <a href="#card-types" className="hover:text-meecards-saffron transition">Card Types</a>
          <a href="#card-builder" className="hover:text-meecards-teal transition">Builder</a>
          <a href="#features" className="hover:text-meecards-gold transition">Features</a>
          <a href="#reviews" className="hover:text-meecards-saffron transition">Reviews</a>
          <a href="#faq" className="hover:text-neutral-100 transition">FAQ</a>
        </div>

        {/* Build Card desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-xs text-neutral-500 font-mono">Status: 100% Live</span>
          <a
            href="https://ais-pre-3muqfmk6dgwqs5hnpqljkj-196543076788.asia-southeast1.run.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-meecards-saffron hover:shadow-lg hover:shadow-[#FF6B00]/10 transition duration-300 text-xs font-bold uppercase tracking-wider active:scale-95 cursor-pointer"
          >
            Build My Card
          </a>
        </div>

        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setIsHamOpen(!isHamOpen)}
          className="md:hidden text-neutral-400 hover:text-white transition p-2 cursor-pointer"
        >
          {isHamOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Hamburger menu panel */}
        <AnimatePresence>
          {isHamOpen && (
            <motion.div
              ref={hamRef}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-16 left-0 right-0 bg-[#060608] border-b border-neutral-900 p-6 flex flex-col gap-4 text-center z-50 shadow-2xl"
            >
              <a
                href="#card-types"
                onClick={() => setIsHamOpen(false)}
                className="text-sm font-semibold tracking-wide text-neutral-300 hover:text-meecards-saffron"
              >
                Card Types
              </a>
              <a
                href="#card-builder"
                onClick={() => setIsHamOpen(false)}
                className="text-sm font-semibold tracking-wide text-neutral-300 hover:text-meecards-teal"
              >
                Builder form
              </a>
              <a
                href="#features"
                onClick={() => setIsHamOpen(false)}
                className="text-sm font-semibold tracking-wide text-neutral-300 hover:text-[#D4A017]"
              >
                Full Features
              </a>
              <a
                href="#reviews"
                onClick={() => setIsHamOpen(false)}
                className="text-sm font-semibold tracking-wide text-neutral-300"
              >
                Client Reviews
              </a>
              <a
                href="#faq"
                onClick={() => setIsHamOpen(false)}
                className="text-sm font-semibold tracking-wide text-neutral-300"
              >
                FAQs
              </a>
              <hr className="border-neutral-900/80 my-2" />
              <a
                href="https://ais-pre-3muqfmk6dgwqs5hnpqljkj-196543076788.asia-southeast1.run.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsHamOpen(false)}
                className="px-4 py-2.5 bg-gradient-to-r from-[#FF6B00] to-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition duration-350 transform hover:scale-102 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Icons.Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Build My Card</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* SECTION 2: HERO WITH FLOATING CARD MOCKUP */}
      <header className="pt-32 pb-24 px-4 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero left text block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-meecards-saffron/10 border border-meecards-saffron/35 text-meecards-saffron text-xs font-semibold uppercase tracking-widest font-mono">
              <Icons.Sparkles className="w-3.5 h-3.5" />
              Dynamic SaaS Platform Live
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-white max-w-2xl leading-[1.1]">
              Your Professional Identity.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-meecards-saffron to-meecards-gold">
                Instantly Shared.
              </span>
            </h1>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl">
              Leave absolute paper junk business cards in the past. Customize elegant 3D metallic digital wallets cards on meecards.in, select from 30 luxury coded templates, tweak background patterns, and exchange credentials via instant taps or clean QR codes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://ais-pre-3muqfmk6dgwqs5hnpqljkj-196543076788.asia-southeast1.run.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-amber-500 text-black text-xs font-bold uppercase tracking-widest hover:shadow-xl hover:shadow-[#FF6B00]/15 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition duration-300 cursor-pointer"
              >
                <span>Draft Free MeeCard</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#card-types"
                className="px-6 py-4 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/30 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition duration-300 cursor-pointer"
              >
                <span>Browse NFC Layouts</span>
                <Icons.Eye className="w-4 h-4" />
              </a>
            </div>

            {/* Live Counter animation sector utilizing IntersectionObserver variables */}
            <div
              ref={statsSectionRef}
              className="pt-8 border-t border-neutral-950 grid grid-cols-3 gap-4"
            >
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold font-heading text-white">
                  {stats.cards.toLocaleString()}+
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#00C9A7] font-semibold font-mono">Cards Shared</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold font-heading text-white">
                  ₹{stats.saved.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-meecards-gold font-semibold font-mono">Prints Saved</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold font-heading text-white">
                  {stats.satisfaction}%
                </span>
                <span className="text-[10px] uppercase tracking-widest text-meecards-saffron font-semibold font-mono">Delivery Rate</span>
              </div>
            </div>
          </div>

          {/* Hero right floating mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="relative w-full max-w-[370px] h-[215px] p-0.5 rounded-2xl bg-gradient-to-br from-meecards-saffron via-meecards-gold to-neutral-900 shadow-2xl relative shadow-saffron/5"
            >
              {/* Default beautiful dummy card content for Floating UI display */}
              <div className="w-full h-full rounded-[14px] bg-[#07070b]/90 backdrop-blur-md overflow-hidden relative">
                {/* Simulated polka bg dots pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF6B00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <div className="p-5 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-extrabold text-lg text-white leading-tight">MeeCards Executive</h3>
                      <p className="text-xs text-[#00C9A7] font-semibold mt-0.5">Saffron Slate Edition</p>
                    </div>
                    {/* Simulated user circle image placeholder */}
                    <div className="w-12 h-12 rounded-full border-2 border-meecards-saffron overflow-hidden bg-neutral-900 flex items-center justify-center font-bold text-xs">
                      MC
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5 text-[10px] text-neutral-400 font-mono">
                      <p>Saffron Patil</p>
                      <p>CEO, MeeCards Media</p>
                      <p className="text-[#FF6B00]">+91 98765 43210</p>
                    </div>

                    {/* Miniature metallic vector NFC chip */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[9px] font-bold text-meecards-gold uppercase tracking-widest font-mono">Elite Metal</span>
                      <div className="w-7 h-5 r-sm rounded bg-gradient-to-r from-amber-400 to-yellow-600 border border-yellow-700/50 flex flex-col justify-between p-0.5">
                        <div className="h-0.5 bg-yellow-950/40 w-full" />
                        <div className="h-0.5 bg-yellow-950/40 w-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro branding watermark */}
                <div className="absolute right-3 bottom-1.5 text-[8px] uppercase tracking-widest text-neutral-600 font-bold font-mono">
                  meecards.in
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* SECTION 3: SCROLLING MARQUEE BAR */}
      <div className="w-full bg-[#0a0a0d] py-5 border-y border-neutral-900 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[...Array(2)].map((_, mainIdx) => (
            <div key={mainIdx} className="flex gap-12 items-center">
              <span className="text-neutral-400 hover:text-white transition cursor-pointer text-xs uppercase tracking-widest font-bold font-mono flex items-center gap-2">
                <Icons.Nfc className="w-4 h-4 text-meecards-saffron" />
                TAP TO SHARE INSTANTLY
              </span>
              <span className="text-neutral-400 hover:text-white transition cursor-pointer text-xs uppercase tracking-widest font-bold font-mono flex items-center gap-2">
                <Icons.Sparkles className="w-4 h-4 text-[#00C9A7]" />
                NFC FLUIDITY SECURED
              </span>
              <span className="text-neutral-400 hover:text-white transition cursor-pointer text-xs uppercase tracking-widest font-bold font-mono flex items-center gap-2">
                <Icons.Award className="w-4 h-4 text-meecards-gold" />
                NO APP INSTALLATION COMPULSORY
              </span>
              <span className="text-neutral-400 hover:text-white transition cursor-pointer text-xs uppercase tracking-widest font-bold font-mono flex items-center gap-2">
                <Icons.Compass className="w-4 h-4 text-slate-300" />
                DYNAMIC LINK REDIRECTION
              </span>
              <span className="text-neutral-400 hover:text-white transition cursor-pointer text-xs uppercase tracking-widest font-bold font-mono flex items-center gap-2">
                <Icons.Heart className="w-4 h-4 text-meecards-saffron" />
                ZERO PAPER WASTE & ECO INITIATIVE
              </span>
              <span className="text-neutral-400 hover:text-white transition cursor-pointer text-xs uppercase tracking-widest font-bold font-mono flex items-center gap-2">
                <Icons.Zap className="w-4 h-4 text-meecards-teal" />
                RAZORPAY checkout
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: 6 CARD TYPES WITH CLICK-TO-REVEAL AREA */}
      <section id="card-types" className="py-24 px-4 container mx-auto scroll-mt-16 text-center">
        <div className="max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#00C9A7] font-bold font-mono">Visual Formats</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mt-1">
            Choose Your Card Type
          </h2>
          <p className="text-neutral-400 text-sm mt-3">
            Click on any format layout card below to review its specialized animated feature panel instantly.
          </p>
        </div>

        {/* 6 Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-left">
          {cardTypes.map((type, idx) => {
            const Icon = type.icon;
            const isSelected = activeRevealedType === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveRevealedType(idx)}
                className={`relative rounded-3xl p-6 border cursor-pointer transition-all duration-300 select-none ${
                  isSelected
                    ? 'border-meecards-saffron bg-meecards-saffron/[0.03] shadow-lg shadow-meecards-saffron/5'
                    : 'border-neutral-900 bg-[#0a0a0d] hover:border-neutral-800'
                }`}
              >
                {/* Tag */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-meecards-saffron animate-pulse' : 'text-neutral-400'}`} />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 font-mono font-bold uppercase tracking-widest border border-neutral-800/60 mt-1">
                    {type.subtitle}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-white font-heading">{type.title}</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {type.desc}
                </p>

                {/* Little indicator */}
                <span className="absolute bottom-4 right-6 text-[10px] text-neutral-500 font-mono tracking-widest opacity-80 select-none flex items-center gap-1">
                  {isSelected ? 'Active Details •' : 'Click to Reveal •'}
                </span>
              </div>
            );
          })}
        </div>

        {/* CLICK TO REVEAL CONTAINER (ANIMATED PLAN FEATURE PANEL) */}
        <div className="w-full bg-[#0a0a0d] border border-neutral-900 rounded-3xl p-6 md:p-8 text-left relative overflow-hidden transition-all duration-300">
          {/* Saffron indicator bar on top */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-[#FF6B00]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRevealedType}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest font-bold text-meecards-saffron font-mono bg-meecards-saffron/10 border border-meecards-saffron/30 px-3 py-1 rounded-full">
                  SaaS SPECIFICATION
                </span>
                <span className="text-xs text-neutral-500 font-semibold">
                  Card Type Index #{activeRevealedType + 1}
                </span>
              </div>

              <h4 className="text-xl font-bold font-heading text-white">
                Detailed feature list for {cardTypes[activeRevealedType].title}
              </h4>

              {/* Grid of Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {cardTypes[activeRevealedType].chips.map((chip, chipIdx) => (
                  <div
                    key={chipIdx}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-neutral-800 bg-[#07070a] text-xs font-semibold text-neutral-300 shadow-sm"
                  >
                    <Icons.CheckCircle2 className="w-3.5 h-3.5 text-meecards-teal shrink-0" />
                    <span>{chip}</span>
                  </div>
                ))}

                {/* Highlighted power feature saffron chip */}
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-meecards-saffron/30 bg-[#FF6B00]/10 text-xs font-bold text-meecards-saffron shadow-sm animate-pulse">
                  <Icons.Zap className="w-3.5 h-3.5 fill-meecards-saffron shrink-0" />
                  <span>Power: {cardTypes[activeRevealedType].highlight}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 5: CARD BUILDER STEP */}
      <section id="card-builder" className="py-24 px-4 bg-[#060608] border-t border-neutral-900 scroll-mt-16 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-meecards-saffron/5 rounded-full blur-[120px]" />
        
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#D4A017] font-bold font-mono">Interactive SaaS Terminal</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mt-1">
              Craft Your MeeCard Details
            </h2>
            <p className="text-neutral-400 text-sm mt-3">
              Type coordinates in real time. Validate checks light up green upon satisfying entries. Saffron preview template updates dynamically.
            </p>
          </div>

          <CardBuilder onComplete={handleCardBuilderSubmit} initialData={userData || undefined} />
        </div>
      </section>

      {/* DYNAMIC TEMPLATE GALLERY SYSTEM BLOCK */}
      <AnimatePresence>
        {isGalleryOpen && userData && (
          <section id="gallery-system" className="py-24 border-y border-neutral-900/80 bg-[#08080b] scroll-mt-16">
            <div className="container mx-auto px-4 space-y-12">
              <div className="border-b border-white/5 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-meecards-saffron font-bold font-mono">Dynamic Gallery Suite</span>
                    <h2 className="text-3xl font-extrabold font-heading text-white mt-0.5">
                      Explore 30 Premium Designs
                    </h2>
                    <p className="text-neutral-400 text-xs mt-1">
                      Choose from Free formats, lockable premium packages, trending lists or new layouts customized with your live data.
                    </p>
                  </div>
                  
                  {/* Selected templates micro dashboard */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-mono">Loaded Target:</span>
                    <span className="text-xs px-3 py-1 rounded bg-neutral-900 border border-neutral-800 font-bold font-mono text-meecards-teal">
                      {userData.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEARCH BAR & FILTERS ROW */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0a0a0d] border border-neutral-800/80 p-4 rounded-2xl">
                {/* Search query input */}
                <div className="relative w-full md:max-w-xs shrink-0">
                  <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, tags (bold, minimal)..."
                    className="w-full bg-[#060608] text-white py-2 px-9 rounded-lg text-xs border border-neutral-800 focus:outline-none focus:border-meecards-saffron"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition p-0.5"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter list pills */}
                <div className="flex flex-wrap gap-1.5 items-center w-full justify-end max-w-full overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All Designs' },
                    { id: 'free', label: 'Free Templates' },
                    { id: 'premium', label: 'Premium Styles' },
                    { id: 'trending', label: '🔥 Trending' },
                    { id: 'new', label: '✨ Exclusive' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFilter(f.id as any);
                        showToast(`Filtering designs: '${f.label}'`, 'success');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition cursor-pointer select-none ${
                        activeFilter === f.id
                          ? 'bg-meecards-saffron text-black font-extrabold shadow-md shadow-[#FF6B00]/10'
                          : 'bg-neutral-900 border border-neutral-800/60 text-neutral-400 hover:bg-neutral-850 hover:text-neutral-250 hover:border-neutral-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAVOURITES HORIZONTAL SHELF (localStorage backed) */}
              {favourites.length > 0 && (
                <div className="space-y-4 bg-gradient-to-r from-meecards-gold/5 via-transparent to-transparent p-5 rounded-3xl border border-meecards-gold/15">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4A017] font-mono flex items-center gap-1.5 leading-none">
                    <Icons.Heart className="w-4 h-4 fill-meecards-gold" />
                    My Saved Favourites Shelf ({favourites.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templatesList
                      .filter((tpl) => favourites.includes(tpl.id))
                      .map((tpl) => {
                        const style = getActiveCustomization(tpl);
                        const isFav = favourites.includes(tpl.id);
                        return (
                          <div
                            key={`fav-${tpl.id}`}
                            onClick={() => handleSelectTemplate(tpl)}
                            className={`group relative rounded-2xl h-[190px] aspect-[1.75/1] overflow-hidden shadow-xl border cursor-pointer transition duration-300 ${
                              selectedTemplate.id === tpl.id ? 'border-meecards-saffron scale-[1.02]' : 'border-neutral-900 hover:border-neutral-700'
                            }`}
                          >
                            <CardLayoutRenderer data={userData} customization={style} isMiniPreview={true} />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-center justify-center gap-2">
                              <span className="text-white font-bold text-xs font-heading">{tpl.name}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => toggleFavourite(tpl.id, e)}
                                  className="p-1 px-2.5 rounded bg-amber-500/10 border border-amber-500/35 text-meecards-gold font-semibold text-[10px] cursor-pointer"
                                >
                                  Saved ♥
                                </button>
                                <span className="text-[10px] uppercase font-bold text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded">
                                  {tpl.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* SKELETON LOADER STATE / FULL LIST GRID */}
              {loadingTemplates ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-[#0a0a0d] border border-neutral-900 rounded-2xl h-[190px] w-full relative overflow-hidden flex flex-col justify-between p-5 animate-pulse">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-neutral-800 rounded" />
                          <div className="w-16 h-3 bg-neutral-800 rounded" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-neutral-850" />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1.5">
                          <div className="w-32 h-3 bg-neutral-800 rounded" />
                          <div className="w-28 h-3 bg-neutral-800 rounded" />
                        </div>
                        <div className="w-12 h-5 bg-neutral-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                  {filteredTemplates.map((tpl) => {
                    const style = getActiveCustomization(tpl);
                    const isFav = favourites.includes(tpl.id);
                    const isSelected = selectedTemplate.id === tpl.id;
                    const isPremium = tpl.category === 'premium';

                    return (
                      <div
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl)}
                        className={`group relative rounded-2xl overflow-hidden aspect-[1.75/1] shadow-2xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-meecards-saffron ring-1 ring-meecards-saffron/40 scale-[1.02] shadow-saffron/10'
                            : 'border-neutral-950 hover:border-neutral-800 hover:-translate-y-1'
                        }`}
                      >
                        {/* Interactive dynamic card renderer with live typing data */}
                        <CardLayoutRenderer data={userData} customization={style} isMiniPreview={true} />

                        {/* Top banner labels (Trending, Lock index) */}
                        {isPremium && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-meecards-gold/30 text-[#D4A017] text-[9px] font-bold uppercase tracking-widest font-mono flex items-center gap-1">
                            <Icons.Lock className="w-2.5 h-2.5" />
                            <span>Gold Access</span>
                          </div>
                        )}

                        {tpl.trending && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-meecards-saffron/90 text-black text-[9px] font-bold uppercase tracking-widest font-mono shadow">
                            Trending 🔥
                          </div>
                        )}

                        {/* Hover reveal overlays containing selection handles */}
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                          <h4 className="text-white font-bold text-sm tracking-tight font-heading">{tpl.name}</h4>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTemplate(tpl);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition select-none cursor-pointer ${
                                isPremium
                                  ? 'bg-meecards-gold hover:bg-amber-500 text-black'
                                  : 'bg-[#FF6B00] hover:bg-orange-500 text-white'
                              }`}
                            >
                              {isPremium ? 'Select Premium' : 'Select Design'}
                            </button>
                            <button
                              onClick={(e) => toggleFavourite(tpl.id, e)}
                              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 active:scale-90 transition flex items-center justify-center border border-white/15 text-white cursor-pointer"
                            >
                              <Icons.Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 pt-1.5">
                            {tpl.tags.map((tag) => (
                              <span key={tag} className="text-[9px] uppercase font-mono tracking-wider font-bold text-neutral-500">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SEARCH FALLBACK EMPTY STATE */}
              {filteredTemplates.length === 0 && !loadingTemplates && (
                <div className="text-center py-12 bg-neutral-950 p-6 rounded-3xl border border-neutral-900 border-dashed">
                  <Icons.SearchCode className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <span className="block font-bold text-white text-lg">No designs matched query</span>
                  <p className="text-neutral-500 text-xs mt-1 max-w-sm mx-auto">
                    Try adjusting search query filters or explore standard tags like 'luxury', 'vibrant' or 'noir'
                  </p>
                </div>
              )}

              {/* SECTION STICKY FOOTER MODULE CONTROLS BAR FOR SELECTED TEMPLATE */}
              <div className="bg-[#0c0c10] border border-meecards-saffron/20 shadow-xl shadow-saffron/[0.01] p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center shrink-0">
                    <Icons.Grid className="w-5 h-5 text-meecards-saffron" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-heading text-sm leading-tight">
                      Selected: {selectedTemplate.name}
                    </h4>
                    <p className="text-neutral-400 text-xs mt-0.5 leading-none">
                      Category type:{' '}
                      <span className="font-mono text-meecards-gold capitalize font-bold">
                        {selectedTemplate.category}
                      </span>{' '}
                      • Layout:{' '}
                      <span className="font-mono text-neutral-400 font-bold uppercase text-[10px]">
                        {getActiveCustomization(selectedTemplate).layout}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => {
                      setIsEditorOpen(true);
                      showToast(`Opened editor for style "${selectedTemplate.name}"`, 'success');
                    }}
                    className="px-5 py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <Icons.SlidersHorizontal className="w-4 h-4 text-meecards-saffron" />
                    <span>Edit Styling Card</span>
                  </button>

                  <button
                    onClick={triggerCanvasPNGDownload}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-meecards-saffron to-amber-500 text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer shadow-lg shadow-[#FF6B00]/10"
                  >
                    <Icons.Download className="w-4 h-4" />
                    <span>Download Canvas PNG</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* SECTION 6: CORE VALUE FEATURES LIST */}
      <section id="features" className="py-24 px-4 scroll-mt-16 bg-[#040406]">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-meecards-saffron font-bold font-mono">Modern Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mt-1">
              Built for Limitless Sharing
            </h2>
            <p className="text-neutral-400 text-sm mt-3">
              MeeCards provides features that merge solid steel physics with dynamic dynamic cloud redirection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#0a0a0d] border border-neutral-900/60 rounded-3xl p-6 hover:border-neutral-850 duration-300 transition">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <Icons.Nfc className="w-5 h-5 text-meecards-saffron" />
              </div>
              <h3 className="font-bold text-base text-white font-heading">NFC Physical Taps</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Connect your business card profile with standard ISO/IEC NFC chips. Tap any mobile to instantly import your profile coordinates.
              </p>
            </div>

            <div className="bg-[#0a0a0d] border border-neutral-900/60 rounded-3xl p-6 hover:border-neutral-850 duration-300 transition">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <Icons.QrCode className="w-5 h-5 text-meecards-teal" />
              </div>
              <h3 className="font-bold text-base text-white font-heading">Pixel QR Vectors</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Render highly sophisticated custom QR codes with adjustable layouts and accent colors, fully optimized for fast scanning.
              </p>
            </div>

            <div className="bg-[#0a0a0d] border border-neutral-900/60 rounded-3xl p-6 hover:border-neutral-850 duration-300 transition">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <Icons.Sliders className="w-5 h-5 text-meecards-gold" />
              </div>
              <h3 className="font-bold text-base text-white font-heading">Studio Customization</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Tune corners radius, shadows, borders, select from 10 coded structures, 11 repeating SVG pattern layers and 7 font sets.
              </p>
            </div>

            <div className="bg-[#0a0a0d] border border-neutral-900/60 rounded-3xl p-6 hover:border-neutral-850 duration-300 transition">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center mb-4">
                <Icons.Globe className="w-5 h-5 text-neutral-300" />
              </div>
              <h3 className="font-bold text-base text-white font-heading">No App Required</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Save clients memory. Your business card renders completely in standard modern web browsers on Chrome, Safari and Firefox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 & 8: REVIEWS SECTION & FAQ ACCORDION */}
      <section className="py-24 border-t border-neutral-950 bg-[#060608]/50">
        <TrustAndFaq />
      </section>

      {/* SECTION 9: FOOTER */}
      <footer className="bg-[#050507] border-t border-neutral-950 py-12 px-4 select-none">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Brand logo details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-6 h-6 rounded bg-[#FF6B00] flex items-center justify-center">
                <span className="font-black text-xs text-black font-heading">M</span>
              </div>
              <span className="font-extrabold text-white font-heading text-lg">MeeCards</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              Your identity instantly shared with premium customized NFC smart digital business card SaaS web apps.
            </p>
          </div>

          {/* Micro fine print links */}
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-xs text-neutral-450 uppercase font-mono font-bold">
            <a href="#" className="hover:text-meecards-saffron transition">Back to Top</a>
            <a href="#card-types" className="hover:text-meecards-saffron transition">Pricing Models</a>
            <a href="#card-builder" className="hover:text-meecards-saffron transition">Customize form</a>
            <a href="#features" className="hover:text-meecards-saffron transition">API Integrations</a>
          </div>

          {/* Copyright claims */}
          <div className="flex flex-col items-center md:items-end text-neutral-600 gap-1 text-[11px] font-mono font-semibold">
            <p>© 2026 meecards.in. All Rights Reserved.</p>
            <p className="text-[10px] text-neutral-700">GSTIN Registered SaaS Company • MADE WITH LOVE IN INDIA</p>
          </div>
        </div>
      </footer>

      {/* CARD EDITOR DRAWER OVERLAYS PANEL */}
      {userData && (
        <CardEditorDrawer
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          data={userData}
          initialCustomization={getActiveCustomization(selectedTemplate)}
          onApply={handleEditorApply}
        />
      )}

      {/* PAYMENT MODAL (3 PLANS Checkout Dialog) */}
      <PaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          // If closing and selected template was premium with no package, reset to saffron standard
          if (selectedTemplate.category === 'premium') {
            setSelectedTemplate(CARD_TEMPLATES_DATA[0]);
          }
        }}
        onSelectPlan={handlePlanCheckoutSelect}
        selectedTemplateName={selectedTemplate.name}
      />

      {/* CANVAS DRAWING PROGRESS MODAL OVERLAYS */}
      <AnimatePresence>
        {downloadProgress !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0d] border border-neutral-800 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-full border border-meecards-saffron/30 bg-[#FF6B00]/5 flex items-center justify-center mx-auto text-meecards-saffron animate-spin">
                <Icons.Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold font-heading text-lg">Compiling Card Vector Canvas...</h4>
                <p className="text-xs text-neutral-500 mt-1">Please hold. High quality raster 700x400 PNG generating.</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-meecards-saffron to-amber-500 transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                  <span>Progress Ratio</span>
                  <span>{downloadProgress}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST ALERTS MODULE POPUP */}
      <AnimatePresence>
        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
