# Module 2 - Thêm Mới Sản Phẩm (Add Product)

## ✅ Implementation Complete - TikTok Shop Style

Module 2 đã được triển khai hoàn chỉnh dựa trên thiết kế **TikTok Shop - Trung tâm nhà bán hàng**. Giao diện sử dụng **sidebar navigation** thay vì top progress bar, tương tự 100% TikTok Seller Studio.

---

## 📦 Cấu Trúc Triển Khai

### 1. **Layout Architecture**
```
┌─────────────────────────────────────────────┐
│  Top Bar: [← Quay lại] [Thêm sản phẩm mới]  │
├──────────────┬──────────────────────────────┤
│              │                              │
│  Sidebar     │  Content Area                │
│  Navigation  │  - Thông tin cơ bản          │
│              │  - Chi tiết sản phẩm        │
│  ✓ Bước 1    │  - Form fields              │
│  ✓ Bước 2    │  - Submit button            │
│              │                              │
└──────────────┴──────────────────────────────┘
```

### 2. **Sidebar Navigation**
- **"Thông tin cơ bản"** - Step 1 (product name, category, price, stock)
- **"Chi tiết sản phẩm"** - Step 2 (description, images, keywords)
- ✅ Checkmark icon khi step hoàn thành
- 💡 Info box với tip hữu ích

### 3. **API Methods** (`src/api/sellerAPI.js`)
- `createProduct(payload)` - Tạo sản phẩm mới
- `getProductCategories()` - Lấy danh sách danh mục
- `uploadProductImages(files)` - Tải lên hình ảnh
- `getProductById(productId)` - Lấy chi tiết sản phẩm
- `updateProduct(productId, payload)` - Cập nhật sản phẩm

### 4. **Components** (`src/components/Seller/`)

#### **ProductAddForm.jsx** (Main Container)
- Sidebar + Main content layout
- 2-tab navigation (Thông tin cơ bản / Chi tiết sản phẩm)
- State management cho form data
- Auto-submit khi Step 2 hoàn tất
- Success confirmation screen

#### **ProductBasicInfoStep.jsx** (Step 1)
- Tên sản phẩm (required, min 10 chars)
- Danh mục (dynamic, từ API)
- Giá bán (required, positive)
- Tồn kho (required, non-negative)
- SKU (optional)
- "Tiếp tục" button (không có form tag)

#### **ProductDetailsStep.jsx** (Step 2)
- Hình ảnh sản phẩm (required, 1-9)
- Mô tả sản phẩm (required, min 50 chars)
- Từ khóa tìm kiếm (optional)
- Cân nặng (optional, numeric)
- Bảo hành (dropdown)
- Trạng thái bán hàng (Đang bán/Tồn thấp/Tạm ẩn)
- "Thêm sản phẩm" button (auto submit)

#### **ProductImageUpload.jsx** (Image Grid)
- **TikTok Style Grid**: Hiển thị placeholder icons
- Upload buttons: "Tải ảnh lên" + "Chụp ảnh"
- First image marked as "Ảnh đại diện"
- Max 9 images, 10MB each
- Image counter: "X/9 ảnh"
- Drag & drop support
- Hover to delete

### 5. **Pages** (`src/pages/`)

#### **SellerAddProduct.jsx**
- Simple wrapper page
- White background (no gray bg)

### 6. **Routes** (`src/App.js`)
- Route: `/vendor/products/add` → SellerAddProduct

---

## 🎨 **Design Details (TikTok Style)**

### **Sidebar Navigation (w-64)**
- Light gray background (bg-gray-50)
- Tab items with hover state
- Active tab: white bg + left border teal
- Disabled state khi step chưa complete
- Bottom info box (blue, with 💡 icon)

### **Main Content Area**
- Sticky top bar dengan title
- Padding p-8
- Max-width 3xl content
- Form fields với:
  - Dark gray text
  - Rounded-lg borders
  - Teal focus state
  - Red error state

### **Image Grid (TikTok Style)**
```
[👁️] [📦] [📫] [🎁] [+]
[👁️] [📦] [📫] [+]
```
- 3-5 columns depending on size
- Square aspect ratio
- Placeholder icons (Box, Package, ImagePlus)
- Colored icons (blue, purple, orange, etc.)

