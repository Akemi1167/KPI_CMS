# KPI Management CMS

Hệ thống quản trị KPI được xây dựng với Next.js 16, TypeScript và Tailwind CSS. Frontend kết nối tới NestJS API backend theo tài liệu `cms_api.md`.

## Tính năng

- **Đăng nhập ADMIN** — Bearer token lưu trong `localStorage`
- **Quản lý người dùng** — CRUD nhân viên và tài khoản
- **Kỳ KPI** — Tạo, sửa, đóng kỳ KPI
- **Loại sự kiện KPI** — Cấu hình cộng/trừ điểm
- **Sự kiện KPI** — Ghi nhận cộng/trừ điểm cho nhân viên
- **Kết quả KPI** — Xem bảng xếp hạng và thưởng theo kỳ
- **Giao diện** — Hỗ trợ tiếng Việt, English, 中文 và chế độ sáng/tối

## Yêu cầu

- Node.js 20+
- NestJS API backend chạy tại `API_PROXY_TARGET` (mặc định `http://localhost:1111/api`)
- Frontend gọi `/api/*` qua Next.js proxy để tránh lỗi CORS trên trình duyệt
- Cổng nhân viên (`/employee`) gọi `/bff/employee/*` — Next.js dùng tài khoản ADMIN service (`API_SERVICE_EMAIL` / `API_SERVICE_PASSWORD`) để truy vấn API thay mặt nhân viên

## Bắt đầu

```bash
# Cài đặt dependencies
npm install

# Sao chép biến môi trường
cp .env.example .env.local

# Chạy development server
npm run dev
```

Mở [http://localhost:3000/login](http://localhost:3000/login) để đăng nhập. Chỉ tài khoản có `role: ADMIN` mới truy cập được `/admin`.

Tài khoản mặc định (theo seed backend): `admin@example.com` / `Admin@123`

## Cấu trúc dự án

```
src/
├── app/
│   ├── admin/              # Trang quản trị KPI
│   └── login/              # Đăng nhập
├── components/
│   ├── cms/                # UI patterns (DataTable, PageHeader...)
│   ├── layout/             # Admin layout, sidebar, topbar
│   └── ui/                 # Primitives (Button, Input...)
├── features/
│   ├── auth/               # Đăng nhập, AuthProvider
│   ├── users/              # Quản lý người dùng
│   └── kpi/                # KPI periods, events, results...
├── lib/
│   ├── api/                # Axios client + error helpers
│   └── auth/               # Token storage, requireAdmin
└── types/
    └── api.ts              # Types theo cms_api.md
```

## Tài liệu

- `cms_api.md` — Đặc tả API backend
- `coding_rules.md` — Quy ước code frontend

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) — HTTP client
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — Form validation
- [Lucide React](https://lucide.dev/) — Icons
