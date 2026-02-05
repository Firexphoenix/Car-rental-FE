const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8080;
const API_URL = process.env.API_URL;
const DEFAULT_IMAGE = "/image/car.jpg";
// Cấu hình Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      eq: (a, b) => a === b,

      // ✅ THÊM HELPER NÀY
      gt: (a, b) => a > b, // Greater than (lớn hơn)
      now: () => new Date(),
      formatDate: (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("vi-VN");
      },
      formatDateTime: (date) => {
        if (!date) return "";
        return new Date(date).toLocaleString("vi-VN");
      },
      formatCurrency: (amount) => {
        if (!amount) return "0";
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount);
      },
      statusBadge: (status) => {
        const badges = {
          AVAILABLE: "success",
          RENTED: "warning",
          MAINTENANCE: "info",
          UNAVAILABLE: "secondary",
          ACTIVE: "success",
          INACTIVE: "secondary",
          BANNED: "danger",
          PENDING: "warning",
          CONFIRMED: "success",
          CANCELLED: "danger",
          COMPLETED: "info",
        };
        return badges[status] || "secondary";
      },
      inc: (value) => parseInt(value) + 1,
      json: (context) => JSON.stringify(context),
      firstImage: (images) => {
        if (images && Array.isArray(images) && images.length > 0 && images[0]) {
          return images[0];
        }
        return DEFAULT_IMAGE;
      },
    },
  }),
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Routes
app.get("/", async (req, res) => {
  console.log("==================================================");
  console.log("⚡ [DASHBOARD] Bắt đầu tải dữ liệu trang chủ...");

  try {
    // 1. Gọi song song 4 API để tiết kiệm thời gian
    // Lưu ý: Nếu Backend chưa có route /admin/bookings/total thì dùng /bookings và đếm mảng
    const [carsRes, bookingsRes, contractsRes, usersRes] = await Promise.all([
      apiClient.get("/cars").catch((err) => ({ error: err.message, data: [] })),
      apiClient
        .get("/bookings")
        .catch((err) => ({ error: err.message, data: [] })), // Hoặc dùng /admin/bookings/total nếu có
      apiClient
        .get("/contracts")
        .catch((err) => ({ error: err.message, data: [] })),
      apiClient
        .get("/users")
        .catch((err) => ({ error: err.message, data: [] })),
    ]);

    // 2. Hàm hỗ trợ đếm số lượng an toàn (Dù API trả về mảng hay object cũng đếm được)
    const getCount = (response, name) => {
      if (response.error) {
        console.error(`❌ [${name}] Lỗi gọi API: ${response.error}`);
        return 0;
      }

      const data = response.data;
      // Log để bạn xem cấu trúc trả về là gì
      console.log(
        `🔍 [${name}] Data nhận được:`,
        Array.isArray(data) ? `Mảng ${data.length} phần tử` : data,
      );

      if (Array.isArray(data)) return data.length; // Nếu là mảng [..]
      if (data.data && Array.isArray(data.data)) return data.data.length; // Nếu là { data: [..] }
      if (data.cars && Array.isArray(data.cars)) return data.cars.length; // Nếu là { cars: [..] }
      if (typeof data === "number") return data; // Nếu trả về số trực tiếp: 10
      if (data.total) return data.total; // Nếu trả về { total: 10 }

      return 0;
    };

    // 3. Tính toán số liệu
    const stats = {
      totalCars: getCount(carsRes, "CARS"),
      totalBookings: getCount(bookingsRes, "BOOKINGS"),
      totalContracts: getCount(contractsRes, "CONTRACTS"),
      totalUsers: getCount(usersRes, "USERS"),
    };

    console.log("✅ [DASHBOARD] Số liệu cuối cùng render ra view:", stats);

    // 4. Render ra View và truyền số liệu vào
    res.render("home", {
      title: "Trang Chủ - Car Rental",
      page: "home",
      ...stats, // Truyền toàn bộ biến stats (totalCars, totalBookings...) sang HBS
    });
  } catch (error) {
    console.error("❌ [DASHBOARD] Lỗi nghiêm trọng:", error.message);
    // Nếu lỗi vẫn render trang chủ nhưng số liệu là 0
    res.render("home", {
      title: "Trang Chủ",
      page: "home",
      totalCars: 0,
      totalBookings: 0,
      totalContracts: 0,
      totalUsers: 0,
    });
  }
});

