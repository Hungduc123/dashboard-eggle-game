# NFT Dashboard - Eggle Game

A Next.js 15 dashboard application for viewing your Eggle NFT collection on Base network.

## Features

- 🔗 **Wallet Connection**: Connect your wallet using WalletConnect AppKit (Base chain only)
- 🎨 **NFT Display**: View all your Eggle NFTs in a beautiful grid layout
- 🧠 **Attributes Display**: See NFT attributes like Health status and Pick Items
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast & Modern**: Built with Next.js 15, TypeScript, and TailwindCSS

## Prerequisites

- Node.js 18+ or compatible version
- npm or yarn package manager
- A WalletConnect Project ID (get one at https://cloud.reown.com)

## Installation

1. **Clone or navigate to the project directory:**

```bash
cd dashboard-eggle-game
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

Create a `.env.local` file in the root directory and add your WalletConnect Project ID:

```bash
NEXT_PUBLIC_PROJECT_ID=your_project_id_here
```

To get a Project ID:
- Visit https://cloud.reown.com
- Sign up or log in
- Create a new project
- Copy the Project ID

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
dashboard-eggle-game/
├── app/
│   ├── context/
│   │   └── index.tsx          # AppKit wallet connection setup
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard page
├── components/
│   └── NFTCard.tsx            # NFT card component
├── lib/
│   └── api.ts                 # API functions for fetching NFTs
├── public/                    # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # TailwindCSS configuration
└── next.config.ts             # Next.js configuration
```

## How It Works

1. **Wallet Connection**: Users connect their wallet using WalletConnect AppKit, which is configured to only support the Base network.

2. **NFT Fetching**: Once connected, the app fetches NFT data from the Eggle API:
   - First, it retrieves the list of NFTs owned by the connected wallet
   - Then, it fetches detailed information for each NFT including metadata and attributes

3. **Display**: NFTs are displayed in a responsive grid with:
   - NFT image
   - Token ID
   - Health status (with color-coded badges)
   - Pick Item attribute
   - Additional attributes

## API Endpoints Used

- **NFT List**: `https://pepe-api.eggle.xyz/nft?owner={address}&limit=10000&nftAddresses=0x7e48eeb40d6083d7da004f662cd9a63e0a784d4b`
- **NFT Detail**: `https://pepe-api.eggle.xyz/nft/8453/0x7e48eeb40d6083d7da004f662cd9a63e0a784d4b/{tokenId}`

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **AppKit (WalletConnect)**: Wallet connection library
- **Wagmi**: React hooks for Ethereum
- **React Query**: Data fetching and caching

## Customization

### Changing the NFT Contract

To display NFTs from a different contract, modify the `NFT_CONTRACT_ADDRESS` in `lib/api.ts`:

```typescript
const NFT_CONTRACT_ADDRESS = "0x7e48eeb40d6083d7da004f662cd9a63e0a784d4b";
```

### Styling

All styling is done with TailwindCSS. You can customize colors, spacing, and other design elements in:
- `tailwind.config.ts` for theme configuration
- Component files for specific styling

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Wallet won't connect
- Make sure you have a valid Project ID in `.env.local`
- Check that your wallet supports the Base network
- Try refreshing the page and reconnecting

### NFTs not loading
- Verify your wallet address owns NFTs from the specified contract
- Check browser console for API errors
- Try the "Refresh" button on the dashboard

### Type errors during development
- Run `npm install` to ensure all dependencies are installed
- These errors are normal before installing dependencies

## License

MIT

## Support

For issues or questions, please contact the development team or create an issue in the repository.
