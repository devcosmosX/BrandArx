# BrandArx - Premium Digital Agency Website

<div align="center">

<img width="1802" height="1079" alt="image" src="https://github.com/user-attachments/assets/fe45201c-6903-4c60-ab27-d50f603288eb" />
<img width="1901" height="1072" alt="image" src="https://github.com/user-attachments/assets/3990261f-ef32-4677-bfc3-ad5d7aa237c5" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b853ccb6-196e-4068-81d0-da71d6080585" />




**Build Smarter. Automate Faster. Grow Revenue.**

A modern, full-stack digital agency website built with cutting-edge technologies and premium UI/UX design.

[Live Demo](#) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started)

</div>

---

## 🌟 Overview

BrandArx is a professional digital agency website featuring a stunning dark theme with violet gradient accents, glassmorphism effects, and smooth animations. The platform showcases comprehensive digital solutions including web development, AI automation, UI/UX design, and growth strategies.

## ✨ Features

### 🎨 Premium Design
- **Glassmorphism UI** - Modern frosted glass effects with backdrop blur
- **Violet Gradient Theme** - Consistent color scheme throughout
- **Smooth Animations** - Micro-interactions and transitions on all elements
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop

### 🔐 Authentication System
- **Login & Signup Forms** - Complete authentication flow
- **Password Strength Indicator** - Real-time password validation
- **Social Login** - Google & GitHub OAuth integration ready
- **Form Validation** - Zod schema validation with react-hook-form
- **Remember Me** - Persistent login functionality

### 🚀 Key Sections
- **Hero Section** - Eye-catching gradient background with CTA buttons
- **Services Showcase** - Comprehensive digital solutions display
- **Logo Ticker** - Trusted by innovative companies
- **Service Cards** - Website Development, AI Automation, UI/UX Design, SEO
- **Client Testimonials** - Social proof and success stories

### 💎 Premium UI Components
- **Enhanced Navigation** - Glassmorphism header with dropdown menus
- **Premium Buttons** - Gradient effects with hover animations
- **Login Modal** - Elegant popup authentication
- **Form Fields** - Icon-enhanced inputs with focus states
- **Loading States** - Spinner animations for async operations

## 📸 Screenshots

### Hero Section
![Hero Section](https://raw.githubusercontent.com/devcosmosX/BrandArx/main/screenshots/hero.png)

### Services Section
![Services Section](https://raw.githubusercontent.com/devcosmosX/BrandArx/main/screenshots/services.png)

### Service Cards
![Service Cards](https://raw.githubusercontent.com/devcosmosX/BrandArx/main/screenshots/service-cards.png)

### Authentication Page
*Premium login/signup experience with glassmorphism design*

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **TanStack Router** - File-based routing system
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework

### Form Management
- **react-hook-form** - Performant form handling
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation integration

### UI/UX
- **Lucide React** - Beautiful icon library
- **Custom Animations** - Smooth transitions and micro-interactions
- **Glassmorphism** - Modern frosted glass effects
- **Gradient System** - Violet/violet-glow color palette

### State Management
- **React Context API** - Authentication state
- **TanStack Query** - Server state management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/devcosmosX/BrandArx.git
cd BrandArx
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:8080
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
BrandArx/
├── src/
│   ├── components/
│   │   └── LoginModal.tsx          # Login modal component
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication context
│   ├── routes/
│   │   ├── __root.tsx              # Root layout
│   │   ├── index.tsx               # Homepage
│   │   └── auth.tsx                # Authentication page
│   ├── styles.css                  # Global styles & Tailwind config
│   └── router.tsx                  # Router configuration
├── public/                         # Static assets
├── package.json
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Violet (`oklch(0.65 0.27 290)`)
- **Accent**: Violet Glow (`oklch(0.78 0.22 295)`)
- **Background**: Dark (`oklch(0.08 0.03 280)`)
- **Foreground**: White with opacity variants

### Typography
- **Font Family**: Inter (system-ui fallback)
- **Heading Sizes**: Responsive from text-4xl to text-8xl
- **Letter Spacing**: -0.01em to -0.02em for premium feel

### Effects
- **Backdrop Blur**: 8px to 24px for glassmorphism
- **Shadows**: Layered violet shadows for depth
- **Transitions**: 300ms ease for smooth interactions
- **Hover States**: Scale transforms (1.02-1.05)

## 🔐 Authentication Features

### Login Form
- Email validation
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Social login options (Google, GitHub)

### Signup Form
- Full name field
- Email validation
- Password strength indicator
  - Weak (< 6 chars) - Red
  - Medium (6-9 chars) - Amber
  - Strong (10+ chars with symbols) - Green
- Confirm password matching
- Terms & conditions checkbox

### Security
- Client-side validation with Zod
- Password strength requirements
- HTTPS ready
- OAuth integration ready

## 🎯 Key Pages

### Homepage (`/`)
- Hero section with gradient background
- Services dropdown navigation
- Logo ticker
- Service showcase cards
- Client testimonials
- CTA sections

### Authentication (`/auth`)
- Tab switcher (Login/Signup)
- Animated background with gradient orbs
- Glassmorphism card design
- Form validation
- Social login buttons
- Back to home link

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ghansham Deepak Gavande**
- GitHub: [@devcosmosX](https://github.com/devcosmosX)
- Email: ghansham.deepak.gavande@ibm.com

## 🙏 Acknowledgments

- Design inspiration from modern agency websites
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**Built with ❤️ by BrandArx**

[⬆ Back to Top](#brandarx---premium-digital-agency-website)

</div>
