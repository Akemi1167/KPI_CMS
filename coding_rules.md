# Tiêu chuẩn Coding cho CMS/Admin dự án quản lý KPI

**Tài liệu áp dụng cho:** CMS/Admin quản lý KPI, bao gồm màn hình đăng nhập admin, quản lý nhân viên, kỳ KPI, danh mục cộng/trừ điểm, nhập KPI event và xem kết quả KPI.  
**Stack đề xuất:** React hoặc Next.js, TypeScript, TailwindCSS hoặc Ant Design, React Hook Form, Zod/Yup, Axios hoặc Fetch wrapper, JWT Authentication.  
**Mục tiêu:** thống nhất cách viết code frontend CMS để giao diện dễ phát triển, dễ bảo trì, dễ review, ít lỗi nghiệp vụ và tích hợp ổn định với API NestJS/MongoDB.

## 1. Nguyên tắc chung

CMS/Admin là khu vực thao tác dữ liệu quan trọng, vì vậy code phải ưu tiên **ổn định, rõ ràng, bảo mật và dễ kiểm soát quyền truy cập**. Các màn hình nhập điểm KPI, xóa event, khóa kỳ KPI hoặc duyệt kết quả đều có ảnh hưởng trực tiếp đến quyền lợi nhân viên, do đó cần có validation, xác nhận thao tác và xử lý lỗi nhất quán.

> CMS không chỉ là giao diện nhập liệu. CMS phải giúp admin thao tác đúng, hạn chế nhập sai, hiển thị rõ trạng thái dữ liệu và không làm lộ token hoặc thông tin nhạy cảm.

| Nguyên tắc | Tiêu chuẩn áp dụng |
|---|---|
| Rõ trách nhiệm | Page xử lý layout và route; component xử lý UI; service xử lý API; hook xử lý state và business UI. |
| Type-safe | Tất cả request, response, form value và table row phải có TypeScript type/interface. |
| Không lặp code | Form field, table, modal, confirm dialog, API client và formatter phải tái sử dụng được. |
| Bảo mật admin | Tất cả màn hình CMS phải kiểm tra token và role admin. |
| UX rõ ràng | Thao tác nguy hiểm như xóa, khóa kỳ, duyệt KPI phải có confirm. |
| Dễ bảo trì | Cấu trúc thư mục theo feature, naming nhất quán, không để component quá lớn. |

## 2. Cấu trúc thư mục chuẩn

CMS nên tổ chức theo hướng **feature-based structure**. Mỗi nghiệp vụ như users, KPI periods, KPI events, KPI results có thư mục riêng để chứa page, component, hook, service và type liên quan. Cách tổ chức này giúp dễ mở rộng khi số lượng màn hình tăng.

```txt
src/
  app/ hoặc pages/
    login/
    dashboard/
    users/
    kpi-periods/
    kpi-event-types/
    kpi-events/
    kpi-results/
  components/
    common/
    layout/
    form/
    table/
    feedback/
  features/
    auth/
      components/
      hooks/
      services/
      types/
    users/
      components/
      hooks/
      services/
      types/
    kpi/
      periods/
      event-types/
      events/
      results/
  lib/
    api/
    auth/
    constants/
    formatters/
    validators/
  hooks/
  styles/
```

| Thư mục | Mục đích |
|---|---|
| `components/common` | Component dùng chung như Button, Modal, EmptyState, PageHeader. |
| `components/layout` | Layout CMS, Sidebar, Header, Breadcrumb, ProtectedLayout. |
| `features/auth` | Logic đăng nhập, lưu token, lấy profile admin. |
| `features/users` | Màn hình và API quản lý nhân viên/admin. |
| `features/kpi` | Màn hình và API quản lý kỳ KPI, event type, event và result. |
| `lib/api` | API client, interceptor, error handler. |
| `lib/auth` | Hàm xử lý token, kiểm tra role, logout. |
| `lib/formatters` | Format ngày, tiền, điểm KPI, phần trăm thưởng. |
| `lib/validators` | Schema validation cho form. |

## 3. Quy tắc đặt tên

Tên file và tên biến phải phản ánh đúng nghiệp vụ. Không đặt tên quá chung chung như `data`, `item`, `handleClick` nếu ngữ cảnh không rõ. Đối với CMS, tên component nên thể hiện rõ màn hình hoặc chức năng.

