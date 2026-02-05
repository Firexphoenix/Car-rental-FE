# Car Rental UI - Handlebars

Giao diện web quản lý cho thuê xe sử dụng **Handlebars (HBS)** template engine.

## 🚀 Tính Năng

- ✅ Quản lý Xe (Cars)
- ✅ Quản lý Người Dùng (Users)
- ✅ Quản lý Đặt Xe (Bookings)
- ✅ Xem Hợp Đồng (Contracts)
- ✅ Dashboard Quản Trị (Admin)
- ✅ Responsive Design với Bootstrap 5
- ✅ Font Awesome Icons
- ✅ Real-time Data từ API

## 📁 Cấu Trúc Thư Mục

```
CarRental-UI/
├── views/
│   ├── layouts/
│   │   └── main.hbs          # Layout chính
│   ├── partials/             # Components tái sử dụng
│   ├── cars/
│   │   ├── list.hbs          # Danh sách xe
│   │   ├── create.hbs        # Form thêm xe
│   │   └── detail.hbs        # Chi tiết xe
│   ├── users/
│   │   ├── list.hbs          # Danh sách người dùng
│   │   ├── create.hbs        # Form thêm người dùng
│   │   └── detail.hbs        # Chi tiết người dùng
│   ├── bookings/
│   │   ├── list.hbs          # Danh sách đặt xe
│   │   ├── create.hbs        # Form tạo đặt xe
│   │   └── detail.hbs        # Chi tiết đặt xe
│   ├── contracts/
│   │   ├── list.hbs          # Danh sách hợp đồng
│   │   └── detail.hbs        # Chi tiết hợp đồng
│   ├── admin/
│   │   └── dashboard.hbs     # Dashboard quản trị
│   ├── home.hbs              # Trang chủ
│   └── error.hbs             # Trang lỗi
├── public/
│   ├── css/
│   │   └── style.css         # Custom CSS
│   ├── js/
│   │   └── main.js           # Custom JavaScript
│   └── images/               # Hình ảnh
├── server.js                 # Express server
├── package.json
└── README.md
```

## 🛠️ Cài Đặt

### Bước 1: Cài đặt dependencies

```bash
cd CarRental-UI
npm install
```

### Bước 2: Đảm bảo API Server đang chạy

Trước tiên, khởi động API server:

```bash
cd ../Chapter08_LeVuMinhHoang_DE180724
npm install
npm run seed    # Seed dữ liệu mẫu (tùy chọn)
npm start       # Khởi động API server tại port 3000
```

### Bước 3: Khởi động UI Server

```bash
cd ../CarRental-UI
npm start       # Khởi động UI server tại port 8080
```

## 🌐 Truy Cập

- **UI Application**: http://localhost:8080
- **API Server**: http://localhost:3000

## 📱 Các Trang Chính

### 1. Trang Chủ (`/`)
- Tổng quan hệ thống
- Quick stats
- Tính năng nổi bật
- Thao tác nhanh

### 2. Quản Lý Xe (`/cars`)
- **Danh sách**: `/cars`
- **Thêm mới**: `/cars/create`
- **Chi tiết**: `/cars/:id`
- Tìm kiếm và lọc xe
- Upload hình ảnh
- Quản lý trạng thái

### 3. Quản Lý Người Dùng (`/users`)
- **Danh sách**: `/users`
- **Thêm mới**: `/users/create`
- **Chi tiết**: `/users/:id`
- Phân quyền (USER/ADMIN)
- Quản lý trạng thái

### 4. Quản Lý Đặt Xe (`/bookings`)
- **Danh sách**: `/bookings`
- **Tạo mới**: `/bookings/create`
- **Chi tiết**: `/bookings/:id`
- Tính toán giá tự động
- Xác nhận/Hủy booking

### 5. Hợp Đồng (`/contracts`)
- **Danh sách**: `/contracts`
- **Chi tiết**: `/contracts/:id`
- Tự động tạo từ booking

### 6. Dashboard Admin (`/admin/dashboard`)
- Thống kê tổng quan
- Biểu đồ doanh thu
- Thống kê theo trạng thái
- Báo cáo chi tiết

## 🎨 Handlebars Helpers

### Helpers được sử dụng:

```javascript
// So sánh
{{#if (eq value1 value2)}}...{{/if}}

// Format date
{{formatDate dateValue}}          // DD/MM/YYYY
{{formatDateTime dateValue}}      // DD/MM/YYYY HH:MM

// Format currency
{{formatCurrency amount}}         // 1.000.000 ₫

// Status badge color
{{statusBadge status}}            // success, warning, danger, etc.

// Increment
{{inc @index}}                    // index + 1

// JSON stringify
{{json object}}
```

## 🔧 Tùy Chỉnh

### Thay đổi màu sắc

Chỉnh sửa file `public/css/style.css`:

```css
:root {
    --primary-color: #0d6efd;
    --secondary-color: #6c757d;
    /* ... */
}
```

### Thay đổi API URL

Chỉnh sửa file `server.js`:

```javascript
const API_URL = 'http://localhost:3000/api';
```

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "express-handlebars": "^7.1.2",
  "axios": "^1.6.2"
}
```

## 🎯 Tính Năng Nổi Bật

### 1. Responsive Design
- Mobile-first approach
- Bootstrap 5 grid system
- Adaptive layouts

### 2. Real-time Updates
- Fetch API integration
- Async/await pattern
- Error handling

### 3. User Experience
- Toast notifications
- Loading spinners
- Form validation
- Smooth animations

### 4. Modern UI
- Bootstrap 5 components
- Font Awesome icons
- Custom CSS animations
- Professional color scheme

## 🐛 Xử Lý Lỗi

Hệ thống có trang error handler tùy chỉnh:
- 404 - Not Found
- API connection errors
- Validation errors

## 📝 Development

### Chế độ Development

```bash
npm run dev
```

Sử dụng nodemon để auto-reload khi có thay đổi.

## 🔐 Security Notes

- Input validation trên client và server
- XSS protection với Handlebars escaping
- CSRF protection (nên implement)
- Secure headers (nên thêm helmet)

## 📈 Future Enhancements

- [ ] Authentication & Authorization
- [ ] File upload cho hình ảnh
- [ ] Export reports (PDF, Excel)
- [ ] Real-time notifications
- [ ] Advanced search & filters
- [ ] Pagination
- [ ] Chart.js integration
- [ ] Email notifications

## 👨‍💻 Author

**LeVuMinhHoang_DE180724**

## 📄 License

ISC

---

## 🆘 Troubleshooting

### UI không kết nối được API
- Kiểm tra API server đang chạy tại port 3000
- Kiểm tra CORS settings
- Xem console logs

### Views không render
- Kiểm tra cấu trúc thư mục views
- Xem lại config Handlebars trong server.js
- Check file extension (.hbs)

### CSS/JS không load
- Kiểm tra thư mục public
- Verify static middleware config
- Clear browser cache

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Check console logs
2. Verify API is running
3. Check network tab trong DevTools
