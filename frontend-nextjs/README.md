# FitNexus - Next.js Frontend

Modern, professional FitNexus built with **Next.js 14**, **Tailwind CSS**, **shadcn/ui**, and **Framer Motion**.

## 🎨 Features

- ✨ **Modern UI/UX** with professional color scheme
- 🎭 **Smooth Animations** using Framer Motion
- 📊 **Dashboard with Statistics** - Real-time stats for members, payments, trainers
- 🔍 **Advanced Search & Filters** - Search members by multiple criteria
- 📤 **Export to CSV** - Export member data
- 💳 **Payment Management** - Track payments and dues
- 👨‍🏫 **Trainer Management** - Manage trainer information
- 📱 **Responsive Design** - Works on all screen sizes
- ⚡ **Fast Performance** - Built with Next.js 14 App Router

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Backend Spring Boot API:
  - **Local dev**: `http://localhost:8080`
  - **Production**: your Railway URL, e.g. `https://fitnexuss.up.railway.app`

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

## 🎨 Color Scheme

The application uses a professional color palette:

- **Primary**: Blue (`#0ea5e9`) - Main actions and highlights
- **Secondary**: Slate (`#64748b`) - Text and backgrounds
- **Accent**: Red (`#ef4444`) - Errors and warnings
- **Success**: Green (`#22c55e`) - Success states
- **Background**: Light blue-white gradient

## 📁 Project Structure

```
frontend-nextjs/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard with stats
│   ├── login/             # Login page
│   ├── members/           # Member management
│   ├── payments/         # Payment management
│   └── trainers/         # Trainer management
├── components/
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and API
└── public/              # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📦 Key Dependencies

- **Next.js 14** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **shadcn/ui** - UI component library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **date-fns** - Date formatting

## 🔐 Login Credentials

- **Username**: `admin`
- **Password**: `admin`

## 🎯 Extra Features Added

1. **Dashboard Statistics**
   - Total members count
   - Total revenue
   - Payment transactions
   - Active trainers

2. **Advanced Search**
   - Search by ID, name, email, phone
   - Filter by member type

3. **Export Functionality**
   - Export member list to CSV

4. **Professional Animations**
   - Smooth page transitions
   - Hover effects
   - Loading states

5. **Enhanced UI Components**
   - Modern card designs
   - Professional tables
   - Responsive layouts
   - Status badges

## 🌐 API Integration

The frontend connects to the Spring Boot backend API using an environment variable:

- `NEXT_PUBLIC_API_URL`

Examples:

- Local dev: `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
- Production (Netlify): `NEXT_PUBLIC_API_URL=https://fitnexuss.up.railway.app/api`

Make sure this variable is set correctly in Netlify before deploying.

## 📝 Notes

- All pages are protected with authentication
- Data is stored in localStorage for session management
- Responsive design works on mobile, tablet, and desktop
- Professional color scheme throughout the application