| Thành phần | Quy tắc | Ví dụ đúng | Không nên dùng |
|---|---|---|---|
| File component | PascalCase hoặc kebab-case thống nhất toàn dự án. | `KpiEventForm.tsx` | `form.tsx` |
| Hook | Bắt đầu bằng `use`. | `useKpiEvents()` | `getKpiEventsHook()` |
| Service | Hậu tố `Service`. | `kpiEventsService.ts` | `apiKpi.ts` |
| Type/Interface | PascalCase. | `KpiEvent`, `CreateKpiEventPayload` | `kpi_event` |
| Biến boolean | Bắt đầu bằng `is`, `has`, `can`, `should`. | `isSubmitting`, `canDelete` | `submitFlag` |
| Event handler | Bắt đầu bằng `handle`. | `handleSubmitForm()` | `submit()` |
| Constant | UPPER_SNAKE_CASE. | `MAX_BONUS_POINTS` | `maxBonus` |

## 4. Chuẩn TypeScript

Tất cả dữ liệu trao đổi với API phải có type rõ ràng. Không dùng `any` trừ khi có lý do đặc biệt và phải comment giải thích. Type response từ API nên tách khỏi type form để tránh truyền thừa dữ liệu không cần thiết.

```ts
export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  employeeCode: string;
  fullName: string;
  email?: string;
  role: UserRole;
  positionName?: string;
  departmentName?: string;
  baseKpiScore: number;
  isActive: boolean;
}

export interface CreateUserPayload {
  employeeCode: string;
  fullName: string;
  email?: string;
  password?: string;
  role: UserRole;
  positionName?: string;
  departmentName?: string;
  baseKpiScore?: number;
}
```

| Quy tắc | Mô tả |
|---|---|
| Không dùng `any` | Ưu tiên `unknown`, interface hoặc generic type. |
| Tách payload và response | `CreateUserPayload` khác với `User`. |
| Dùng union type cho enum nhỏ | Ví dụ `UserRole = 'ADMIN' | 'EMPLOYEE'`. |
| Không mutate object props | Tạo object mới khi cập nhật state. |
| Dùng optional field đúng nghĩa | Không dùng `field?: string` nếu field luôn bắt buộc. |

## 5. Chuẩn API Client

CMS phải gọi API thông qua một API client tập trung. Không gọi `fetch` hoặc `axios` trực tiếp rải rác trong component. API client chịu trách nhiệm gắn token, xử lý lỗi 401, parse response và redirect về login nếu token hết hạn.

```ts
// src/lib/api/apiClient.ts
import axios from 'axios';
import { getAccessToken, clearAuth } from '../auth/tokenStorage';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

| Quy tắc | Tiêu chuẩn |
|---|---|
| Base URL | Lấy từ biến môi trường, không hard-code. |
| Token | Gắn qua interceptor. |
| 401 | Tự logout và redirect login. |
| Timeout | Có timeout hợp lý, ví dụ 30 giây. |
| Error message | Chuẩn hóa trước khi hiển thị cho người dùng. |

## 6. Chuẩn Service gọi API

Mỗi feature phải có service riêng để gom các API liên quan. Component không được tự ghép URL phức tạp. Service phải nhận payload/query rõ ràng và trả về type cụ thể.

```ts
// src/features/kpi/events/services/kpiEventsService.ts
import { apiClient } from '@/lib/api/apiClient';
import { CreateKpiEventPayload, KpiEvent, KpiEventQuery } from '../types';

