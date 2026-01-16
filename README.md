# 🎯 AI Job Radar

**Know before it's too late.** Monitor AI developments and get personalized alerts when your job is at risk.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone/Copy the project**
   ```bash
   cd C:\Users\oltea\Desktop
   # Replace your existing aijobradar folder with this one
   ```

2. **Install dependencies**
   ```bash
   cd aijobradar
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Fixing Common Issues

### "Cannot find module 'autoprefixer'" Error

This error occurs when PostCSS dependencies are missing. **This project includes the fix!**

The `package.json` includes:
```json
"devDependencies": {
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.49",
  "tailwindcss": "^3.4.15"
}
```

If you still get the error:
```bash
# Delete old files
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

## 📦 Setting Up Supabase (Database)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/Login with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: aijobradar
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
6. Click "Create new project" (wait 2 minutes)

### Step 2: Get Database URL
1. In Supabase dashboard, go to **Settings** (gear icon)
2. Click **Database** in the sidebar
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password

### Step 3: Configure Environment
Add to your `.env.local`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

### Step 4: Push Schema to Database
```bash
npx prisma db push
```

### Step 5: View Database (Optional)
```bash
npx prisma studio
```
Opens a visual database browser at http://localhost:5555

## 🗂️ Project Structure

```
aijobradar/
├── app/
│   ├── page.tsx          # Landing page with animations
│   ├── layout.tsx        # Root layout with metadata
│   ├── globals.css       # Tailwind + custom styles
│   └── api/              # API routes (coming soon)
├── components/
│   └── Logo.tsx          # Animated radar SVG
├── lib/
│   └── prisma.ts         # Database client singleton
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── package.json          # Dependencies
├── tailwind.config.ts    # Custom animations
├── tsconfig.json         # TypeScript config
└── postcss.config.js     # PostCSS config
```

## 🎨 Custom Animations

Available Tailwind animations:
- `animate-fade-in` - Simple fade in
- `animate-fade-in-up` - Fade in + slide up
- `animate-fade-in-down` - Fade in + slide down
- `animate-scale-in` - Fade in + scale up
- `animate-ping-slow` - Slow ping effect
- `animate-spin-slow` - Slow rotation
- `animate-bounce-slow` - Slow bounce
- `animate-pulse-slow` - Slow pulse
- `animate-radar-sweep` - Radar scanner rotation

Use delay classes for staggered effects:
```tsx
<div className="animate-fade-in-up delay-200">First</div>
<div className="animate-fade-in-up delay-400">Second</div>
<div className="animate-fade-in-up delay-600">Third</div>
```

## 📊 Database Schema

### Models
- **User** - User accounts with job info and preferences
- **RiskScore** - Historical AI threat assessments (0-100)
- **Alert** - Notifications sent to users
- **Account/Session** - NextAuth.js authentication

### Enums
- `SubscriptionTier`: FREE, PREMIUM
- `RiskLevel`: LOW, MEDIUM, HIGH, CRITICAL
- `AlertType`: NEWS, THREAT, UPDATE, REMINDER

## 🛣️ Roadmap

- [x] Landing page with animations
- [x] Database schema
- [x] Animated logo
- [ ] Supabase setup
- [ ] NextAuth.js (Google OAuth)
- [ ] User dashboard
- [ ] Risk score algorithm
- [ ] Claude AI integration
- [ ] Email alerts (Resend)
- [ ] Stripe payments
- [ ] LinkedIn integration

## 📄 License

MIT - Feel free to use for any purpose.

---

Built with ❤️ to help professionals stay ahead of AI automation.
