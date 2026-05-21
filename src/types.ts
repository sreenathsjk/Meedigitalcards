/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserCardData {
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  whatsapp: string;
  photoUrl: string; // Base64 or standard asset
}

export type CardLayoutType =
  | 'standard'
  | 'compact'
  | 'wide-avatar'
  | 'minimal'
  | 'bold-name'
  | 'centered'
  | 'split'
  | 'pill-contacts'
  | 'icon-row'
  | 'sidebar';

export interface CardCustomization {
  backgroundType: 'solid' | 'gradient';
  bgSolid: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  bgGradientAngle: number;
  bgPresetIndex: number;
  fontFamily: string; // 7 options
  nameSize: number; // slider
  bodySize: number; // slider
  textColor: string;
  accentColor: string;
  accentPresetIndex: number;
  cornerRadius: number; // slider (0-24px)
  svgPattern: string; // 'none' or 1 to 10
  showShadow: boolean;
  showBorder: boolean;
  layout: CardLayoutType;
}

export interface CardTemplate {
  id: string;
  name: string;
  category: 'free' | 'premium';
  trending: boolean;
  popularity: number;
  tags: string[];
  style: Partial<CardCustomization>;
}

export interface PlanType {
  id: 'free' | 'pro' | 'nfc';
  name: string;
  price: string;
  description: string;
  features: string[];
}
