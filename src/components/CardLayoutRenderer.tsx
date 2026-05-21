/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserCardData, CardCustomization } from '../types';
import { getSVGPattern } from './SVGPatterns';
import { NFCChip } from './NFCChip';
import { QRCodeIcon } from './QRCodeIcon';
import * as Icons from 'lucide-react';

interface CardLayoutRendererProps {
  data: UserCardData;
  customization: CardCustomization;
  isMiniPreview?: boolean;
}

export function CardLayoutRenderer({ data, customization, isMiniPreview = false }: CardLayoutRendererProps) {
  const {
    backgroundType,
    bgSolid,
    bgGradientStart,
    bgGradientEnd,
    bgGradientAngle,
    fontFamily,
    nameSize,
    bodySize,
    textColor,
    accentColor,
    cornerRadius,
    svgPattern,
    showShadow,
    showBorder,
    layout,
  } = customization;

  // Set up inline styles
  const cardStyle: React.CSSProperties = {
    fontFamily: fontFamily || 'Instrument Sans',
    borderRadius: `${isMiniPreview ? cornerRadius / 2 : cornerRadius}px`,
    color: textColor,
    background: backgroundType === 'solid' ? bgSolid : `linear-gradient(${bgGradientAngle}deg, ${bgGradientStart}, ${bgGradientEnd})`,
    borderColor: showBorder ? accentColor : 'transparent',
    borderWidth: showBorder ? (isMiniPreview ? '1px' : '2px') : '0px',
    boxShadow: showShadow ? (isMiniPreview ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : '0 20px 25px -5px rgb(0 0 0 / 0.25), 0 8px 10px -6px rgb(0 0 0 / 0.25)') : 'none',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: isMiniPreview ? `${nameSize * 0.55}px` : `${nameSize}px`,
    color: accentColor,
    fontFamily: fontFamily.includes('Syne') ? 'Syne' : 'inherit',
    fontWeight: 700,
  };

  const bodyStyleText: React.CSSProperties = {
    fontSize: isMiniPreview ? `${bodySize * 0.6}px` : `${bodySize}px`,
  };

  // Safe Fallback avatar initial generator
  const getInitials = (nameStr: string) => {
    return nameStr
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'MC';
  };

  // Reusable avatar component
  const Avatar = ({ sizeClass = "w-16 h-16 sm:w-20 sm:h-20" }: { sizeClass?: string }) => (
    <div className={`relative shrink-0 rounded-full overflow-hidden border-2 shadow-sm ${sizeClass}`} style={{ borderColor: accentColor }}>
      {data.photoUrl ? (
        <img
          src={data.photoUrl}
          alt={data.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-bold text-lg select-none" style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}>
          {getInitials(data.name)}
        </div>
      )}
    </div>
  );

  // Reusable mini badge action button
  const WhatsAppPill = () => (
    data.whatsapp ? (
      <a
        href={`https://wa.me/${data.whatsapp}`}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold transition px-2.5 py-1 rounded-full shadow-sm text-xs select-none cursor-pointer"
      >
        <Icons.MessageSquarePlus className={isMiniPreview ? "w-3 h-3" : "w-3.5 h-3.5"} />
        {!isMiniPreview && <span>Chat</span>}
      </a>
    ) : null
  );

  // Reusable tiny brand tag
  const BrandTag = () => (
    <div className="absolute right-3 bottom-2 text-[10px] uppercase font-bold tracking-widest opacity-40 select-none flex items-center gap-1 font-mono">
      <span>meecards.in</span>
    </div>
  );

  // Common Contact Elements mapping
  const contactRows = [
    { icon: Icons.Phone, value: data.phone, label: 'Phone' },
    { icon: Icons.Mail, value: data.email, label: 'Email' },
    { icon: Icons.Globe, value: data.website, label: 'Website' },
  ].filter(item => item.value);

  // 10 Distinct Layout Renderers
  const renderLayoutContent = () => {
    switch (layout) {
      case 'compact':
        return (
          <div className="flex flex-col h-full justify-between p-3 sm:p-5 relative overflow-hidden">
            <div className="flex gap-3 items-center">
              <Avatar sizeClass="w-10 h-10 sm:w-12 sm:h-12" />
              <div className="min-w-0">
                <h3 className="truncate leading-tight font-heading" style={nameStyle}>{data.name}</h3>
                <p className="text-xs opacity-80 truncate" style={bodyStyleText}>{data.role}</p>
                <p className="text-[10px] opacity-60 truncate font-mono">{data.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="space-y-1.5 text-[11px]">
                {contactRows.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 opacity-90 truncate">
                    <row.icon strokeWidth={2} style={{ color: accentColor }} className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-end justify-end gap-2">
                <NFCChip />
                <QRCodeIcon size={36} color={accentColor} />
              </div>
            </div>
            <WhatsAppPill />
            <BrandTag />
          </div>
        );

      case 'wide-avatar':
        return (
          <div className="flex flex-col items-center justify-between text-center h-full p-4 sm:p-6 relative overflow-hidden">
            <div className="w-full flex justify-between items-start">
              <NFCChip />
              <QRCodeIcon size={34} color={accentColor} />
            </div>

            <div className="flex flex-col items-center -mt-2">
              <Avatar sizeClass="w-16 h-16 sm:w-20 sm:h-20 mb-2" />
              <h3 className="font-heading leading-tight truncate max-w-[280px]" style={nameStyle}>{data.name}</h3>
              <p className="text-xs font-semibold opacity-90 truncate max-w-[280px]" style={bodyStyleText}>{data.role}</p>
              <p className="text-[11px] opacity-65 truncate max-w-[260px] font-mono">{data.company}</p>
            </div>

            <div className="flex gap-4 text-xs opacity-90 my-1 justify-center max-w-full overflow-hidden">
              {contactRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-1 text-[11px] shrink-0">
                  <row.icon strokeWidth={2.5} style={{ color: accentColor }} className="w-3.5 h-3.5" />
                  {!isMiniPreview && <span className="opacity-90 max-w-[64px] truncate">{row.value}</span>}
                </div>
              ))}
            </div>

            <div className="flex w-full justify-between items-center mt-1">
              <WhatsAppPill />
              <span className="text-[9px] uppercase tracking-widest opacity-35 font-mono">premium layout</span>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="flex flex-col h-full justify-between p-4 sm:p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h3 className="leading-tight truncate" style={nameStyle}>{data.name}</h3>
                <p className="text-xs opacity-70 tracking-wider uppercase font-mono mt-0.5">{data.role}</p>
                <p className="text-xs opacity-50 truncate">{data.company}</p>
              </div>
              <NFCChip />
            </div>

            <div className="flex justify-between items-end gap-4 mt-4">
              <div className="space-y-1.5 text-[11px] max-w-[170px] truncate">
                {contactRows.map((row, idx) => (
                  <p key={idx} className="opacity-75 truncate">
                    <span className="font-semibold" style={{ color: accentColor }}>{row.label[0]}:</span> {row.value}
                  </p>
                ))}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <QRCodeIcon size={42} color={accentColor} />
                <WhatsAppPill />
              </div>
            </div>
            <BrandTag />
          </div>
        );

      case 'bold-name':
        return (
          <div className="flex flex-col h-full justify-between p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute right-3 top-3">
              <Avatar sizeClass="w-12 h-12" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-60 font-mono mb-1">{data.company || 'MeeCard Professional'}</p>
              {/* Force extremely large style */}
              <h3 className="leading-none tracking-tight font-heading mb-1" style={{ ...nameStyle, fontSize: isMiniPreview ? '22px' : '32px' }}>
                {data.name}
              </h3>
              <p className="text-xs font-medium opacity-80" style={bodyStyleText}>{data.role}</p>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div className="space-y-1 text-xs opacity-90 truncate max-w-[200px]">
                {contactRows.map((row, idx) => (
                  <div key={idx} className="flex gap-1.5 items-center truncate">
                    <row.icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    <span className="truncate text-[11px]">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <QRCodeIcon size={38} color={accentColor} />
                <NFCChip />
              </div>
            </div>
            <BrandTag />
          </div>
        );

      case 'centered':
        return (
          <div className="flex flex-col items-center justify-between text-center h-full p-4 sm:p-5 relative overflow-hidden">
            <div></div>

            <div className="flex flex-col items-center gap-1.5">
              <Avatar sizeClass="w-14 h-14 sm:w-16 sm:h-16" />
              <h3 className="leading-tight font-heading" style={nameStyle}>{data.name}</h3>
              <p className="text-xs font-semibold opacity-90" style={bodyStyleText}>{data.role}</p>
              <p className="text-[10px] tracking-wide opacity-50 uppercase font-mono">{data.company}</p>
            </div>

            <div className="flex flex-col items-center gap-1 text-[11px] max-w-full overflow-hidden opacity-90">
              {contactRows.slice(0, 2).map((row, idx) => (
                <div key={idx} className="flex items-center gap-1 justify-center truncate">
                  <row.icon className="w-3 h-3" style={{ color: accentColor }} />
                  <span className="truncate max-w-[240px]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex w-full justify-between items-end">
              <NFCChip />
              <WhatsAppPill />
              <QRCodeIcon size={32} color={accentColor} />
            </div>
            <BrandTag />
          </div>
        );

      case 'split':
        return (
          <div className="grid grid-cols-[1.1fr_1fr] h-full relative overflow-hidden">
            {/* Left Col */}
            <div className="p-4 flex flex-col justify-between" style={{ backgroundColor: `${accentColor}10` }}>
              <div className="min-w-0">
                <Avatar sizeClass="w-10 h-10 mb-2" />
                <h3 className="leading-tight font-heading truncate" style={nameStyle}>{data.name}</h3>
                <p className="text-[11px] opacity-90 font-medium truncate" style={bodyStyleText}>{data.role}</p>
                <p className="text-[9px] opacity-55 truncate font-mono uppercase">{data.company}</p>
              </div>
              <WhatsAppPill />
            </div>

            {/* Right Col */}
            <div className="p-4 flex flex-col justify-between items-end text-right border-l" style={{ borderColor: `${textColor}1A` }}>
              <div className="flex flex-col items-end gap-1.5">
                <NFCChip />
              </div>

              <div className="space-y-2 mt-4 text-[10px] opacity-90 truncate max-w-full">
                {contactRows.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 justify-end truncate">
                    <span className="truncate max-w-[90px]">{row.value}</span>
                    <row.icon className="w-3 h-3 shrink-0" style={{ color: accentColor }} />
                  </div>
                ))}
              </div>

              <QRCodeIcon size={34} color={accentColor} />
            </div>
            <BrandTag />
          </div>
        );

      case 'pill-contacts':
        return (
          <div className="flex flex-col h-full justify-between p-4 sm:p-5 relative overflow-hidden">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <h3 className="leading-tight font-heading truncate" style={nameStyle}>{data.name}</h3>
                <p className="text-xs opacity-80 italic" style={bodyStyleText}>{data.role}</p>
                <p className="text-[10px] opacity-60 font-mono">{data.company}</p>
              </div>
              <Avatar sizeClass="w-11 h-11" />
            </div>

            <div className="flex flex-wrap gap-1.5 my-2">
              {contactRows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border shrink-0 max-w-full truncate"
                  style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}08` }}
                >
                  <row.icon className="w-3 h-3 shrink-0" style={{ color: accentColor }} />
                  <span className="truncate max-w-[124px]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <NFCChip />
                <WhatsAppPill />
              </div>
              <QRCodeIcon size={34} color={accentColor} />
            </div>
            <BrandTag />
          </div>
        );

      case 'icon-row':
        return (
          <div className="flex flex-col h-full justify-between p-4 sm:p-5 relative overflow-hidden">
            <div className="flex justify-between items-start w-full">
              <div className="flex gap-3 items-center min-w-0">
                <Avatar sizeClass="w-12 h-12" />
                <div className="min-w-0">
                  <h3 className="leading-tight truncate font-heading" style={nameStyle}>{data.name}</h3>
                  <p className="text-xs opacity-75 truncate" style={bodyStyleText}>{data.role} @ {data.company || 'Independent'}</p>
                </div>
              </div>
              <QRCodeIcon size={34} color={accentColor} />
            </div>

            {/* Icons list row instead of standard text rows */}
            <div className="flex gap-2 justify-center my-3 bg-black/10 p-2 rounded-lg">
              {contactRows.map((row, idx) => (
                <div
                  key={idx}
                  title={row.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center border transition transform hover:scale-110 active:scale-95 cursor-pointer"
                  style={{ borderColor: `${accentColor}60`, backgroundColor: `${accentColor}12`, color: accentColor }}
                >
                  <row.icon className="w-4 h-4" />
                </div>
              ))}
              {data.whatsapp && (
                <a
                  href={`https://wa.me/${data.whatsapp}`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-110 active:scale-95 transition cursor-pointer"
                >
                  <Icons.MessageSquare className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="flex justify-between items-center w-full">
              <NFCChip />
              <span className="text-[10px] tracking-wider opacity-40 font-mono">Digital NFC MeeCard</span>
            </div>
          </div>
        );

      case 'sidebar':
        return (
          <div className="flex h-full relative overflow-hidden">
            {/* Sidebar Line Block */}
            <div className="w-14 shrink-0 flex flex-col justify-between items-center py-4 border-r" style={{ borderColor: `${textColor}1A`, backgroundColor: `${accentColor}06` }}>
              <div className="w-8 h-8 rounded bg-white/5 border border-dashed flex items-center justify-center font-bold text-xs" style={{ borderColor: accentColor, color: accentColor }}>
                {getInitials(data.name)}
              </div>
              <NFCChip />
              <QRCodeIcon size={26} color={accentColor} />
            </div>

            {/* Main Details Panel */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="leading-tight truncate font-heading" style={nameStyle}>{data.name}</h3>
                <p className="text-xs font-semibold opacity-90 truncate mt-0.5" style={bodyStyleText}>{data.role}</p>
                <p className="text-[10px] opacity-55 truncate font-mono">{data.company || '(Freelancer)'}</p>
              </div>

              <div className="space-y-1 my-2">
                {contactRows.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center text-[11px] opacity-80 truncate">
                    <row.icon className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                    <span className="truncate">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <WhatsAppPill />
                <span className="text-[9px] uppercase tracking-wider opacity-35 font-mono">MeeCard S6</span>
              </div>
            </div>
            <BrandTag />
          </div>
        );

      default: // standard layout
        return (
          <div className="flex flex-col h-full justify-between p-4 sm:p-5 relative overflow-hidden">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h3 className="leading-tight truncate font-heading" style={nameStyle}>{data.name}</h3>
                <p className="text-xs opacity-90 font-medium truncate" style={bodyStyleText}>{data.role}</p>
                <p className="text-[10px] opacity-55 truncate font-mono uppercase tracking-wider">{data.company}</p>
              </div>
              <Avatar sizeClass="w-12 h-12" />
            </div>

            <div className="flex justify-between items-end mt-4">
              <div className="space-y-1 text-xs opacity-90 truncate max-w-[200px]">
                {contactRows.map((row, idx) => (
                  <div key={idx} className="flex gap-1.5 items-center truncate text-[11px]">
                    <row.icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    <span className="truncate">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex gap-1.5">
                  <NFCChip />
                  <QRCodeIcon size={34} color={accentColor} />
                </div>
                <WhatsAppPill />
              </div>
            </div>
            <BrandTag />
          </div>
        );
    }
  };

  return (
    <div
      id={isMiniPreview ? "mee-mini-card" : `mee-card-${customization.layout}`}
      className="relative w-full h-full select-none overflow-hidden border box-border transition-all duration-300"
      style={cardStyle}
    >
      {/* Background SVG vector texture */}
      {getSVGPattern(svgPattern)}
      {renderLayoutContent()}
    </div>
  );
}
