# 🎨 VietQR HDSAISON - Design System

## Overview
Modern, professional design system cho ứng dụng Fintech - HD SAISON VietQR

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-50: #EEF2FF;
--primary-100: #E0E7FF;
--primary-500: #6366F1;  /* Main Primary */
--primary-600: #4F46E5;
--primary-700: #4338CA;
```

### Secondary/Success Colors
```css
--success-50: #ECFDF5;
--success-100: #D1FAE5;
--success-500: #10B981;  /* Main Success */
--success-600: #059669;
```

### Accent Colors
```css
--accent-50: #FFFBEB;
--accent-100: #FEF3C7;
--accent-500: #F59E0B;  /* Main Accent */
--accent-600: #D97706;
```

### Danger/Error Colors
```css
--danger-50: #FEF2F2;
--danger-100: #FEE2E2;
--danger-500: #EF4444;
--danger-600: #DC2626;
```

### Neutral/Gray Scale
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

### Surface Colors
```css
--surface-light: #FFFFFF;
--surface-dark: #1F2937;
--background-light: #F9FAFB;
--background-dark: #111827;
```

---

## 📝 Typography

### Font Family
- **Primary**: IBM Plex Sans (giữ nguyên - professional fintech font)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

### Font Sizes
```css
--text-xs: 12px;      /* Small labels, captions */
--text-sm: 14px;      /* Body small, secondary text */
--text-base: 16px;    /* Body text, inputs */
--text-lg: 18px;      /* Large body, subtitles */
--text-xl: 20px;      /* Section headings */
--text-2xl: 24px;     /* Page headings */
--text-3xl: 30px;     /* Hero headings */
--text-4xl: 36px;     /* Display headings */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## 📏 Spacing System (8px base)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

---

## 🔲 Border Radius

```css
--radius-sm: 6px;      /* Small elements */
--radius-md: 8px;      /* Inputs, badges */
--radius-lg: 12px;     /* Buttons, cards */
--radius-xl: 16px;     /* Large cards */
--radius-2xl: 24px;    /* Modals, drawers */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 🌑 Shadows & Elevation

```css
/* Light Mode Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Dark Mode Shadows */
--shadow-dark-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-dark-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-dark-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
```

---

## 🎭 Glassmorphism Effect

```css
/* Light Mode Glass */
--glass-light: rgba(255, 255, 255, 0.8);
--glass-backdrop: blur(20px);
--glass-border: rgba(255, 255, 255, 0.2);

/* Dark Mode Glass */
--glass-dark: rgba(31, 41, 59, 0.8);
--glass-dark-border: rgba(255, 255, 255, 0.1);
```

---

## ⚡ Transitions & Animations

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

---

## 📱 Responsive Breakpoints

```css
--breakpoint-mobile: 320px;   /* Mobile phones */
--breakpoint-tablet: 768px;   /* Tablets */
--breakpoint-desktop: 1024px; /* Desktops */
--breakpoint-wide: 1440px;    /* Wide screens */
```

---

## 🧩 Component Variants

### Button Variants
- **Primary**: Solid background, high contrast
- **Secondary**: Outlined, transparent background
- **Ghost**: No border, transparent background
- **Danger**: Red color for destructive actions

### Card Variants
- **Default**: Subtle border, white background
- **Elevated**: Shadow elevation, no border
- **Glass**: Glassmorphism effect, backdrop blur

### Badge Variants
- **Pill**: Rounded full, solid background
- **Dot**: Small colored dot indicator
- **Count**: Number badge (notifications)

---

## 🎯 Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

---

## ✅ Component Inventory

### Atoms (Basic Building Blocks)
- Button
- Input
- Badge
- Avatar
- Icon
- Tooltip

### Molecules (Combined Atoms)
- Card
- Modal
- Toast/Snackbar
- Dropdown
- Loading (Spinner, Skeleton, Progress)
- EmptyState

### Organisms (Complex Components)
- Sidebar
- TopBar
- MobileNav
- QRCard
- ContractFileCard
- DataTable

### Templates (Page Layouts)
- AppShell (Main Layout)
- QRGeneratorTab
- ContractFilesTab
- LoanCalculatorTab
- ExportTab

---

## 🛠️ Tech Stack Decision

### ✅ Chosen: **Styled Components**

**Reasons:**
1. Dynamic theming support (Light/Dark)
2. Scoped styles (no global conflicts)
3. Props-based styling (variant support)
4. Better TypeScript support
5. CSS-in-JS co-location

**Alternative:** CSS Modules (good but less dynamic)

---

## 🎨 Icon Library

### ✅ Chosen: **lucide-react**

**Reasons:**
1. Modern, beautiful icons
2. Lightweight, tree-shakeable
3. Consistent design language
4. Easy to use with React
5. Good accessibility

**Usage:**
```jsx
import { Home, Users, FileText } from 'lucide-react';
```

---

## 🎬 Animation Strategy

### Library: **Framer Motion**

**Use Cases:**
- Page transitions (fadeIn, slideUp)
- Modal animations (backdrop blur + slide)
- Card hover effects (lift + shadow)
- Toast notifications (slide-in)
- List stagger animations
- Form validation shake

---

## 📐 Layout Grid

### Desktop: 12-column grid
- Sidebar: 280px fixed
- Content: fluid (calc(100% - 280px))
- Max content width: 1440px

### Mobile: Single column
- Full width stack
- Bottom navigation: 56px fixed

---

## ♿ Accessibility Guidelines

1. **Color Contrast**: WCAG AA minimum (4.5:1 for text)
2. **Touch Targets**: Minimum 44x44px for mobile
3. **Keyboard Navigation**: All interactive elements focusable
4. **Screen Readers**: Proper ARIA labels
5. **Focus Indicators**: Visible focus outlines

---

## 🎨 Design Principles

1. **Clarity**: Clear visual hierarchy, easy to scan
2. **Efficiency**: Minimal clicks, quick actions
3. **Consistency**: Reusable patterns, predictable behavior
4. **Feedback**: Visual feedback for all actions
5. **Modern**: Clean, contemporary aesthetic
6. **Professional**: Trust-building design for financial app

---

**Last Updated:** December 11, 2025
**Version:** 1.0.0
