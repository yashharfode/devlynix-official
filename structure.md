# Project Structure: Devlynix

This document provides an overview of the file structure and the purpose of each key component in the Devlynix project.

## 📁 Directory Structure

```text
Devlynix/
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Public-facing routes
│   │   │   ├── layout.tsx         # Marketing layout (Public Navbar/Footer)
│   │   │   └── page.tsx           # Landing Page (Hero, Bento, Pricing, FAQ)
│   │   ├── (protected)/           # Authenticated routes
│   │   │   ├── layout.tsx         # Dashboard layout (UserButton/User Nav)
│   │   │   └── hub/
│   │   │       └── page.tsx       # Builder's Hub Dashboard
│   │   ├── sign-in/               # Custom Clerk sign-in routes
│   │   ├── sign-up/               # Custom Clerk sign-up routes
│   │   ├── globals.css            # Tailwind V4 & Global Styles
│   │   └── layout.tsx             # Root layout (ClerkProvider, Fonts)
│   ├── components/                # Reusable UI Architecture
│   │   ├── sections/              # Page sections (HeroSection, FAQSection, etc.)
│   │   └── ui/                    # Base UI atoms (SpotlightCard, FAQItem)
│   ├── lib/                       # Core utilities & hooks
│   │   ├── hooks/                 # Custom React hooks (useScrollDirection, etc.)
│   │   └── utils.ts               # Tailwind 'cn' utility
│   └── proxy.ts                   # Clerk Middleware configuration
├── package.json                   # Dependencies (@clerk/nextjs, lucide-react)
└── .env.local                     # Local environment secrets (DO NOT COMMIT)
```

## 📄 File Descriptions

### `src/app/(marketing)/page.tsx`
The public landing page. It orchestrates the modular components from `src/components/sections` to create the high-impact visual experience.

### `src/app/(protected)/hub/page.tsx`
The primary dashboard for authenticated builders. It features the XP streak system, project bounty board, and community leaderboards.

### `src/proxy.ts`
Handles server-side authentication logic using `clerkMiddleware()`. It protects routes and ensures only logged-in users can access the `/hub` and other protected areas.

### `src/app/layout.tsx`
The entry point of the UI. It wraps the entire application in `ClerkProvider` for auth context and initializes the Geist font family for a premium typography feel.

### `src/components/sections/`
Contains the large-scale UI blocks. These are separated from the main pages to keep the code clean and maintainable.

### `src/lib/hooks/`
Encapsulates complex logic like scroll direction tracking and intersection observers for animations, making them reusable across the entire app.

---
*Last updated: May 10, 2026*