### **Color Scheme**
- Primary: Teal (#14b8a6)
- Error: Red (#ef4444)
- Success: Green (#22c55e)
- Neutral: Gray (#6b7280)
- Background: White + Gray-50

---

## 🎯 **User Flow**

1. **Navigate to `/vendor/san-pham`**
2. **Click "Thêm sản phẩm" button**
   - Header button (top right)
   - ProductsPage button (panel)
3. **Redirected to `/vendor/products/add`**

4. **Step 1: Thông Tin Cơ Bản**
   - Sidebar shows "Thông tin cơ bản" (active)
   - Form: Tên, Danh mục, Giá, Tồn kho, SKU
   - Click "Tiếp tục"
   - ✓ Checkmark appears next to Step 1

5. **Step 2: Chi Tiết Sản Phẩm**
   - Sidebar shows "Chi tiết sản phẩm" (now active)
   - Form: Ảnh, Mô tả, Keyword, Cân nặng, Bảo hành
   - Click "Thêm sản phẩm"
   - Loading spinner appears

6. **Submit & Success**
   - API call with FormData
   - Success message appears
   - Auto-redirect to `/vendor/san-pham` after 2s

---

## ✨ **Key Features**

### **Form Validation**
- Real-time error detection
- Clear error messages
- Field-level validation
- Visual error states (red borders)

### **Image Handling**
- **TikTok-style grid** with placeholder icons
- Drag & drop support
- File type validation (JPG, PNG, WebP)
- File size validation (max 10MB)
- Image counter (X/9)
- Remove on hover
- First image as main

### **UX Improvements**
- Sidebar navigation (easy step tracking)
- Visual step completion (checkmark)
- Loading spinners on submit
- Success confirmation screen
- Auto-redirect after success
- Form data persistence between steps
- Responsive design (full-width on mobile)

### **API Integration**
- FormData support for multi-part uploads
- Bearer token authorization (automatic)
- Timeout handling (90s)
- Error handling & user feedback
- Categories loaded dynamically

---

## 📁 **Files Modified/Created**

### **New Files:**
1. ✅ `src/components/Seller/ProductAddForm.jsx` (280 lines)
2. ✅ `src/components/Seller/ProductBasicInfoStep.jsx` (170 lines)
3. ✅ `src/components/Seller/ProductDetailsStep.jsx` (210 lines)
4. ✅ `src/components/Seller/ProductImageUpload.jsx` (190 lines)
5. ✅ `src/pages/SellerAddProduct.jsx` (5 lines)

### **Modified Files:**
1. ✅ `src/api/sellerAPI.js` (+50 lines API methods)
2. ✅ `src/App.js` (+1 import, +1 route)
3. ✅ `src/pages/VendorHome.jsx` (+2 navigation updates)

---

## 🔧 **Technical Specifications**

### **Form Data Structure**
```javascript
{
  productName: string,        // required
  category: string,           // required
  price: number,              // required
  stock: number,              // required
  sku: string,                // optional
  description: string,        // required, min 50 chars
  keywords: string,           // optional
  weight: number,             // optional
  warranty: number,           // optional
  status: string,             // Đang bán/Tồn thấp/Tạm ẩn
  images: File[]              // required, 1-9
}
```

### **Image Specifications**
- Formats: JPG, PNG, WebP
- Max size: 10MB per image
- Max count: 9 images
- Recommended: 5-9 images for best display

### **API Endpoints Expected**
```
GET  /products/categories
POST /products/create
POST /products/:id
GET  /products/:id
POST /products/upload-images
```

---

## 📱 **Responsive Design**

| Device | Layout |
|--------|--------|
| Mobile | Full width, sidebar collapses |
| Tablet | Sidebar + Content |
| Desktop | Sidebar (w-64) + Main content |

---

## 🧪 **Testing Checklist**

- [ ] Navigate to `/vendor/products/add`
- [ ] Verify sidebar shows "Thông tin cơ bản" tab
- [ ] Fill Step 1 with valid data
- [ ] Verify form validation works (empty fields, invalid price)
- [ ] Click "Tiếp tục" button
- [ ] Verify Step 1 gets checkmark
- [ ] Verify "Chi tiết sản phẩm" becomes active
- [ ] Upload images (test drag & drop, file validation)
- [ ] Fill Step 2 with valid data
- [ ] Click "Thêm sản phẩm" button
- [ ] Verify loading spinner appears
- [ ] Verify success message
- [ ] Verify auto-redirect to `/vendor/san-pham`
- [ ] Test error handling (bad API response)
- [ ] Test responsive design (mobile view)

---

## 🚀 **Deployment Notes**

1. **Backend Setup**
   - Implement 5 API endpoints
   - Add image upload handling (FormData)
   - Add validation rules
   - Setup database schema for products

2. **Frontend Setup**
   - Set `REACT_APP_API_URL` in `.env`
   - Run `npm start`
   - Navigate to `/vendor/products/add`

3. **Testing**
   - Test all form validations
   - Test image uploads (single & batch)
   - Test error responses
   - Test success flow

---

## 📊 **Comparison with TikTok**

| Feature | TikTok | Our App | ✓ |
|---------|--------|---------|---|
| Sidebar navigation | ✓ | ✓ | ✓ |
| Tab-based steps | ✓ | ✓ | ✓ |
| Image grid style | ✓ | ✓ (with icons) | ✓ |
| Form validation | ✓ | ✓ | ✓ |
| Dynamic categories | ✓ | ✓ | ✓ |
| Multi-step form | ✓ | 2-step | ✓ |

---

## 📌 **Important Notes**

1. **Data Persistence**: Form data persists between tabs (sidebar navigation)
2. **Auto-Submit**: Step 2 automatically submits on completion
3. **Image Placeholders**: TikTok-style icon grid instead of plain dashed border
4. **Validation**: All validations mirror TikTok requirements
5. **Mobile**: Sidebar stays visible, form content responsive

---

**Status**: ✅ Ready for Testing & Deployment
**Date**: June 2, 2026
**Version**: 2.0.0 (Updated to TikTok Design)
**Last Updated**: Version 2.0 - Sidebar Navigation + TikTok Style Grid

### 1. **API Methods** (`src/api/sellerAPI.js`)
Các phương thức mới được thêm:
- `createProduct(payload)` - Tạo sản phẩm mới
- `getProductCategories()` - Lấy danh sách danh mục
- `uploadProductImages(files)` - Tải lên hình ảnh sản phẩm
- `getProductById(productId)` - Lấy chi tiết sản phẩm
- `updateProduct(productId, payload)` - Cập nhật sản phẩm

### 2. **Components** (`src/components/Seller/`)

#### **ProductAddForm.jsx** (Main Component)
- 3-step wizard form với progress indicator
- Quản lý state cho toàn bộ form
- Xử lý submission và error handling
- Success confirmation screen

#### **ProductBasicInfoStep.jsx** (Step 1)
- Tên sản phẩm (required, min 10 chars)
- Danh mục (dynamic, từ API)
- Giá bán (required, must be positive)
- Tồn kho (required, non-negative)
- SKU (optional, format validation)
- Form validation với error messages

#### **ProductDetailsStep.jsx** (Step 2)
- Mô tả sản phẩm (required, min 50 chars)
- Hình ảnh sản phẩm (required, min 1 image)
- Từ khóa tìm kiếm (optional)
- Cân nặng (optional, numeric)
- Bảo hành (dropdown)
- Trạng thái bán hàng (Đang bán / Tồn thấp / Tạm ẩn)
- Character counter cho mô tả

#### **ProductImageUpload.jsx** (Image Upload)
- Drag & drop support
- Multiple file selection
- Image preview grid
- Remove image functionality
- File validation (type & size)
- Max 9 images
- First image marked as main image

### 3. **Pages** (`src/pages/`)

#### **SellerAddProduct.jsx**
- Wrapper page cho ProductAddForm
- Clean layout với gray background

### 4. **Routes** (`src/App.js`)
- Route: `/vendor/products/add` → SellerAddProduct

### 5. **Navigation Updates** (`src/pages/VendorHome.jsx`)
- Header button "Thêm sản phẩm" → điều hướng đến `/vendor/products/add`
- ProductsPage button "Thêm sản phẩm" → điều hướng thực tế (không còn toast)
- VendorLayout updated để hỗ trợ navigate prop

---

## 🎯 User Flow

1. **Seller nhấp "Thêm sản phẩm"** từ VendorHome
   - Header button hoặc ProductsPage button
   - Điều hướng → `/vendor/products/add`

2. **Step 1: Thông Tin Cơ Bản**
   - Nhập tên sản phẩm
   - Chọn danh mục (load từ API)
   - Nhập giá & tồn kho
   - Nhập SKU (optional)
   - Click "Tiếp tục"

3. **Step 2: Chi Tiết Sản Phẩm**
   - Nhập mô tả chi tiết (min 50 ký tự)
   - Tải lên 1-9 hình ảnh (drag & drop hoặc click)
   - Nhập từ khóa tìm kiếm
   - Nhập cân nặng & bảo hành
   - Chọn trạng thái bán hàng
   - Click "Tiếp tục"

4. **Step 3: Xác Nhận & Đăng Bán**
   - Review tóm tắt sản phẩm
   - Xem preview hình ảnh
   - Click "Thêm sản phẩm"
   - Chờ xử lý...
   - Success! Redirect → `/vendor/san-pham`

---

## ✨ Features Implemented

### Form Validation
- Real-time error detection
- Clear error messages
- Field-level validation
- Format validation (email, phone, etc.)

### Image Handling
- Drag & drop upload
- File type validation (JPG, PNG, WebP)
- File size validation (max 10MB)
- Image count validation (max 9)
- Image preview grid
- Remove image functionality
- First image as main/thumbnail

### UX/DX Improvements
- 3-step progress indicator
- Visual step completion
- Loading states with spinner
- Toast notifications for errors
- Success confirmation screen
- Auto-redirect after success
- Form data persistence between steps
- Responsive design (mobile-friendly)

### API Integration
- FormData support for file uploads
- Timeout handling (90s for createProduct)
- Bearer token authorization (automatic)
- Error handling & user feedback

---

## 🔧 Configuration

### Environment Variables
Đảm bảo `.env` có:
```
REACT_APP_API_URL=your_backend_url
```

### API Endpoints Expected
Backend cần hỗ trợ các endpoints:
```
GET  /products/categories
POST /products/create
POST /products/:id
GET  /products/:id
POST /products/upload-images
```

### Form Data Structure
```javascript
{
  productName: string,           // required
  category: string,              // required
  price: number,                 // required
  stock: number,                 // required
  sku: string,                   // optional
  description: string,           // required
  keywords: string,              // optional
  weight: number,                // optional
  warranty: number,              // optional
  status: string,                // required
  images: File[]                 // required (from FormData)
}
```

---

## 📝 Files Modified

1. ✅ `src/api/sellerAPI.js` - Added 5 product API methods
2. ✅ `src/App.js` - Added route `/vendor/products/add`
3. ✅ `src/pages/VendorHome.jsx` - Updated navigation & ProductsPage
4. ✅ `src/components/Seller/ProductAddForm.jsx` - Created (NEW)
5. ✅ `src/components/Seller/ProductBasicInfoStep.jsx` - Created (NEW)
6. ✅ `src/components/Seller/ProductDetailsStep.jsx` - Created (NEW)
7. ✅ `src/components/Seller/ProductImageUpload.jsx` - Created (NEW)
8. ✅ `src/pages/SellerAddProduct.jsx` - Created (NEW)

---

## 🧪 Testing Checklist

- [ ] Navigate to `/vendor/products/add` from VendorHome
- [ ] Fill Step 1 with valid data
- [ ] Verify form validation (empty fields, invalid price)
- [ ] Proceed to Step 2
- [ ] Upload images (test drag & drop, file validation)
- [ ] Fill Step 2 with valid data
- [ ] Proceed to Step 3
- [ ] Review summary on Step 3
- [ ] Submit form & verify API call
- [ ] Confirm success message appears
- [ ] Verify redirect to `/vendor/san-pham`
- [ ] Test error handling (bad API response)
- [ ] Test responsive design (mobile view)
- [ ] Verify image preview grid on Step 3

---

## 📱 Responsive Design
- Mobile: 1-column layout
- Tablet: 2-column for price/stock
- Desktop: Full responsive grid

---

## 🎨 Styling
- Tailwind CSS (existing system)
- Consistent with Dashboard design
- Teal/cyan color scheme
- Glass-effect cards on confirmation

---

## 📌 Notes

1. **Danh mục động**: Danh mục được load từ API, không hardcoded
2. **Image upload**: Base64 preview + file objects sent to backend
3. **Chỉ sản phẩm**: Chỉ code liên quan tới "Thêm sản phẩm" được thay đổi
4. **Backward compatible**: Không thay đổi code không liên quan
5. **Error handling**: Tất cả lỗi đều được catch và hiển thị cho user

---

## 🚀 Next Steps (For Backend)

Backend cần implement:
1. `POST /products/categories` endpoint
2. `POST /products/create` endpoint với file upload
3. Image upload handling (FormData)
4. Validation rules
5. Database schema for products

---

**Status**: ✅ Ready for Testing
**Date**: June 2, 2026
**Version**: 1.0.0