export const kpiEventsService = {
  findAll(query: KpiEventQuery) {
    return apiClient.get<{ data: KpiEvent[]; meta: PaginationMeta }>('/kpi-events', { params: query });
  },

  create(payload: CreateKpiEventPayload) {
    return apiClient.post<{ data: KpiEvent }>('/kpi-events', payload);
  },

  remove(id: string) {
    return apiClient.delete<{ data: { success: boolean } }>(`/kpi-events/${id}`);
  },
};
```

Service không nên chứa logic UI như toast, modal hoặc redirect. Những logic đó nên đặt ở hook hoặc component.

## 7. Chuẩn Auth Admin trong CMS

CMS chỉ dành cho admin, vì vậy sau khi login phải kiểm tra `role === 'ADMIN'`. Nếu user không phải admin, hệ thống phải logout và hiển thị thông báo không có quyền truy cập. Token không nên lưu trong biến global không kiểm soát. Nếu dùng localStorage, cần hiểu rằng token có rủi ro XSS; nếu hệ thống yêu cầu bảo mật cao hơn, nên dùng httpOnly cookie từ backend.

```ts
export function requireAdmin(user?: AuthUser | null) {
  return Boolean(user && user.role === 'ADMIN');
}
```

| Thành phần | Tiêu chuẩn |
|---|---|
| Login page | Public, không yêu cầu token. |
| Admin layout | Bắt buộc có token và role `ADMIN`. |
| Logout | Xóa token, xóa profile, redirect `/login`. |
| Token expired | Tự động logout khi API trả `401`. |
| Menu CMS | Chỉ hiển thị menu theo quyền của user. |

## 8. Chuẩn Protected Route/Layout

Tất cả trang CMS, ngoại trừ `/login`, phải nằm trong `ProtectedLayout`. Layout này kiểm tra trạng thái auth trước khi render nội dung. Khi đang kiểm tra token, hiển thị loading thay vì nháy màn hình.

```tsx
export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <PageLoading />;
  }

  if (!user || user.role !== 'ADMIN') {
    logout();
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
```

## 9. Chuẩn Form

Form trong CMS nên dùng React Hook Form kết hợp Zod hoặc Yup để validate. Không validate thủ công rải rác trong component. Mỗi form nên có schema riêng, default values rõ ràng và mapping dữ liệu trước khi submit.

```ts
import { z } from 'zod';

export const createKpiEventSchema = z.object({
  userId: z.string().min(1, 'Vui lòng chọn nhân viên'),
  periodId: z.string().min(1, 'Vui lòng chọn kỳ KPI'),
  eventTypeId: z.string().min(1, 'Vui lòng chọn loại cộng/trừ điểm'),
  quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
  note: z.string().max(1000, 'Ghi chú tối đa 1000 ký tự').optional(),
  evidenceUrl: z.string().url('Link bằng chứng không hợp lệ').optional().or(z.literal('')),
});

export type CreateKpiEventFormValues = z.infer<typeof createKpiEventSchema>;
```

| Quy tắc | Mô tả |
|---|---|
| Field bắt buộc | Phải có message rõ ràng. |
| Submit | Disable button khi `isSubmitting = true`. |
| Lỗi API | Hiển thị ở đầu form hoặc field tương ứng. |
| Reset form | Reset sau khi tạo thành công nếu phù hợp. |
| Confirm | Dùng confirm modal cho thao tác nguy hiểm. |

## 10. Chuẩn Table/List

Các màn hình danh sách như nhân viên, KPI events và KPI results phải có phân trang. Không tải toàn bộ dữ liệu nếu không cần thiết. Table nên hỗ trợ filter theo kỳ KPI, nhân viên, loại event và trạng thái.

| Màn hình | Filter nên có |
|---|---|
| Users | Từ khóa, role, trạng thái active. |
| KPI Periods | Năm, trạng thái. |
| KPI Event Types | Loại `BONUS/PENALTY`, trạng thái active. |
| KPI Events | Kỳ KPI, nhân viên, loại cộng/trừ, ngày phát sinh. |
| KPI Results | Kỳ KPI, nhân viên, xếp loại, trạng thái. |

```tsx
<KpiEventsTable
  data={events}
  loading={isLoading}
  pagination={pagination}
  onChangePage={handleChangePage}
  onDelete={handleDeleteEvent}
/>
```

Table không nên tự gọi API. Table chỉ nhận props và phát sự kiện ra ngoài. Việc fetch dữ liệu nên đặt trong hook hoặc page container.

## 11. Chuẩn Component

Component phải nhỏ, rõ mục đích và dễ tái sử dụng. Nếu một component dài hơn khoảng 200–300 dòng, nên xem xét tách thành component con. Component presentational không nên biết chi tiết API.

| Loại component | Trách nhiệm |
|---|---|
| Page component | Lấy query route, gọi hook, sắp layout. |
| Container component | Quản lý state nghiệp vụ của một màn hình. |
| Form component | Render form, validate và emit submit. |
| Table component | Render dữ liệu dạng bảng, emit action. |
| Modal component | Hiển thị form hoặc confirm. |
| Common component | UI dùng chung, không phụ thuộc nghiệp vụ. |

```tsx
export interface KpiResultBadgeProps {
  rating: string;
}

export function KpiResultBadge({ rating }: KpiResultBadgeProps) {
  const color = getRatingColor(rating);
  return <span className={color}>{rating}</span>;
}
```

## 12. Chuẩn State Management

Không đưa toàn bộ state vào global store. Chỉ những dữ liệu dùng xuyên suốt như auth user, sidebar state hoặc app settings mới nên để global. Dữ liệu danh sách, filter, loading và form state nên để tại page/hook.

| Loại state | Nơi lưu đề xuất |
|---|---|
| Access token/profile | Auth store hoặc auth provider. |
| Sidebar collapsed | UI store. |
| Filter table | URL query hoặc local state của page. |
| Form value | React Hook Form. |
| API cache | React Query/SWR nếu dự án sử dụng. |
| Modal open/close | Local state. |

Nếu dùng React Query hoặc SWR, cần đặt query key rõ ràng theo feature và filter để tránh cache sai dữ liệu.

## 13. Chuẩn hiển thị điểm KPI

Điểm KPI, điểm cộng, điểm trừ và tỷ lệ thưởng phải format thống nhất. Điểm phạt nên hiển thị màu đỏ, điểm cộng màu xanh, điểm cuối cùng có badge theo xếp loại.

| Dữ liệu | Cách hiển thị |
|---|---|
| Điểm cộng | `+3`, màu xanh. |
| Điểm trừ | `-5`, màu đỏ. |
| Final score | `105 điểm`, badge theo rating. |
| Bonus rate | `150%`, `120%`, `100%`, `50%`, `0%`. |
| Kỳ KPI | `01/2026` hoặc `KPI tháng 01/2026`. |

```ts
export function formatKpiPoint(value: number) {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

export function formatBonusRate(value: number) {
  return `${Math.round(value * 100)}%`;
}
```

## 14. Chuẩn xử lý lỗi UI

CMS phải hiển thị lỗi theo cách dễ hiểu với admin. Không hiển thị raw error object, stack trace hoặc message kỹ thuật quá dài. Nếu API trả lỗi validation, frontend nên map về field tương ứng nếu có thể.

| Tình huống | Cách xử lý UI |
|---|---|
| 400 validation | Hiển thị message gần form. |
| 401 token hết hạn | Logout và chuyển về login. |
| 403 không đủ quyền | Hiển thị trang không có quyền. |
| 404 dữ liệu không tồn tại | Hiển thị empty state hoặc message. |
| 500 lỗi server | Toast lỗi chung và ghi log frontend nếu có. |

```ts
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
  }
  return 'Có lỗi xảy ra, vui lòng thử lại';
}
```

## 15. Chuẩn Loading, Empty và Confirm

Mỗi màn hình danh sách phải có trạng thái loading, empty và error. Các thao tác nguy hiểm phải có confirm modal. Không cho phép admin click nhiều lần khi request đang chạy.

| Trạng thái | UI cần có |
|---|---|
| Loading lần đầu | Skeleton hoặc page loading. |
| Loading khi submit | Disable button và hiển thị spinner. |
| Empty list | Empty state có hướng dẫn tạo dữ liệu. |
| Error | Message rõ ràng và nút thử lại. |
| Delete/Lock/Approve | Confirm modal trước khi gọi API. |

## 16. Chuẩn phân quyền hiển thị UI

Không chỉ backend cần phân quyền; CMS cũng phải ẩn các nút không phù hợp để tránh thao tác sai. Tuy nhiên, frontend chỉ là lớp hỗ trợ UX, backend vẫn phải kiểm tra quyền bắt buộc.

| Điều kiện | UI action |
|---|---|
| Kỳ KPI `OPEN` | Cho phép thêm/xóa KPI event. |
| Kỳ KPI `LOCKED` hoặc `CLOSED` | Ẩn hoặc disable nút thêm/xóa event. |
| Result `LOCKED` | Không cho tính lại KPI. |
| User inactive | Không cho nhập KPI mới. |
| Role không phải admin | Không cho vào CMS. |

## 17. Chuẩn biến môi trường CMS

Các cấu hình môi trường phải đặt trong `.env` và có `.env.example`. Không hard-code API URL, app name hoặc cấu hình runtime trong source code.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KPI Management CMS
```