// User Routes
app.get("/users", async (req, res) => {
  console.log("------------------------------------------------");
  console.log("⚡ [FE] Bắt đầu gọi API lấy danh sách User...");

  try {
    const response = await apiClient.get("/users");

    // 1. Log cấu trúc dữ liệu để kiểm tra
    console.log(
      "🔍 [FE] User Data từ API:",
      JSON.stringify(response.data, null, 2),
    );

    // 2. Xử lý chuẩn hóa dữ liệu về dạng Mảng (Array)
    let usersList = [];
    if (Array.isArray(response.data)) {
      usersList = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Trường hợp API trả về { data: [...] }
      usersList = response.data.data;
    } else if (response.data.users && Array.isArray(response.data.users)) {
      // Trường hợp API trả về { users: [...] }
      usersList = response.data.users;
    }

    console.log(`📦 [FE] Số lượng User hiển thị: ${usersList.length}`);

    // 3. Render ra View
    res.render("users/list", {
      title: "Danh Sách Người Dùng",
      page: "users",
      users: usersList, // Truyền biến đã xử lý
    });
  } catch (error) {
    console.error("❌ [FE] Lỗi lấy danh sách User:", error.message);
    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải danh sách người dùng",
      error: error.message,
    });
  }
});

app.get("/users/create", (req, res) => {
  res.render("users/create", {
    title: "Thêm Người Dùng Mới",
    page: "users",
  });
});

app.get("/users/:id", async (req, res) => {
  try {
    console.log(`🔍 [FE] Xem chi tiết User ID: ${req.params.id}`);

    const response = await apiClient.get(`/users/${req.params.id}`);

    // ✅ XỬ LÝ DATA ĐÚNG (API trả về { success: true, data: {...} })
    let userData = response.data;
    if (response.data.data) {
      userData = response.data.data;
    }

    console.log(`✅ [FE] User data:`, JSON.stringify(userData, null, 2));

    res.render("users/detail", {
      title: "Chi Tiết Người Dùng",
      page: "users",
      user: userData, // ← Truyền userData thay vì response.data
    });
  } catch (error) {
    console.error("❌ [FE] Lỗi:", error.message);

    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }

    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải thông tin người dùng",
      error: error.message,
    });
  }
});

// Car Routes
// app.js (Frontend)

// Tìm đến đoạn Car Routes và sửa route /cars
app.get("/cars", async (req, res) => {
  console.log("------------------------------------------------");
  console.log("⚡ [FE] Bắt đầu gọi API lấy danh sách xe...");
  console.log(`🔗 URL mục tiêu: ${apiClient.defaults.baseURL}/cars`);

  try {
    const response = await apiClient.get("/cars");

    // 👇 THÊM DÒNG NÀY ĐỂ XEM CẤU TRÚC JSON
    console.log(
      "🔍 [FE] Cấu trúc dữ liệu thực tế:",
      JSON.stringify(response.data, null, 2),
    );

    // 👇 SỬA ĐOẠN XỬ LÝ DỮ LIỆU (Tự động tìm mảng)
    let carsList = [];
    if (Array.isArray(response.data)) {
      carsList = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Trường hợp API trả về { message: "...", data: [...] }
      carsList = response.data.data;
    } else if (response.data.cars && Array.isArray(response.data.cars)) {
      // Trường hợp API trả về { cars: [...] }
      carsList = response.data.cars;
    }

    console.log(`📦 [FE] Số lượng xe sau khi xử lý: ${carsList.length}`);

    res.render("cars/list", {
      title: "Danh Sách Xe",
      page: "cars",
      cars: carsList, // Truyền biến carsList đã xử lý vào view
    });
  } catch (error) {
    console.error("❌ [FE] LỖI GỌI API:");

    // Kiểm tra chi tiết lỗi
    if (error.response) {
      // Server đã trả về response nhưng báo lỗi (404, 500...)
      console.error("   👉 Status:", error.response.status);
      console.error("   👉 Data:", error.response.data);
    } else if (error.request) {
      // Đã gửi request nhưng không nhận được phản hồi (thường là sai Port/IP)
      console.error(
        "   👉 Không nhận được phản hồi (Sai IP/Port hoặc Server chưa bật)",
      );
      console.error("   👉 Chi tiết:", error.code); // Log mã lỗi quan trọng (ECONNREFUSED)
    } else {
      console.error("   👉 Lỗi setup:", error.message);
    }

    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải danh sách xe",
      error: `Chi tiết lỗi log tại server console: ${error.message}`,
    });
  }
});

