/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserCardData, CardCustomization } from '../types';
import { CardLayoutRenderer } from './CardLayoutRenderer';
import { Upload, ArrowRight, Sparkles, Check, AlertCircle } from 'lucide-react';

interface CardBuilderProps {
  onComplete: (data: UserCardData) => void;
  initialData?: UserCardData;
}

export function CardBuilder({ onComplete, initialData }: CardBuilderProps) {
  const [formData, setFormData] = useState<UserCardData>(
    initialData || {
      name: '',
      role: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      whatsapp: '',
      photoUrl: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.photoUrl) {
      setPhotoPreview(formData.photoUrl);
    }
  }, [formData.photoUrl]);

  // Real-time Validation Engine
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'role':
        if (!value.trim()) return 'Professional role is required';
        if (value.trim().length < 2) return 'Role must be at least 2 characters';
        return '';
      case 'company':
        if (!value.trim()) return 'Company or label is required';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const numClean = value.replace(/\s+/g, '');
        if (numClean.length < 8) return 'Please enter a valid phone number';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'website':
        if (value.trim() && !value.startsWith('http://') && !value.startsWith('https://') && !value.includes('.')) {
          return 'Enter valid URL prefix (e.g. meecards.in)';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Process File Base64 Convert
  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setFormData((prev) => ({ ...prev, photoUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Determine Overall form validity
  const requiredFields: (keyof UserCardData)[] = ['name', 'role', 'company', 'phone', 'email'];
  const isFormValid =
    requiredFields.every((f) => formData[f].trim() !== '') &&
    Object.keys(errors).every((key) => !errors[key]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check
    const finalErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) finalErrors[field] = err;
    });

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      // Touch all
      const touchedAll: Record<string, boolean> = {};
      requiredFields.forEach((f) => { touchedAll[f] = true; });
      setTouched(touchedAll);
      return;
    }

    onComplete(formData);
  };

  // Basic styling customized defaults for builder mini preview
  const defaultCustomization: CardCustomization = {
    backgroundType: 'gradient',
    bgSolid: '#060608',
    bgGradientStart: '#FF6B00',
    bgGradientEnd: '#060608',
    bgGradientAngle: 135,
    bgPresetIndex: 0,
    fontFamily: 'Syne',
    nameSize: 24,
    bodySize: 13,
    textColor: '#FFFFFF',
    accentColor: '#FF6B00',
    accentPresetIndex: 0,
    cornerRadius: 16,
    svgPattern: '3',
    showShadow: true,
    showBorder: true,
    layout: 'standard',
  };

  // Helper classes for field borders based on live typing validations
  const getFieldClass = (fieldName: string) => {
    const base = "w-full bg-[#0a0a0d] text-white py-3 px-4 rounded-xl text-sm border focus:outline-none transition duration-300";
    if (!touched[fieldName]) return `${base} border-neutral-800 focus:border-meecards-saffron focus:ring-1 focus:ring-meecards-saffron/10`;
    if (errors[fieldName]) return `${base} border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/10`;
    return `${base} border-meecards-teal focus:border-meecards-teal focus:ring-1 focus:ring-meecards-teal/10 bg-meecards-teal/5`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Live mini card preview */}
      <div className="lg:col-span-5 flex flex-col items-center gap-4 lg:sticky lg:top-24">
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4A017] mb-1">
          Live Card Preview
        </h3>
        
        {/* Enclosing scaled container for real-time mini-rendering */}
        <div className="w-full max-w-[380px] h-[220px] rounded-2xl relative shadow-2xl overflow-hidden aspect-[1.75/1]">
          <CardLayoutRenderer
            data={{
              name: formData.name || 'Your Full Name',
              role: formData.role || 'Professional Role',
              company: formData.company || 'Company Name Lmt',
              phone: formData.phone || '+91 98765 43210',
              email: formData.email || 'you@meecards.in',
              website: formData.website || 'meecards.in',
              whatsapp: formData.whatsapp || '919876543210',
              photoUrl: photoPreview,
            }}
            customization={defaultCustomization}
            isMiniPreview={true}
          />
        </div>

        <p className="text-xs text-neutral-500 italic max-w-xs text-center leading-relaxed">
          The Saffron Glaze free template is loaded by default. You can unlock 30 other luxury styles on the next step.
        </p>
      </div>

      {/* RIGHT: Input Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[#0a0a0d] border border-neutral-800/80 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-2">
            Create Your MeeCard
            <span className="text-xs px-2 py-0.5 rounded-full bg-meecards-saffron/10 text-meecards-saffron border border-meecards-saffron/20 uppercase tracking-widest font-mono font-bold">Free</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Fill in your personal identifiers. Highlighted fields are required.
          </p>
        </div>

        {/* Drag Drop Photo Upload Section */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
            Profile Photo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerUploadClick}
            className={`group border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition duration-300 ${
              dragActive
                ? 'border-meecards-saffron bg-[#FF6B00]/5'
                : photoPreview
                ? 'border-meecards-teal/50 bg-meecards-teal/5'
                : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/40'
            }`}
          >
            {photoPreview ? (
              <div className="flex items-center gap-3 w-full justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border border-meecards-teal"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">Custom Photo Loaded</span>
                    <span className="text-[10px] text-neutral-500">Click or drag to swap image</span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-meecards-teal/20 border border-meecards-teal/40 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-meecards-teal" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800 transition duration-300 group-hover:scale-105">
                  <Upload className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                </div>
                <p className="text-xs text-center text-neutral-400">
                  <span className="font-semibold text-white">Upload avatar photo</span> or drag & drop files
                </p>
                <span className="text-[10px] text-neutral-600">Supports PNG, JPG (Max 5MB)</span>
              </>
            )}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold tracking-widest text-[#D4A017] flex items-center gap-1">
              Full Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Saffron Patil"
              className={getFieldClass('name')}
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
              Professional Role*
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Lead UI Designer"
              className={getFieldClass('role')}
            />
            {touched.role && errors.role && (
              <p className="text-red-500 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.role}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
              Company / Label*
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. MeeCards Media"
              className={getFieldClass('company')}
            />
            {touched.company && errors.company && (
              <p className="text-red-500 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.company}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
              Phone Number*
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. +91 98765 43210"
              className={getFieldClass('phone')}
            />
            {touched.phone && errors.phone && (
              <p className="text-red-500 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
              Email Address*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. saffron@meecards.in"
              className={getFieldClass('email')}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
              Website URL (Optional)
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. www.meecards.in"
              className={getFieldClass('website')}
            />
            {touched.website && errors.website && (
              <p className="text-red-500 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.website}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs uppercase font-bold tracking-widest text-neutral-400">
            WhatsApp Contact (Optional)
          </label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="e.g. 919876543210 (Country code + number)"
            className={getFieldClass('whatsapp')}
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 select-none cursor-pointer ${
            isFormValid
              ? 'bg-gradient-to-r from-meecards-saffron to-amber-500 hover:shadow-lg hover:shadow-meecards-saffron/15 text-black hover:-translate-y-0.5 active:translate-y-0 active:scale-98'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <span>See My Cards</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