| Biến | Mục đích |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL backend API. |
| `NEXT_PUBLIC_APP_NAME` | Tên hiển thị của CMS. |

## 18. Chuẩn bảo mật frontend

Frontend không được lưu dữ liệu nhạy cảm không cần thiết. Nếu token lưu ở localStorage, phải hạn chế tối đa rủi ro XSS bằng cách không render HTML không tin cậy, không dùng `dangerouslySetInnerHTML` và validate mọi URL đầu vào.

| Quy tắc | Tiêu chuẩn |
|---|---|
| Không render HTML lạ | Tránh `dangerouslySetInnerHTML`. |
| Không log token | Không `console.log` token hoặc response auth. |
| Không commit `.env` thật | Chỉ commit `.env.example`. |
| Kiểm tra URL bằng chứng | Validate URL trước khi submit. |
| Logout rõ ràng | Xóa token và profile khi logout. |

## 19. Chuẩn format code

Dự án CMS nên dùng ESLint và Prettier. Trước khi merge code, developer phải chạy lint và build. Nếu TypeScript báo lỗi, không được bỏ qua bằng `// @ts-ignore` trừ khi có lý do rất rõ ràng.

| Quy tắc | Tiêu chuẩn |
|---|---|
| Indent | 2 spaces. |
| Quote | Single quote. |
| Semicolon | Có semicolon. |
| Component | Function component. |
| Props | Khai báo interface riêng. |
| Import | Sắp xếp theo external, alias, relative. |
| CSS class | Không lặp class quá dài; tách component nếu cần. |

