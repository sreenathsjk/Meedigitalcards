/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserCardData, CardCustomization } from '../types';

// Helper to load image asynchronously with fallback handling
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

export async function renderCardToPNG(
  data: UserCardData,
  customization: CardCustomization,
  onProgress: (progress: number) => void
): Promise<string> {
  // 1. Create Canvas with exactly 700x400px
  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not start 2D canvas context');
  }

  onProgress(10);

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
    layout,
  } = customization;

  // 2. Draw Background (Solid or Gradient)
  onProgress(20);
  ctx.save();
  
  // Custom rounded clipping path according to card corner radius (scaled up from ~16px to fits 700x400 card)
  const renderRadius = cornerRadius * (700 / 350); // Scale up appropriately since original card size was approx 350 width
  ctx.beginPath();
  ctx.moveTo(renderRadius, 0);
  ctx.lineTo(700 - renderRadius, 0);
  ctx.quadraticCurveTo(700, 0, 700, renderRadius);
  ctx.lineTo(700, 400 - renderRadius);
  ctx.quadraticCurveTo(700, 400, 700 - renderRadius, 400);
  ctx.lineTo(renderRadius, 400);
  ctx.quadraticCurveTo(0, 400, 0, 400 - renderRadius);
  ctx.lineTo(0, renderRadius);
  ctx.quadraticCurveTo(0, 0, renderRadius, 0);
  ctx.closePath();
  ctx.clip();

  if (backgroundType === 'solid') {
    ctx.fillStyle = bgSolid;
    ctx.fillRect(0, 0, 700, 400);
  } else {
    // Convert angle to gradient coordinate vectors
    const angleRad = (bgGradientAngle * Math.PI) / 180;
    const x1 = 350 - Math.cos(angleRad) * 350;
    const y1 = 200 - Math.sin(angleRad) * 200;
    const x2 = 350 + Math.cos(angleRad) * 350;
    const y2 = 200 + Math.sin(angleRad) * 200;
    
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, bgGradientStart);
    grad.addColorStop(1, bgGradientEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 700, 400);
  }

  // Draw Card Inner Border if enabled
  if (customization.showBorder) {
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 694, 394);
  }

  onProgress(40);

  // 3. Draw Background Patterns in low opacity (similar to the CSS SVG patterns)
  ctx.strokeStyle = accentColor;
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.08;

  if (svgPattern === '1') { // Dots
    for (let x = 10; x < 700; x += 25) {
      for (let y = 10; y < 400; y += 25) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (svgPattern === '2') { // Diagonal grid
    ctx.lineWidth = 1;
    for (let i = -700; i < 700; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 400, 400);
      ctx.stroke();
    }
  } else if (svgPattern === '3' || svgPattern === '4') { // Waves / Contours
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.bezierCurveTo(200, 50, 400, 300, 700, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.bezierCurveTo(150, 350, 500, 50, 700, 300);
    ctx.stroke();
  } else if (svgPattern === '5') { // Grid
    ctx.lineWidth = 0.8;
    for (let x = 0; x < 700; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }
    for (let y = 0; y < 400; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(700, y);
      ctx.stroke();
    }
  } else {
    // Draw some default geometric accent lines on corners for extra design quality
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(600, 0);
    ctx.lineTo(700, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(620, 0);
    ctx.lineTo(700, 80);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
  ctx.restore();

  onProgress(60);

  // 4. Draw Avatar block
  let avatarLoaded = false;
  let avatarImg: HTMLImageElement | null = null;
  if (data.photoUrl) {
    try {
      avatarImg = await loadImage(data.photoUrl);
      avatarLoaded = true;
    } catch (e) {
      console.warn("Could not render custom user photo to PNG, falling back to dynamic initials", e);
    }
  }

  // Draw Avatar helpers
  const drawAvatarAt = (cx: number, cy: number, r: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    
    // Border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.clip();
    if (avatarLoaded && avatarImg) {
      ctx.drawImage(avatarImg, cx - r, cy - r, r * 2, r * 2);
    } else {
      // Initials block background
      ctx.fillStyle = `${accentColor}1D`;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      
      // Text initials
      ctx.fillStyle = accentColor;
      ctx.font = `bold ${Math.floor(r * 0.9)}px ${fontFamily || 'Helvetica'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initials = data.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'MC';
      ctx.fillText(initials, cx, cy);
    }
    ctx.restore();
  };

  onProgress(70);

  // 5. Draw modern NFC Chip simulation
  const drawNFCChipAt = (tx: number, ty: number) => {
    ctx.save();
    // Body gradient
    const nfcGrad = ctx.createLinearGradient(tx, ty, tx + 60, ty + 46);
    nfcGrad.addColorStop(0, '#facc15'); // amber-400
    nfcGrad.addColorStop(1, '#ca8a04'); // yellow-600
    ctx.fillStyle = nfcGrad;
    ctx.beginPath();
    ctx.roundRect(tx, ty, 60, 46, 6);
    ctx.fill();

    // Internal contact patterns
    ctx.strokeStyle = 'rgba(113, 63, 4, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // divider
    ctx.moveTo(tx + 20, ty);
    ctx.lineTo(tx + 20, ty + 46);
    ctx.moveTo(tx + 40, ty);
    ctx.lineTo(tx + 40, ty + 46);
    ctx.moveTo(tx, ty + 23);
    ctx.lineTo(tx + 60, ty + 23);
    ctx.stroke();

    // Small rounded center core pad
    ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
    ctx.beginPath();
    ctx.roundRect(tx + 24, ty + 15, 12, 16, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  // 6. Draw Stylized QR code
  const drawQRCodeAt = (qx: number, qy: number, qSize: number) => {
    ctx.save();
    ctx.fillStyle = textColor;
    
    // Outer squares matching vector finder blocks
    const drawFinder = (fx: number, fy: number, size: number) => {
      ctx.strokeStyle = textColor;
      ctx.lineWidth = size * 0.15;
      ctx.strokeRect(fx, fy, size, size);
      
      const innerOffset = size * 0.3;
      ctx.fillRect(fx + innerOffset, fy + innerOffset, size - innerOffset * 2, size - innerOffset * 2);
    };

    const block = qSize / 10;
    
    drawFinder(qx, qy, block * 3); // top left
    drawFinder(qx + qSize - block * 3, qy, block * 3); // top right
    drawFinder(qx, qy + qSize - block * 3, block * 3); // bottom left

    // Random pixels styling
    ctx.fillStyle = textColor;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        // Skip finder areas
        if ((r < 3.5 && c < 3.5) || (r < 3.5 && c > 5.5) || (r > 5.5 && c < 3.5)) {
          continue;
        }
        if ((r + c) % 2 === 0 || (r * c) % 3 === 1) {
          ctx.fillRect(qx + c * block, qy + r * block, block * 0.8, block * 0.8);
        }
      }
    }
    ctx.restore();
  };

  // 7. Render Layout Specific text alignment
  ctx.fillStyle = textColor;
  ctx.textBaseline = 'top';

  const fontToUse = fontFamily || 'Helvetica';
  
  // Custom draw text helper to avoid text cut-offs
  const drawText = (str: string, x: number, y: number, font: string, color: string) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(str, x, y);
    ctx.restore();
  };

  onProgress(85);

  // Position and render widgets based on exact layouts (10 layouts supported)
  // To keep size reliable we map coordinates for all 10 card design specifications:
  switch (layout) {
    case 'compact':
      // Dense structure, avatar left top, details stacked, chip & QR right
      drawAvatarAt(80, 80, 45);
      drawText(data.name, 145, 45, `bold 28px ${fontToUse}`, accentColor);
      drawText(data.role, 145, 82, `600 18px ${fontToUse}`, textColor);
      drawText(data.company, 145, 108, `14px ${fontToUse}`, `${textColor}B3`);

      // Contacts list
      let cy = 180;
      if (data.phone) { drawText(`📞  ${data.phone}`, 60, cy, `18px ${fontToUse}`, textColor); cy += 35; }
      if (data.email) { drawText(`✉️  ${data.email}`, 60, cy, `18px ${fontToUse}`, textColor); cy += 35; }
      if (data.website) { drawText(`🌐  ${data.website}`, 60, cy, `18px ${fontToUse}`, textColor); }

      drawNFCChipAt(560, 50);
      drawQRCodeAt(550, 140, 90);
      break;

    case 'wide-avatar':
      // Massive centered avatar, layout symmetrical
      drawNFCChipAt(50, 40);
      drawQRCodeAt(570, 40, 80);
      
      drawAvatarAt(350, 110, 65);
      ctx.textAlign = 'center';
      drawText(data.name, 350, 195, `bold 32px ${fontToUse}`, accentColor);
      drawText(data.role, 350, 235, `600 18px ${fontToUse}`, textColor);
      drawText(data.company, 350, 260, `14px ${fontToUse}`, `${textColor}99`);

      // Draw horizontal contacts row centered
      ctx.textAlign = 'center';
      const rowText = [data.phone, data.email, data.website].filter(Boolean).join('   |   ');
      drawText(rowText, 350, 310, `16px ${fontToUse}`, textColor);
      break;

    case 'minimal':
      // Sparse typography, ample white space
      drawNFCChipAt(580, 40);
      drawText(data.name, 60, 60, `bold 38px ${fontToUse}`, accentColor);
      drawText(data.role.toUpperCase(), 60, 110, `bold 14px ${fontToUse}`, textColor);
      drawText(data.company, 60, 135, `15px ${fontToUse}`, `${textColor}80`);

      // Contacts left bottom
      drawText(data.phone, 60, 220, `18px ${fontToUse}`, textColor);
      drawText(data.email, 60, 255, `18px ${fontToUse}`, textColor);
      drawText(data.website, 60, 290, `18px ${fontToUse}`, textColor);

      drawQRCodeAt(550, 240, 90);
      break;

    case 'bold-name':
      // Huge name, avatar upper right
      drawAvatarAt(580, 100, 55);
      
      drawText(data.company.toUpperCase() || 'MEECARDS PROFESSIONAL', 60, 50, `bold 12px ${fontToUse}`, `${textColor}99`);
      drawText(data.name, 60, 80, `bold 46px ${fontToUse}`, accentColor);
      drawText(data.role, 60, 138, `bold 22px ${fontToUse}`, textColor);

      // Contact detail stack
      drawText(`Phone: ${data.phone}`, 60, 230, `17px ${fontToUse}`, textColor);
      drawText(`Email: ${data.email}`, 60, 265, `17px ${fontToUse}`, textColor);
      drawText(`Web: ${data.website}`, 60, 300, `17px ${fontToUse}`, textColor);

      drawNFCChipAt(480, 290);
      drawQRCodeAt(570, 250, 80);
      break;

    case 'centered':
      // Symmetrical centered stack from top to bottom
      drawAvatarAt(350, 90, 55);
      ctx.textAlign = 'center';
      drawText(data.name, 350, 160, `bold 32px ${fontToUse}`, accentColor);
      drawText(data.role, 350, 200, `600 18px ${fontToUse}`, textColor);
      drawText(data.company, 350, 225, `14px ${fontToUse}`, `${textColor}80`);

      drawText(data.phone, 350, 270, `16px ${fontToUse}`, textColor);
      drawText(data.email, 350, 300, `16px ${fontToUse}`, textColor);

      ctx.textAlign = 'left'; // reset
      drawNFCChipAt(50, 310);
      drawQRCodeAt(590, 290, 70);
      break;

    case 'split':
      // Half left dark overlay background, right side actions
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(0,0,330,400);

      drawAvatarAt(100, 100, 45);
      drawText(data.name, 50, 170, `bold 30px ${fontToUse}`, accentColor);
      drawText(data.role, 50, 210, `600 16px ${fontToUse}`, textColor);
      drawText(data.company, 50, 235, `13px ${fontToUse}`, `${textColor}99`);

      drawNFCChipAt(580, 45);
      drawQRCodeAt(550, 130, 90);

      // Contacts right column
      ctx.textAlign = 'right';
      drawText(data.phone, 640, 260, `17px ${fontToUse}`, textColor);
      drawText(data.email, 640, 295, `17px ${fontToUse}`, textColor);
      drawText(data.website, 640, 330, `17px ${fontToUse}`, textColor);
      ctx.textAlign = 'left'; // reset
      break;

    case 'pill-contacts':
      // Contacts enclosed in badge border styling
      drawAvatarAt(600, 80, 45);
      drawText(data.name, 60, 50, `bold 34px ${fontToUse}`, accentColor);
      drawText(data.role, 60, 95, `19px ${fontToUse}`, textColor);
      drawText(data.company, 60, 122, `14px ${fontToUse}`, `${textColor}80`);

      // Render pills manually
      ctx.strokeStyle = `${accentColor}80`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1.5;

      const drawPill = (txt: string, px: number, py: number) => {
        const textWidth = ctx.measureText(txt).width;
        ctx.beginPath();
        ctx.roundRect(px, py, textWidth + 30, 36, 18);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = textColor;
        ctx.fillText(txt, px + 15, py + 10);
      };

      ctx.font = `14px ${fontToUse}`;
      if (data.phone) drawPill(`📞  ${data.phone}`, 60, 180);
      if (data.email) drawPill(`✉️  ${data.email}`, 60, 230);
      if (data.website) drawPill(`🌐  ${data.website}`, 60, 280);

      drawNFCChipAt(580, 290);
      drawQRCodeAt(480, 260, 70);
      break;

    case 'icon-row':
      // Top row avatar, bottom horizontal contact action spheres
      drawAvatarAt(100, 100, 50);
      drawText(data.name, 180, 65, `bold 34px ${fontToUse}`, accentColor);
      drawText(`${data.role} @ ${data.company || 'Professional'}`, 180, 110, `17px ${fontToUse}`, textColor);

      // Symmetrical circle graphics to represent social contacts
      let sx = 100;
      const contacts = [
        { label: 'P', val: data.phone },
        { label: 'E', val: data.email },
        { label: 'W', val: data.website },
        { label: 'WA', val: data.whatsapp }
      ].filter(c => c.val);

      contacts.forEach(c => {
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, 220, 26, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = accentColor;
        ctx.font = `bold 14px ${fontToUse}`;
        ctx.textAlign = 'center';
        ctx.fillText(c.label, sx, 212);
        
        ctx.fillStyle = textColor;
        ctx.font = `12px ${fontToUse}`;
        // Draw matching text slightly clipping
        const truncateVal = c.val.length > 15 ? c.val.substring(0, 12) + '...' : c.val;
        ctx.fillText(truncateVal, sx, 255);
        
        sx += 140;
      });

      ctx.textAlign = 'left';
      drawNFCChipAt(46, 310);
      drawQRCodeAt(580, 280, 80);
      break;

    case 'sidebar':
      // Vertically aligned rail on left
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, 110, 400);
      ctx.strokeStyle = `${textColor}20`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(110, 0);
      ctx.lineTo(110, 400);
      ctx.stroke();

      drawNFCChipAt(25, 45);
      drawQRCodeAt(22, 160, 66);

      // Detail stack on main right column
      drawText(data.name, 150, 60, `bold 36px ${fontToUse}`, accentColor);
      drawText(data.role, 150, 110, `600 19px ${fontToUse}`, textColor);
      drawText(data.company, 150, 138, `14px ${fontToUse}`, `${textColor}99`);

      drawText(`📞   ${data.phone}`, 150, 210, `18px ${fontToUse}`, textColor);
      drawText(`✉️   ${data.email}`, 150, 250, `18px ${fontToUse}`, textColor);
      if (data.website) drawText(`🌐   ${data.website}`, 150, 290, `18px ${fontToUse}`, textColor);
      break;

    default: // standard layout (classic layout balance)
      drawAvatarAt(580, 90, 55);
      drawText(data.name, 60, 55, `bold 34px ${fontToUse}`, accentColor);
      drawText(data.role, 60, 100, `600 19px ${fontToUse}`, textColor);
      drawText(data.company, 60, 128, `14px ${fontToUse}`, `${textColor}80`);

      // Contacts list bottom left
      let by = 210;
      if (data.phone) { drawText(`Phone: ${data.phone}`, 60, by, `17px ${fontToUse}`, textColor); by += 35; }
      if (data.email) { drawText(`Email: ${data.email}`, 60, by, `17px ${fontToUse}`, textColor); by += 35; }
      if (data.website) { drawText(`Website: ${data.website}`, 60, by, `17px ${fontToUse}`, textColor); }

      drawNFCChipAt(480, 310);
      drawQRCodeAt(580, 270, 80);
      break;
  }

  // 8. Draw branding fine-print tag (Always positioned consistently in corners)
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = textColor;
  ctx.font = `600 11px monospace`;
  ctx.textAlign = 'right';
  ctx.fillText('MEECARDS.IN', 670, 370);
  ctx.restore();

  onProgress(100);

  // Return base64 png
  return canvas.toDataURL('image/png');
}