app.get("/cars/create", async (req, res) => {
  try {
    const usersResponse = await apiClient.get("/users");

    let usersList = [];
    if (Array.isArray(usersResponse.data)) {
      usersList = usersResponse.data;
    } else if (usersResponse.data.data) {
      usersList = usersResponse.data.data;
    }

    res.render("cars/create", {
      title: "Thêm Xe Mới",
      page: "cars",
      users: usersList,
    });
  } catch (error) {
    console.error("Lỗi khi tải trang thêm xe:", error.message);
    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải trang thêm mới",
      error: error.message,
    });
  }
});

// ✅ THÊM ROUTE NÀY - Chi tiết xe
app.get("/cars/:id", async (req, res) => {
  try {
    console.log(`🔍 [FE] Xem chi tiết xe ID: ${req.params.id}`);

    const response = await apiClient.get(`/cars/${req.params.id}`);

    // Xử lý dữ liệu trả về
    let carData = response.data;
    if (response.data.data) {
      carData = response.data.data;
    }

    console.log(
      `✅ [FE] Đã tải thông tin xe: ${carData.brand} ${carData.model}`,
    );

    res.render("cars/detail", {
      title: "Chi Tiết Xe",
      page: "cars",
      car: carData,
    });
  } catch (error) {
    console.error("❌ [FE] Lỗi khi tải chi tiết xe:", error.message);
    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải thông tin xe",
      error: error.message,
    });
  }
});

app.get("/cars/:id/edit", async (req, res) => {
  try {
    const carId = req.params.id;

    // 1. Gọi 2 API cùng lúc: Lấy thông tin xe & Lấy danh sách user (để hiện dropdown chủ xe)
    const [carResponse, usersResponse] = await Promise.all([
      apiClient.get(`/cars/${carId}`),
      apiClient.get("/users"),
    ]);

    // 2. Xử lý dữ liệu trả về (đề phòng API trả về dạng {data: ...} hoặc trả thẳng)
    const carData = carResponse.data.data || carResponse.data;

    // Lấy danh sách users và lọc bỏ user hiện tại nếu cần, hoặc lấy hết
    let usersList = [];
    if (Array.isArray(usersResponse.data)) {
      usersList = usersResponse.data;
    } else if (usersResponse.data.data) {
      usersList = usersResponse.data.data;
    }

    // 3. Render trang edit.hbs
    res.render("cars/edit", {
      title: "Cập Nhật Xe",
      page: "cars",
      car: carData,
      users: usersList,
    });
  } catch (error) {
    console.error("Lỗi khi tải trang sửa xe:", error.message);
    res.status(500).render("error", {
      message: "Không thể tải trang cập nhật xe",
      error: error.message,
    });
  }
});

// Booking Routes
app.get("/bookings", async (req, res) => {
  console.log("------------------------------------------------");
  console.log("⚡ [FE] Bắt đầu gọi API lấy danh sách Booking...");

  try {
    const response = await apiClient.get("/bookings");

    // 1. Log cấu trúc dữ liệu để kiểm tra
    console.log(
      "🔍 [FE] Booking Data từ API:",
      JSON.stringify(response.data, null, 2),
    );

    // 2. Xử lý chuẩn hóa dữ liệu về dạng Mảng (Array)
    // Giúp code chạy được dù API trả về [..] hay { data: [..] }
    let bookingsList = [];
    if (Array.isArray(response.data)) {
      bookingsList = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      bookingsList = response.data.data;
    } else if (
      response.data.bookings &&
      Array.isArray(response.data.bookings)
    ) {
      bookingsList = response.data.bookings;
    }

    console.log(`📦 [FE] Số lượng Booking hiển thị: ${bookingsList.length}`);

    // 3. Render ra View
    res.render("bookings/list", {
      title: "Danh Sách Đặt Xe",
      page: "bookings",
      bookings: bookingsList, // Truyền biến đã xử lý
    });
  } catch (error) {
    console.error("❌ [FE] Lỗi lấy danh sách Booking:", error.message);
    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải danh sách đặt xe",
      error: error.message,
    });
  }
});

