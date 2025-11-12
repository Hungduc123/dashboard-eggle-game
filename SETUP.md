# 🎮 NFT Dashboard - Setup Instructions

## ✅ Project Successfully Created!

Your Next.js 15 NFT Dashboard is ready to use. Here's everything you need to know:

## 📦 What's Included

### Core Files
- **`app/page.tsx`**: Main dashboard page with wallet connection and NFT display
- **`app/context/index.tsx`**: WalletConnect AppKit configuration
- **`components/NFTCard.tsx`**: Reusable NFT card component
- **`lib/api.ts`**: API utilities for fetching NFT data

### Configuration
- **`package.json`**: All dependencies installed
- **`tsconfig.json`**: TypeScript configuration
- **`tailwind.config.ts`**: TailwindCSS styling
- **`next.config.ts`**: Next.js settings (enables remote images)

### Documentation
- **`README.md`**: Complete project documentation
- **`QUICKSTART.md`**: Quick start guide
- **`SETUP.md`**: This file

## 🚀 How to Run

### 1. Get WalletConnect Project ID (REQUIRED)

Before running the app, you MUST get a Project ID from WalletConnect:

1. Go to: https://cloud.reown.com
2. Create an account or sign in
3. Click "Create New Project"
4. Give it a name (e.g., "NFT Dashboard")
5. Copy the **Project ID**

### 2. Add Project ID to Environment

Edit the `.env.local` file and replace the placeholder:

```bash
# Change this:
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# To your actual Project ID:
NEXT_PUBLIC_PROJECT_ID=abc123xyz789...
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## 🎯 Using the Dashboard

### Connect Your Wallet

1. Click **"Connect Wallet"** button
2. Choose your wallet (MetaMask, WalletConnect, Coinbase Wallet, etc.)
3. Make sure you're on **Base Network** (Chain ID: 8453)
4. Approve the connection

### View Your NFTs

Once connected, the dashboard will:
- Automatically fetch your NFTs from the Eggle contract
- Display them in a responsive grid layout
- Show NFT images, Token IDs, and attributes

### NFT Card Information

Each NFT card displays:
- 🖼️ **NFT Image**: Full image preview
- 🏷️ **Token ID**: Unique identifier
- 🧠 **Health**: Status with color coding
  - Green badge = Good health
  - Red badge = Bad health
  - Gray badge = Unknown
- 🎒 **Pick Item**: Item attribute
- 📋 **Additional Attributes**: Other traits (if available)

### Refresh NFTs

Click the **"Refresh"** button at the top to reload your NFT collection.

## 🎨 UI Features

### Responsive Design
- **Desktop**: 3-column grid
- **Tablet**: 2-column grid
- **Mobile**: 1-column grid (stacked)

### Visual States
- **Not Connected**: Shows connection prompt
- **Loading**: Animated spinner while fetching
- **No NFTs**: Friendly message if wallet is empty
- **Error**: Clear error message with retry button
- **Success**: Beautiful grid of NFT cards

### Hover Effects
- Cards lift up with shadow on hover
- Images scale slightly on hover
- Smooth transitions throughout

## 🔧 Technical Details

### Supported Networks
- **Base** (Chain ID: 8453) - ONLY

### NFT Contract
- Address: `0x7e48eeb40d6083d7da004f662cd9a63e0a784d4b`
- This is the Eggle NFT contract on Base

### API Endpoints
- List: `https://pepe-api.eggle.xyz/nft?owner={address}&limit=10000&nftAddresses=...`
- Detail: `https://pepe-api.eggle.xyz/nft/8453/{contract}/{tokenId}`

### Technologies
- **Next.js 15**: App Router, Server Components
- **React 18**: Client-side interactivity
- **TypeScript**: Type safety
- **TailwindCSS**: Utility-first styling
- **AppKit**: WalletConnect v2
- **Wagmi**: Ethereum React hooks
- **React Query**: Data fetching

## 🔄 Development Workflow

### Install Dependencies (Already Done)
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 🎨 Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --background: #f8fafc;  /* Change background */
  --foreground: #0f172a;  /* Change text color */
}
```

### Modify Grid Layout
Edit `app/page.tsx` grid classes:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Change column numbers */}
</div>
```

### Add More Attributes
Edit `components/NFTCard.tsx` to display additional NFT traits.

### Change NFT Contract
Edit `lib/api.ts`:
```typescript
const NFT_CONTRACT_ADDRESS = "0x7e48..."; // Your contract
```

## 📱 Testing

### Test with Different Wallets
- MetaMask
- Coinbase Wallet
- WalletConnect compatible wallets
- Rainbow Wallet
- Trust Wallet

### Test Scenarios
1. ✅ Connect wallet
2. ✅ View NFTs
3. ✅ Disconnect wallet
4. ✅ Reconnect wallet
5. ✅ Refresh NFTs
6. ✅ Empty wallet (no NFTs)
7. ✅ Network switching

## 🐛 Common Issues

### Wallet Won't Connect
- **Check**: Project ID in `.env.local` is correct
- **Fix**: Restart dev server after adding Project ID
- **Fix**: Clear browser cache and retry

### NFTs Not Loading
- **Check**: Wallet is on Base network
- **Check**: Wallet address owns NFTs from the contract
- **Fix**: Click refresh button
- **Fix**: Check browser console for errors

### Images Not Showing
- **Reason**: Some NFTs may not have images in metadata
- **Fix**: Placeholder image will display automatically

### TypeScript Errors
- **When**: During development before `npm install`
- **Fix**: Run `npm install` to get type definitions
- **Note**: Errors should disappear after installation

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# NEXT_PUBLIC_PROJECT_ID = your_project_id
```

### Other Platforms
The app can be deployed to:
- Netlify
- Railway
- Render
- Any platform supporting Next.js

**Important**: Add `NEXT_PUBLIC_PROJECT_ID` to environment variables!

## 📊 Project Structure

```
dashboard-eggle-game/
├── app/
│   ├── context/
│   │   └── index.tsx          # AppKit setup
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard
├── components/
│   └── NFTCard.tsx            # NFT card component
├── lib/
│   └── api.ts                 # API functions
├── public/
│   └── placeholder-nft.png    # Fallback image
├── .env.local                 # Environment variables
├── .eslintrc.json             # ESLint config
├── next.config.ts             # Next.js config
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── README.md                  # Documentation
```

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [AppKit Docs](https://docs.reown.com/appkit/overview)
- [Wagmi Docs](https://wagmi.sh)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Base Network](https://base.org)

## ✨ Features Summary

✅ Wallet connection with AppKit
✅ Base network support
✅ NFT fetching from Eggle API
✅ Responsive grid layout
✅ Beautiful card design
✅ Health status badges
✅ Pick item display
✅ Loading states
✅ Error handling
✅ Empty states
✅ Hover effects
✅ Refresh functionality
✅ TypeScript type safety
✅ TailwindCSS styling
✅ Next.js 15 App Router
✅ Image optimization

## 🎉 You're All Set!

Your NFT Dashboard is ready to use. Just:
1. Add your WalletConnect Project ID to `.env.local`
2. Run `npm run dev`
3. Open http://localhost:3000
4. Connect your wallet and enjoy!

---

**Happy coding! 🚀**

If you need help or have questions, check the README.md or create an issue.
