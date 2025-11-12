# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Get a WalletConnect Project ID

1. Visit [https://cloud.reown.com](https://cloud.reown.com)
2. Sign up or log in with your account
3. Click "Create New Project"
4. Enter a project name (e.g., "My NFT Dashboard")
5. Copy the Project ID

### Step 2: Configure Environment

1. Open the `.env.local` file in the project root
2. Replace `your_project_id_here` with your actual Project ID:

```
NEXT_PUBLIC_PROJECT_ID=abc123xyz456...
```

### Step 3: Run the Application

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 How to Use

1. **Connect Wallet**: Click the "Connect Wallet" button
2. **Select Base Network**: Make sure your wallet is on Base network
3. **View NFTs**: Your Eggle NFTs will automatically load and display

## 🎨 What You'll See

- **Header**: Shows your wallet address and connection status
- **NFT Grid**: Displays all your NFTs in a responsive 3-column grid
- **NFT Cards**: Each card shows:
  - NFT Image
  - Token ID
  - Health status (with color badges: Green = Good, Red = Bad)
  - Pick Item attribute
  - Additional traits

## ⚙️ Features

- ✅ Real-time wallet connection with AppKit
- ✅ Automatic NFT fetching from Base network
- ✅ Beautiful, responsive dashboard UI
- ✅ Health status color coding
- ✅ Refresh button to reload NFTs
- ✅ Loading and error states
- ✅ Empty state when no NFTs found

## 🔧 Troubleshooting

### "Connect Wallet" button doesn't work
- Make sure you've added a valid Project ID to `.env.local`
- Restart the development server after adding the Project ID

### NFTs not showing up
- Verify your wallet is connected to Base network
- Check that your wallet address owns NFTs from the contract: `0x7e48eeb40d6083d7da004f662cd9a63e0a784d4b`
- Try clicking the "Refresh" button

### Type errors in editor
- These are normal before running `npm install`
- After installation, TypeScript should resolve all types correctly

## 📝 Notes

- The app only displays NFTs from the Eggle contract on Base
- All NFT data is fetched from the Eggle API
- Images are lazy-loaded for better performance
- The app is fully responsive and works on mobile devices

## 🎯 Next Steps

- Customize the UI colors in `tailwind.config.ts`
- Add more attribute displays in `components/NFTCard.tsx`
- Modify the NFT contract address in `lib/api.ts` to show different NFTs

Enjoy your NFT Dashboard! 🎮
