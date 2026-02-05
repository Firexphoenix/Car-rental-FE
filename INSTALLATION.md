# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY CAR RENTAL UI

## 📋 YÊU CẦU HỆ THỐNG

- Node.js (v14 trở lên)
- npm hoặc yarn
- MongoDB (đang chạy)

## 🚀 CÁCH CÀI ĐẶT VÀ CHẠY

### BƯỚC 1: Cài đặt và chạy API Server (Backend)

```bash
# Di chuyển vào thư mục API
cd Chapter08_LeVuMinhHoang_DE180724

# Cài đặt dependencies
npm install

# Tạo file .env (nếu chưa có)
# Thêm nội dung sau vào file .env:
# MONGODB_URI=mongodb://localhost:27017/car-rental
# PORT=3000

# Seed dữ liệu mẫu (tùy chọn nhưng khuyến khích)
npm run seed

# Khởi động API server
npm start
```

API Server sẽ chạy tại: **http://localhost:3000**

### BƯỚC 2: Cài đặt và chạy UI Server (Frontend)

Mở terminal/cmd mới:

```bash
# Di chuyển vào thư mục UI
cd CarRental-UI

# Cài đặt dependencies
npm install

# Khởi động UI server
npm start

# Hoặc dùng development mode với auto-reload
npm run dev
```

UI Server sẽ chạy tại: **http://localhost:8080**

### BƯỚC 3: Truy cập ứng dụng

Mở trình duyệt và truy cập:
- **UI Application**: http://localhost:8080
- **API Documentation**: http://localhost:3000

## 📁 CẤU TRÚC PROJECT

```
.
├── Chapter08_LeVuMinhHoang_DE180724/    # API Server (Backend)
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── config/
│   ├── seedData.js
│   ├── package.json
│   └── server.js
│
└── CarRental-UI/                         # UI Server (Frontend)
    ├── views/
    │   ├── layouts/
    │   ├── cars/
    │   ├── users/
    │   ├── bookings/
    │   ├── contracts/
    │   └── admin/
    ├── public/
    │   ├── css/
    │   └── js/
    ├── server.js
    └── package.json
```

## 🎯 TÍNH NĂNG CHÍNH

### 1. Quản Lý Xe (Cars)
- Xem danh sách xe
- Thêm xe mới
- Chỉnh sửa thông tin xe
- Xóa xe
- Tìm kiếm và lọc xe

### 2. Quản Lý Người Dùng (Users)
- Xem danh sách người dùng
- Thêm người dùng mới
- Xem chi tiết người dùng
- Phân quyền (USER/ADMIN)

### 3. Quản Lý Đặt Xe (Bookings)
- Tạo đặt xe mới
- Xem danh sách đặt xe
- Xác nhận/Hủy đặt xe
- Tính toán giá tự động

### 4. Hợp Đồng (Contracts)
- Xem danh sách hợp đồng
- Chi tiết hợp đồng
- Tự động tạo khi booking confirmed

### 5. Dashboard Admin
- Thống kê tổng quan
- Báo cáo doanh thu
- Biểu đồ phân tích

## 🔧 TROUBLESHOOTING

### Lỗi: Cannot connect to API

**Nguyên nhân**: API server chưa chạy hoặc chạy sai port

**Giải pháp**:
```bash
# Kiểm tra API server đang chạy
cd Chapter08_LeVuMinhHoang_DE180724
npm start

# Kiểm tra port trong server.js (phải là 3000)
```

### Lỗi: Views không hiển thị

**Nguyên nhân**: Sai cấu trúc thư mục hoặc extension

**Giải pháp**:
- Kiểm tra tất cả file trong views/ có đuôi .hbs
- Kiểm tra cấu hình Handlebars trong server.js
- Clear cache và reload browser

### Lỗi: MongoDB connection failed

**Nguyên nhân**: MongoDB chưa chạy

**Giải pháp**:
```bash
# Khởi động MongoDB (Windows)
net start MongoDB

# Khởi động MongoDB (Mac/Linux)
sudo systemctl start mongod
```

### Lỗi: Module not found

**Nguyên nhân**: Chưa cài dependencies

**Giải pháp**:
```bash
# Cài lại dependencies
npm install

# Hoặc xóa node_modules và cài lại
rm -rf node_modules
npm install
```

## 🌐 API ENDPOINTS

### Cars
- GET `/api/cars` - Lấy danh sách xe
- GET `/api/cars/:id` - Lấy chi tiết xe
- POST `/api/cars` - Thêm xe mới
- PUT `/api/cars/:id` - Cập nhật xe
- DELETE `/api/cars/:id` - Xóa xe

### Users
- GET `/api/users` - Lấy danh sách users
- GET `/api/users/:id` - Lấy chi tiết user
- POST `/api/users` - Thêm user mới
- PUT `/api/users/:id` - Cập nhật user
- DELETE `/api/users/:id` - Xóa user

### Bookings
- GET `/api/bookings` - Lấy danh sách bookings
- GET `/api/bookings/:id` - Lấy chi tiết booking
- POST `/api/bookings` - Tạo booking mới
- PATCH `/api/bookings/:id` - Cập nhật status
- DELETE `/api/bookings/:id` - Xóa booking

### Contracts
- GET `/api/contracts` - Lấy danh sách contracts
- GET `/api/contracts/:id` - Lấy chi tiết contract

### Admin
- GET `/api/admin/bookings/total` - Tổng số bookings
- GET `/api/admin/bookings/stats` - Thống kê chi tiết
- GET `/api/admin/bookings/overview` - Tổng quan

## 🎨 CÔNG NGHỆ SỬ DỤNG

### Frontend
- **Handlebars (HBS)** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Axios** - HTTP client
- **Vanilla JavaScript** - Client-side logic

### Backend (Reference)
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

## 📝 GHI CHÚ

1. **Port mặc định**:
   - API: 3000
   - UI: 8080

2. **Database**: MongoDB phải đang chạy

3. **Data mẫu**: Chạy `npm run seed` trong thư mục API để có dữ liệu test

4. **Browser**: Khuyến khích dùng Chrome hoặc Firefox phiên bản mới

## 🔐 SECURITY

- Input validation trên cả client và server
- XSS protection với Handlebars auto-escaping
- Nên thêm CSRF protection cho production
- Implement authentication/authorization

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra console logs (browser và server)
2. Verify API đang chạy: curl http://localhost:3000
3. Check MongoDB: mongosh
4. Review Network tab trong DevTools

## 👨‍💻 DEVELOPER

**LeVuMinhHoang_DE180724**

---

**Chúc bạn thành công! 🚀**