## 20. Chuẩn Git và Pull Request

Mỗi pull request nên tập trung vào một tính năng hoặc một bug. Không gom nhiều thay đổi không liên quan vào cùng PR. Commit message nên rõ ràng để dễ truy vết.

| Loại commit | Ví dụ |
|---|---|
| Feature | `feat(cms): add kpi event management page` |
| Fix | `fix(auth): redirect expired token to login` |
| Refactor | `refactor(users): split user form component` |
| Style | `style(cms): update table spacing` |
| Docs | `docs(cms): add coding standards` |

Checklist trước khi tạo PR gồm: code đã format, không còn lỗi TypeScript, không còn console log thừa, API error đã xử lý, form đã validate, màn hình có loading/empty/error state và thao tác nguy hiểm có confirm.

## 21. Checklist review code CMS

Reviewer cần kiểm tra cả UI, logic, bảo mật và khả năng bảo trì. Checklist này nên được dùng thống nhất trong team để tránh lỗi lặp lại.

| Hạng mục | Câu hỏi kiểm tra |
|---|---|
| Cấu trúc | File có nằm đúng feature/module không? |
| TypeScript | Có dùng `any` không cần thiết không? |
| Component | Component có quá lớn hoặc quá nhiều trách nhiệm không? |
| Form | Có validation đầy đủ không? |
| API | Có gọi API qua service không? |
| Auth | Trang CMS có protected route chưa? |
| Error | Lỗi API có hiển thị thân thiện không? |
| Loading | Có loading state khi fetch/submit không? |
| Permission | Nút nguy hiểm có bị disable khi kỳ KPI khóa không? |
| Security | Có log token hoặc render HTML không an toàn không? |

## 22. Kết luận

Coding standard cho CMS cần tập trung vào sự nhất quán và an toàn khi thao tác dữ liệu. Với dự án quản lý KPI, phần quan trọng nhất là kiểm soát quyền admin, validate form nhập điểm, hiển thị trạng thái kỳ KPI rõ ràng và xử lý API lỗi một cách nhất quán. Khi team tuân thủ tài liệu này, CMS sẽ dễ mở rộng, ít lỗi vận hành và thuận tiện hơn cho việc review code.