app.get("/bookings/create", async (req, res) => {
  console.log("------------------------------------------------");
  console.log("⚡ [FE] Bắt đầu tải form tạo đặt xe...");

  try {
    const [usersResponse, carsResponse] = await Promise.all([
      apiClient.get("/users"),
      apiClient.get("/cars"),
    ]);

    // 1. Log để kiểm tra cấu trúc data
    console.log(
      "🔍 [FE] Users Data:",
      JSON.stringify(usersResponse.data, null, 2),
    );
    console.log(
      "🔍 [FE] Cars Data:",
      JSON.stringify(carsResponse.data, null, 2),
    );

    // 2. Xử lý chuẩn hóa Users data
    let usersList = [];
    if (Array.isArray(usersResponse.data)) {
      usersList = usersResponse.data;
    } else if (
      usersResponse.data.data &&
      Array.isArray(usersResponse.data.data)
    ) {
      usersList = usersResponse.data.data;
    } else if (
      usersResponse.data.users &&
      Array.isArray(usersResponse.data.users)
    ) {
      usersList = usersResponse.data.users;
    }

    // 3. Xử lý chuẩn hóa Cars data
    let carsList = [];
    if (Array.isArray(carsResponse.data)) {
      carsList = carsResponse.data;
    } else if (
      carsResponse.data.data &&
      Array.isArray(carsResponse.data.data)
    ) {
      carsList = carsResponse.data.data;
    } else if (
      carsResponse.data.cars &&
      Array.isArray(carsResponse.data.cars)
    ) {
      carsList = carsResponse.data.cars;
    }

    console.log(`📦 [FE] Users: ${usersList.length}, Cars: ${carsList.length}`);

    // 4. Lọc chỉ lấy xe có trạng thái AVAILABLE
    const availableCars = carsList.filter((car) => car.status === "AVAILABLE");
    console.log(`✅ [FE] Xe khả dụng: ${availableCars.length}`);

    res.render("bookings/create", {
      title: "Tạo Đặt Xe Mới",
      page: "bookings",
      users: usersList, // ← Truyền mảng đã xử lý
      cars: availableCars, // ← Chỉ truyền xe AVAILABLE
    });
  } catch (error) {
    console.error("❌ [FE] Lỗi tải form đặt xe:", error.message);

    if (error.response) {
      console.error("   👉 Status:", error.response.status);
      console.error("   👉 Data:", error.response.data);
    }

    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải form đặt xe",
      error: error.message,
    });
  }
});

app.get("/bookings/:id", async (req, res) => {
  try {
    console.log(`🔍 [FE] Xem chi tiết Booking ID: ${req.params.id}`);

    const response = await apiClient.get(`/bookings/${req.params.id}`);

    // Log để debug
    console.log(
      "🔍 [FE] Booking Response:",
      JSON.stringify(response.data, null, 2),
    );

    // ✅ XỬ LÝ DATA ĐÚNG (API trả về { success: true, data: {...} })
    let bookingData = response.data;
    if (response.data.data) {
      bookingData = response.data.data;
    }

    console.log(`✅ [FE] Booking loaded: ${bookingData._id}`);

    res.render("bookings/detail", {
      title: "Chi Tiết Đặt Xe",
      page: "bookings",
      booking: bookingData, // ← Truyền bookingData đã xử lý
    });
  } catch (error) {
    console.error("❌ [FE] Lỗi tải booking detail:", error.message);

    if (error.response) {
      console.error("   👉 Status:", error.response.status);
      console.error("   👉 Data:", error.response.data);
    }

    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải thông tin đặt xe",
      error: error.message,
    });
  }
});

