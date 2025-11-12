# 🎮 Hướng Dẫn Sử Dụng - Dashboard NFT Eggle

## 🚀 Bắt Đầu Nhanh

### Bước 1: Lấy Project ID từ WalletConnect

1. Truy cập: https://cloud.reown.com
2. Đăng ký hoặc đăng nhập
3. Click "Create New Project"
4. Đặt tên project (ví dụ: "NFT Dashboard")
5. Copy **Project ID**

### Bước 2: Cấu Hình Environment

Mở file `.env.local` và thay thế:

```bash
# Thay đổi dòng này:
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# Thành Project ID của bạn:
NEXT_PUBLIC_PROJECT_ID=abc123xyz789...
```

### Bước 3: Chạy Ứng Dụng

```bash
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:3000**

## 📱 Cách Sử Dụng Dashboard

### Kết Nối Ví

1. Click nút **"Connect Wallet"**
2. Chọn ví của bạn (MetaMask, Coinbase, WalletConnect...)
3. Đảm bảo ví đang ở **mạng Base** (Chain ID: 8453)
4. Xác nhận kết nối

### Xem NFT Collection

Sau khi kết nối ví thành công:
- Dashboard tự động tải danh sách NFT của bạn
- Hiển thị tất cả NFT trong layout dạng grid
- Mỗi card hiển thị đầy đủ thông tin NFT

### Thông Tin Trên Mỗi NFT Card

- 🖼️ **Ảnh NFT**: Hình ảnh đầy đủ của NFT
- 🏷️ **Token ID**: Mã số duy nhất của NFT
- 🧠 **Health**: Trạng thái sức khỏe
  - Badge màu xanh = Good (Tốt)
  - Badge màu đỏ = Bad (Xấu)
  - Badge màu xám = Unknown (Không rõ)
- 🎒 **Pick Item**: Vật phẩm được chọn
- 📋 **Thuộc Tính Khác**: Các trait bổ sung (nếu có)

### Làm Mới Danh Sách

Click nút **"Refresh"** ở đầu trang để tải lại NFT collection.

## 🎨 Giao Diện

### Responsive Design
- **Desktop**: Hiển thị 3 cột
- **Tablet**: Hiển thị 2 cột
- **Mobile**: Hiển thị 1 cột

### Các Trạng Thái Hiển Thị

1. **Chưa Kết Nối Ví**
   - Hiển thị nút "Connect Wallet"
   - Hướng dẫn kết nối

2. **Đang Tải**
   - Icon loading xoay tròn
   - Text "Loading NFTs..."

3. **Không Có NFT**
   - Icon 🎨
   - Thông báo "No NFTs Found"

4. **Có Lỗi**
   - Icon ⚠️
   - Thông báo lỗi
   - Nút "Try Again"

5. **Hiển Thị NFT**
   - Grid các NFT card
   - Hover effect khi di chuột

## 🔧 Chi Tiết Kỹ Thuật

### Mạng Được Hỗ Trợ
- **Base** (Chain ID: 8453) - DUY NHẤT

### Smart Contract
- Địa chỉ: `0x7e48eeb40d6083d7da004f662cd9a63e0a784d4b`
- Đây là NFT contract của Eggle trên Base

### API Endpoints

1. **Lấy Danh Sách NFT**
   ```
   GET https://pepe-api.eggle.xyz/nft?owner={address}&limit=10000&nftAddresses=0x7e48...
   ```

2. **Lấy Chi Tiết NFT**
   ```
   GET https://pepe-api.eggle.xyz/nft/8453/0x7e48.../[tokenId]
   ```

### Công Nghệ Sử Dụng

| Công nghệ | Mục đích | Phiên bản |
|-----------|----------|-----------|
| Next.js | Framework React | 15.0.3 |
| React | Thư viện UI | 18.3.1 |
| TypeScript | Đảm bảo type | 5.x |
| TailwindCSS | CSS framework | 3.4.1 |
| AppKit | Kết nối ví | 1.2.1 |
| Wagmi | Ethereum hooks | 2.12.17 |

## 📂 Cấu Trúc Project

```
dashboard-eggle-game/
├── app/
│   ├── context/index.tsx       # Cấu hình kết nối ví
│   ├── globals.css             # Style toàn cục
│   ├── layout.tsx              # Layout chính
│   └── page.tsx                # Trang dashboard
├── components/
│   └── NFTCard.tsx             # Component card NFT
├── lib/
│   └── api.ts                  # Hàm gọi API
├── .env.local                  # Biến môi trường
└── package.json                # Dependencies
```

## 🎨 Tùy Chỉnh

### Thay Đổi Màu Sắc

Sửa file `app/globals.css`:
```css
:root {
  --background: #f8fafc;  /* Màu nền */
  --foreground: #0f172a;  /* Màu chữ */
}
```

### Thay Đổi Số Cột Grid

Sửa file `app/page.tsx`:
```tsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```
- `grid-cols-1`: Mobile (1 cột)
- `sm:grid-cols-2`: Tablet (2 cột)
- `lg:grid-cols-3`: Desktop (3 cột)

### Thay Đổi NFT Contract

Sửa file `lib/api.ts`:
```typescript
const NFT_CONTRACT_ADDRESS = "0x7e48...";  // Contract của bạn
```

### Thêm Thuộc Tính Mới

Sửa file `components/NFTCard.tsx` để hiển thị thêm attributes.

## 🐛 Xử Lý Lỗi Thường Gặp

### Không Kết Nối Được Ví

**Nguyên nhân**: Chưa có Project ID hoặc Project ID sai

**Giải pháp**:
1. Kiểm tra file `.env.local`
2. Đảm bảo Project ID đúng
3. Khởi động lại server: `npm run dev`

### Không Hiển Thị NFT

**Nguyên nhân**: 
- Ví không ở mạng Base
- Địa chỉ ví không có NFT

**Giải pháp**:
1. Chuyển ví sang mạng Base
2. Kiểm tra địa chỉ có NFT không
3. Click nút "Refresh"

### Ảnh NFT Không Hiển Thị

**Nguyên nhân**: NFT không có metadata image

**Giải pháp**: Ảnh placeholder sẽ tự động hiển thị

### Lỗi TypeScript

**Nguyên nhân**: Chưa cài đặt dependencies

**Giải pháp**: Chạy `npm install`

## 📊 Các Lệnh Quan Trọng

```bash
# Cài đặt dependencies (đã làm rồi)
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Chạy production
npm start

