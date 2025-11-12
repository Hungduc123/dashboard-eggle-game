# 🚀 Quick Reference Card

## ⚡ Start in 30 Seconds

```bash
# 1. Get Project ID from https://cloud.reown.com

# 2. Add to .env.local
NEXT_PUBLIC_PROJECT_ID=your_id_here

# 3. Run
npm run dev

# 4. Open http://localhost:3000
```

## 📁 Key Files to Know

| File | Purpose | Edit? |
|------|---------|-------|
| `app/page.tsx` | Main dashboard UI | ✅ Customize |
| `components/NFTCard.tsx` | NFT card display | ✅ Customize |
| `lib/api.ts` | API & types | ✅ Change contract |
| `app/context/index.tsx` | Wallet setup | ⚠️ Advanced |
| `.env.local` | Project ID | ✅ Required |

## 🎨 Customization Hot Spots

### Change Colors
📝 **File**: `app/globals.css`
```css
:root {
  --background: #f8fafc;  /* Your color */
  --foreground: #0f172a;  /* Your color */
}
```

### Change Grid Columns
📝 **File**: `app/page.tsx` (line ~186)
```tsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                         ^change these^
```

### Change NFT Contract
📝 **File**: `lib/api.ts` (line ~37)
```typescript
const NFT_CONTRACT_ADDRESS = "0x7e48...";  // Your contract
```

### Add More Badges
📝 **File**: `components/NFTCard.tsx` (line ~57+)
```tsx
{/* Add new attribute display here */}
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Wallet won't connect" | Add Project ID to `.env.local` |
| "No NFTs showing" | Check wallet is on Base network |
| "Images broken" | Normal - placeholder will show |
| "Type errors" | Run `npm install` |
| "Can't start server" | Port 3000 in use? Use `PORT=3001 npm run dev` |

## 📊 Project Stats

- **Files**: 19 source files
- **Dependencies**: 8 production + 9 dev
- **Lines of Code**: ~800 lines
- **Components**: 3 main components
- **API Functions**: 5 utility functions
- **Type Interfaces**: 5 TypeScript types

## 🎯 Features Checklist

- [x] Wallet connection (AppKit)
- [x] Base network only
- [x] NFT grid display
- [x] Health badges (color-coded)
- [x] Pick item display
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Refresh button
- [x] TypeScript types
- [x] TailwindCSS styles

## 📱 Responsive Breakpoints

- **Mobile**: `< 640px` → 1 column
- **Tablet**: `640px - 1024px` → 2 columns
- **Desktop**: `> 1024px` → 3 columns

## 🔗 Important Links

- **WalletConnect**: https://cloud.reown.com
- **Base Network**: https://base.org
- **Eggle API**: https://pepe-api.eggle.xyz
- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS**: https://tailwindcss.com

## 🎓 Learn More

| Topic | File to Study |
|-------|---------------|
| Wallet connection | `app/context/index.tsx` |
| API calls | `lib/api.ts` |
| UI layout | `app/page.tsx` |
| Card design | `components/NFTCard.tsx` |
| Styling | `app/globals.css` |

## 📝 Environment Variables

```bash
# Required
NEXT_PUBLIC_PROJECT_ID=xxx  # From cloud.reown.com

# Optional (already set in code)
# NFT_CONTRACT_ADDRESS=0x7e48...
# CHAIN_ID=8453
# API_BASE_URL=https://pepe-api.eggle.xyz
```

## 🚀 Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code quality
```

## 🎨 Color Palette Used

- **Background**: `#f8fafc` (slate-50)
- **Primary**: `#2563eb` (blue-600)
- **Success**: `#10b981` (green-500)
- **Error**: `#ef4444` (red-500)
- **Text**: `#0f172a` (slate-900)
- **Borders**: `#e5e7eb` (gray-200)

## 📦 Build Output

```bash
npm run build
# Outputs optimized production build to .next/
# Can be deployed to Vercel, Netlify, etc.
```

## ⚡ Performance

- ✅ Image optimization (Next.js Image)
- ✅ Code splitting (automatic)
- ✅ Lazy loading
- ✅ React Query caching
- ✅ TailwindCSS purging

---

**Quick Start**: Edit `.env.local` → `npm run dev` → Open browser
**Deploy**: `vercel` or any Next.js hosting
**Customize**: Start with `app/page.tsx` and `components/NFTCard.tsx`