// Contract Routes
app.get("/contracts", async (req, res) => {
  console.log("------------------------------------------------");
  console.log("⚡ [FE] Bắt đầu gọi API lấy danh sách Hợp đồng...");

  try {
    const response = await apiClient.get("/contracts");

    // 1. Log để kiểm tra cấu trúc API trả về
    console.log(
      "🔍 [FE] Contract Data từ API:",
      JSON.stringify(response.data, null, 2),
    );

    // 2. Xử lý chuẩn hóa dữ liệu về dạng Mảng (Array)
    let contractsList = [];
    if (Array.isArray(response.data)) {
      contractsList = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Trường hợp API trả về { data: [...] }
      contractsList = response.data.data;
    } else if (
      response.data.contracts &&
      Array.isArray(response.data.contracts)
    ) {
      // Trường hợp API trả về { contracts: [...] }
      contractsList = response.data.contracts;
    }

    console.log(`📦 [FE] Số lượng Hợp đồng hiển thị: ${contractsList.length}`);

    // 3. Render ra View
    res.render("contracts/list", {
      title: "Danh Sách Hợp Đồng",
      page: "contracts",
      contracts: contractsList, // Truyền biến mảng đã xử lý
    });
  } catch (error) {
    console.error("❌ [FE] Lỗi lấy danh sách Hợp đồng:", error.message);
    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải danh sách hợp đồng",
      error: error.message,
    });
  }
});

app.get("/contracts/:id", async (req, res) => {
  try {
    console.log(`🔍 [FE] Xem chi tiết Hợp đồng ID: ${req.params.id}`);
    const response = await apiClient.get(`/contracts/${req.params.id}`);

    // Log kiểm tra data
    // console.log("Data nhận được:", JSON.stringify(response.data, null, 2));

    // 👇 Xử lý lấy data thật từ vỏ bọc
    const contractData = response.data.data || response.data;

    res.render("contracts/detail", {
      title: "Chi Tiết Hợp Đồng",
      page: "contracts",
      contract: contractData, // Truyền biến đã xử lý
    });
  } catch (error) {
    console.error("❌ Lỗi tải chi tiết hợp đồng:", error.message);
    res.render("error", {
      title: "Lỗi",
      message: "Không thể tải thông tin hợp đồng",
      error: error.message,
    });
  }
});

// Admin Dashboard
app.get("/admin/dashboard", async (req, res) => {
  console.log("------------------------------------------------");
  console.log("⚡ [FE] Bắt đầu tải Dashboard...");

  try {
    const [overviewResponse, statsResponse] = await Promise.all([
      apiClient.get("/admin/bookings/overview"),
      apiClient.get("/admin/bookings/stats"),
    ]);

    // Log để debug
    console.log(
      "🔍 [FE] Overview Response:",
      JSON.stringify(overviewResponse.data, null, 2),
    );
    console.log(
      "🔍 [FE] Stats Response:",
      JSON.stringify(statsResponse.data, null, 2),
    );

    // ✅ Xử lý data (API trả về { success: true, data: {...} })
    const overview = overviewResponse.data.data || overviewResponse.data;
    const stats = statsResponse.data.data || statsResponse.data;

    console.log(`✅ [FE] Total bookings: ${overview.totalBookings}`);
    console.log(`✅ [FE] Stats count: ${stats.length}`);

    res.render("admin/dashboard", {
      title: "Dashboard Quản Trị",
      page: "admin",
      overview: overview, // ← Truyền object với các field riêng
      stats: stats, // ← Truyền array
    });
  } catch (error) {
    console.error("❌ [FE] Lỗi tải dashboard:", error.message);

    if (error.response) {
      console.error("   👉 Status:", error.response.status);
      console.error("   👉 Data:", error.response.data);
    }

    // Render với dữ liệu rỗng
    res.render("admin/dashboard", {
      title: "Dashboard Quản Trị",
      page: "admin",
      overview: {
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
      },
      stats: [],
    });
  }
});

// Error handler
app.use((req, res) => {
  res.status(404).render("error", {
    title: "404 - Không Tìm Thấy",
    message: "Trang bạn tìm kiếm không tồn tại",
    error: "Page not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 UI Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📡 API Server tại ${API_URL}`);
});
