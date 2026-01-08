# HisabKitab Desktop Web App

A professional Restaurant POS Desktop Web Application built with React, TypeScript, and Vite. This is the desktop version of the HisabKitab mobile app with 100% feature parity.

## 🚀 Features

- **Table Management**: Manage restaurant tables with status tracking (Free, Occupied, Bill Pending)
- **Billing Screen**: Premium 3-panel layout for efficient order taking and billing
- **Menu Management**: Add, edit, and organize menu items by categories
- **Staff Management**: Manage staff with role-based access control
- **Reports**: Sales, Orders, Items, and Expenses reports with date filters
- **Invoices**: View and manage all invoices with search functionality
- **Role-Based Access**: Different permissions for OWNER, MANAGER, STAFF, and CASHIER
- **Order Rolls**: Order thermal printer rolls with minimum quantity validation
- **Subscription**: View and manage subscription plans

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **Fetch API** for backend communication
- **localStorage** for token and user data persistence

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend API running at `http://localhost:8080/api` (or configured URL)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/sandeshpatil45/HisabKitab-desktop-web.git
cd HisabKitab-desktop-web
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📱 User Roles & Permissions

### STAFF
- ✅ Can view Tables and Menu
- ✅ Can add items to bill
- ✅ Can send KOT
- ❌ Cannot see prices
- ❌ Cannot print bill
- ❌ Cannot apply discounts
- ❌ Cannot access reports

### OWNER / MANAGER / CASHIER
- ✅ Full access to all features
- ✅ Can see prices and bills
- ✅ Can print bills
- ✅ Can apply discounts
- ✅ Can access reports
- ✅ Can manage settings

## 🎯 Key Screens

### Billing Screen (Most Important)
**3-Panel Layout:**
- **Left Panel**: Menu categories and items
- **Center Panel**: Bill items with quantity controls
- **Right Panel**: Bill summary with actions

Features:
- Quick add items
- Item-level editing (price, discount, GST)
- Overall discount
- Send KOT, Print Bill, Share via WhatsApp, Save Bill

## 🔗 Backend APIs

This app uses the backend at `vishal2006/hisab-kitab-BE-v1` (Java Spring Boot).

**No backend changes required** - this is frontend-only implementation.

## 📦 Project Structure

```
src/
├── api/              # API services
├── components/       # Reusable components
├── screens/          # App screens
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## 📝 License

This project is part of the HisabKitab ecosystem.

---

**Built with ❤️ for BillBharat**
