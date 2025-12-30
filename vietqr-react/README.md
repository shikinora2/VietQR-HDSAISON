# 🎨 VietQR HDSAISON - Modern React Application

> Modern, professional React application cho HD SAISON - VietQR & Quản lý hợp đồng

## ✨ Features

- ✅ **QR Generator**: Tạo mã VietQR thanh toán nhanh chóng
- ✅ **Contract Management**: Quản lý và in hợp đồng tự động
- ✅ **Loan Calculator**: Tính toán khoản vay trả góp (ED)
- ✅ **Export Tools**: Xuất dữ liệu ra Excel, Google Sheets
- ✅ **Dark Mode**: Hỗ trợ giao diện sáng/tối
- ✅ **Responsive**: Tối ưu cho Mobile, Tablet, Desktop

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **lucide-react** - Icons
- **pdf-lib** - PDF generation
- **xlsx** - Excel export

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic components (Button, Input, Badge)
│   ├── molecules/      # Combined components (Modal, Toast)
│   ├── organisms/      # Complex components (Sidebar, DataTable)
│   └── templates/      # Page layouts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── contexts/           # React Context providers
├── styles/             # Global styles, tokens, theme
├── assets/             # Images, fonts, static files
└── constants/          # Constants, config

```

## 🎨 Design System

Design tokens và component guidelines được định nghĩa trong:
- `DESIGN_SYSTEM.md` - Tài liệu thiết kế đầy đủ
- `src/styles/tokens.js` - Design tokens (colors, spacing, etc.)
- `src/styles/GlobalStyles.jsx` - Global CSS styles
- `src/styles/ThemeProvider.jsx` - Theme system (Light/Dark)

## 🔧 Development

### Path Aliases
```javascript
import Button from '@components/atoms/Button';
import { useTheme } from '@hooks/useTheme';
import { formatCurrency } from '@utils/formatUtils';
```

### Available Scripts

- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🎯 Development Phases

- [x] Phase 1: Foundation (Setup, Design System, Tokens)
- [ ] Phase 2: Component Library (Atoms, Molecules, Layout)
- [ ] Phase 3: Core Logic (Utils, Hooks, Contexts)
- [ ] Phase 4: Feature Tabs (QR, Contracts, Calculator, Export)
- [ ] Phase 5: Advanced Features (Animations, Dark Mode, Mobile)
- [ ] Phase 6: Polish & Deploy (Testing, Performance, Deploy)

## 👨‍💻 Author

Developed by **Huỳnh Hải Đăng**

## 📄 License

Private - HD SAISON Internal Use Only

---

**Last Updated:** December 11, 2025
**Version:** 1.0.0 (Phase 1)
