# VietQR HD SAISON - Hệ Thống Quản Lý Hợp Đồng 📄

Ứng dụng web quản lý hợp đồng tài chính và tạo mã QR cho HD SAISON, được xây dựng bằng **React** và **Vite**.

## 🚀 Tính Năng Chính

### 1. **In Bộ Hợp Đồng** 📋
- In và xuất hợp đồng tài chính dạng PDF
- Tích hợp font Times New Roman cho tiếng Việt
- Hỗ trợ nhiều loại hợp đồng (ED, DL, POS)

### 2. **Tạo Mã QR** 🔲
- Tạo mã QR thanh toán VietQR
- Nhập thông tin khách hàng và số tiền
- Xuất mã QR dạng hình ảnh
- Hỗ trợ nhiều dòng dữ liệu

### 3. **Tính Khoản Vay (ED)** 💰
- Tính toán khoản vay ED Loan
- Hiển thị lãi suất và kỳ hạn
- Tính số tiền trả trước
- Xuất kế hoạch trả góp chi tiết

### 4. **Trích Xuất Hợp Đồng** 📊
- Trích xuất dữ liệu từ file hợp đồng PDF
- Xuất file Excel (.xlsx)
- Xử lý nhiều hợp đồng cùng lúc

## 🛠️ Công Nghệ Sử Dụng

- ⚡ **Vite** - Build tool nhanh
- ⚛️ **React 18** - UI library
- 💅 **Styled Components** - CSS-in-JS
- 🎨 **Framer Motion** - Animations
- 📄 **PDF-Lib** - PDF generation/manipulation
- 🔲 **qrcode.react** - QR code generation
- 📊 **XLSX** - Excel file processing
- 🎯 **Lucide React** - Icons

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js >= 18.x
- npm >= 9.x

### Các Bước Cài Đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd VietQR-HDSAISON/vietqr-react
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Chạy development server**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 📜 Scripts

| Script | Mô Tả |
|--------|-------|
| `npm run dev` | Chạy development server với Vite |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Kiểm tra code với ESLint |
| `npm run lint:fix` | Tự động fix linting issues |

## 🌐 Deploy lên Vercel

### Cách 1: Deploy qua Vercel CLI

1. **Cài đặt Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd vietqr-react
vercel
```

### Cách 2: Deploy qua GitHub

1. Push code lên GitHub repository
2. Truy cập [vercel.com](https://vercel.com)
3. Import repository của bạn
4. Chọn framework preset: **Vite**
5. Root Directory: `vietqr-react`
6. Click **Deploy**

### Cấu Hình Vercel

Vercel sẽ tự động nhận diện cấu trúc Vite. Nếu cần custom, tạo file `vercel.json` trong thư mục `vietqr-react`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## 📁 Cấu Trúc Thư Mục

```
vietqr-react/
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, fonts
│   ├── components/      # Reusable components
│   │   ├── atoms/       # Basic components
│   │   ├── molecules/   # Composite components
│   │   └── organisms/   # Complex components
│   ├── contexts/        # React Context providers
│   ├── features/        # Feature modules
│   │   ├── qr-generator/
│   │   ├── contract-files/
│   │   ├── loan-calculator/
│   │   └── export/
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── styles/          # Global styles & themes
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## 🎨 UI/UX Features

- 📱 **Responsive Design** - Tối ưu cho desktop và mobile
- 🌙 **Dark Theme** - Giao diện tối hiện đại
- ✨ **Glassmorphism** - Hiệu ứng kính mờ
- 🎭 **Smooth Animations** - Chuyển động mượt mà với Framer Motion
- ♿ **Accessible** - Tuân thủ chuẩn accessibility

## 🔧 Development

### Code Style
Project sử dụng ESLint để đảm bảo code quality. Chạy trước khi commit:

```bash
npm run lint:fix
```

### Build Optimization
- Code splitting với React lazy loading
- Tree shaking tự động
- Asset optimization (images, fonts)
- Gzip compression