# Kiểm tra code
npm run lint
```

## 🎯 Tính Năng Đã Hoàn Thành

✅ Kết nối ví với AppKit
✅ Hỗ trợ mạng Base
✅ Tải danh sách NFT từ API
✅ Hiển thị grid responsive
✅ Card NFT với đầy đủ thông tin
✅ Badge màu cho Health status
✅ Hiển thị Pick Item
✅ Loading state
✅ Error handling
✅ Empty state
✅ Nút refresh
✅ TypeScript types
✅ TailwindCSS styling
✅ Hover effects
✅ Responsive mobile

## 🚀 Deploy Lên Production

### Deploy Lên Vercel (Khuyên dùng)

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel

# Nhớ thêm biến môi trường trên Vercel dashboard:
# NEXT_PUBLIC_PROJECT_ID = your_project_id
```

### Các Platform Khác

Có thể deploy lên:
- Netlify
- Railway
- Render
- Bất kỳ platform nào hỗ trợ Next.js

**Quan trọng**: Nhớ thêm `NEXT_PUBLIC_PROJECT_ID` vào environment variables!

## 📖 Tài Liệu Tham Khảo

- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [AppKit Docs](https://docs.reown.com/appkit/overview) - Wallet connection
- [Wagmi Docs](https://wagmi.sh) - Ethereum hooks
- [TailwindCSS Docs](https://tailwindcss.com/docs) - CSS framework
- [Base Network](https://base.org) - Base blockchain

## 💡 Tips & Tricks

### Performance
- Ảnh NFT được tự động optimize bởi Next.js
- Dữ liệu được cache bởi React Query
- Code splitting tự động

### Security
- Không lưu private key
- Chỉ đọc dữ liệu NFT
- Kết nối ví ở client-side

### UX
- Hover effect mượt mà
- Loading states rõ ràng
- Error messages dễ hiểu
- Empty states thân thiện

## 🎓 Học Thêm

### File Nào Làm Gì?

| File | Chức năng | Có nên sửa? |
|------|-----------|-------------|
| `app/page.tsx` | Giao diện chính | ✅ Có |
| `components/NFTCard.tsx` | Card NFT | ✅ Có |
| `lib/api.ts` | API calls | ✅ Có |
| `app/context/index.tsx` | Wallet setup | ⚠️ Nâng cao |
| `tailwind.config.ts` | Cấu hình CSS | ✅ Có |

### Workflow Phát Triển

1. **Chỉnh sửa UI**: Sửa `app/page.tsx`
2. **Chỉnh sửa Card**: Sửa `components/NFTCard.tsx`
3. **Thay đổi API**: Sửa `lib/api.ts`
4. **Thay đổi theme**: Sửa `tailwind.config.ts`
5. **Lưu** → Tự động reload

## ✨ Tổng Kết

### Đã Hoàn Thành
- ✅ Setup project Next.js 15
- ✅ Cài đặt tất cả dependencies
- ✅ Cấu hình AppKit wallet connection
- ✅ Tích hợp API Eggle
- ✅ Xây dựng UI dashboard
- ✅ Responsive design
- ✅ TypeScript types
- ✅ TailwindCSS styling
- ✅ Error handling
- ✅ Loading states

### Cần Làm Trước Khi Chạy
1. ✅ Lấy Project ID từ cloud.reown.com
2. ✅ Thêm vào `.env.local`
3. ✅ Chạy `npm run dev`
4. ✅ Kết nối ví và xem NFT

### Ready to Use! 🎉

Project hoàn toàn sẵn sàng sử dụng. Chỉ cần:
1. Thêm Project ID
2. Chạy dev server
3. Enjoy! 🚀

---

**Chúc bạn code vui vẻ!** 🎮

Nếu cần hỗ trợ, xem các file README.md hoặc SETUP.md để biết thêm chi tiết.
