# CMS UI/UX Rules

**Phiên bản:** 1.0  
**Phạm vi:** CMS/Admin Dashboard  
**Mục tiêu:** Tạo một bộ quy tắc thiết kế UI/UX thống nhất để dùng ngay từ đầu cho dự án CMS mới. File này nên được đặt tại thư mục gốc dự án với tên `CMS_UI_UX_RULES.md`, `DESIGN.md` hoặc `cms-ui-rules.md` để designer, frontend developer, backend developer và AI coding assistant cùng dùng làm chuẩn tham chiếu.

## 1. Tư duy thiết kế tổng thể

CMS phải được thiết kế như một **công cụ vận hành hằng ngày**, không phải một landing page hoặc website quảng bá. Giao diện cần ưu tiên tốc độ thao tác, khả năng đọc dữ liệu, khả năng lọc/tìm kiếm, tính nhất quán và hạn chế lỗi vận hành. Mọi quyết định UI cần phục vụ người dùng quản trị thực hiện công việc nhanh hơn, ít nhầm lẫn hơn và dễ đối soát hơn.

> **Nguyên tắc cốt lõi:** CMS tốt là CMS giúp người vận hành biết họ đang ở đâu, đang xử lý dữ liệu gì, hành động nào quan trọng nhất và hệ thống đang phản hồi trạng thái nào.

| Nguyên tắc | Cách áp dụng trong CMS |
|---|---|
| **Rõ ràng hơn đẹp mắt** | Ưu tiên hierarchy, label, trạng thái, validation và thông tin thao tác hơn hiệu ứng trang trí |
| **Tối giản nhưng đủ thông tin** | Không nhồi quá nhiều dữ liệu cùng cấp; không xóa bớt thông tin quan trọng để giao diện trống đẹp |
| **Nhất quán tuyệt đối** | Button, table, filter, form, modal, drawer, badge và message phải dùng chung quy tắc |
| **An toàn vận hành** | Các thao tác liên quan tiền, điểm, thưởng, trạng thái user cần xác nhận, phân quyền và audit rõ ràng |
| **Ít scroll không cần thiết** | Form dài cần chia nhóm, field ngắn dùng grid, footer action nên sticky |
| **Dễ quét dữ liệu** | Table phải có alignment, badge, spacing và fixed action hợp lý |

## 2. Phong cách giao diện

CMS sử dụng phong cách **Minimal Modern Admin Dashboard**. Nền chính sáng, màu trung tính, đường viền nhẹ, typography rõ ràng, màu nhấn dùng tiết chế cho CTA và trạng thái. Giao diện không dùng quá nhiều gradient, shadow nặng, animation phức tạp hoặc màu sắc quá rực gây mỏi mắt khi vận hành lâu.

| Thành phần | Quy tắc thiết kế |
|---|---|
| Nền chính | Dùng trắng hoặc xám rất nhạt, ví dụ `#F7F8FA` |
| Surface/card | Dùng trắng `#FFFFFF`, border nhẹ thay vì shadow nặng |
| Primary color | Chỉ dùng cho hành động chính và trạng thái active quan trọng |
| Radius | Vừa phải, ưu tiên 6–10px cho input/card/button, không quá tròn |
| Shadow | Hạn chế; chỉ dùng cho dropdown, popover, modal |
| Motion | Nhẹ, nhanh, mục đích là phản hồi trạng thái, không trang trí |

## 3. Design tokens cơ bản

Design tokens là nền tảng để FE triển khai thống nhất. Không được hardcode màu, spacing, font-size tùy tiện trong từng màn hình. Nếu cần biến thể mới, phải thêm vào token hoặc component variant trước.

### 3.1. Color tokens

| Token | Giá trị gợi ý | Mục đích |
|---|---:|---|
| `color.bg.page` | `#F7F8FA` | Nền tổng thể CMS |
| `color.bg.surface` | `#FFFFFF` | Nền card, table, modal |
| `color.bg.subtle` | `#F3F4F6` | Nền phụ, hover nhẹ |
| `color.text.primary` | `#111827` | Text chính |
| `color.text.secondary` | `#4B5563` | Text phụ |
| `color.text.muted` | `#9CA3AF` | Placeholder, meta text |
| `color.border.default` | `#E5E7EB` | Border mặc định |
| `color.border.strong` | `#D1D5DB` | Border nhấn |
| `color.primary` | `#E11D48` | CTA chính hoặc màu thương hiệu |
| `color.primary.hover` | `#BE123C` | Hover CTA chính |
| `color.success` | `#16A34A` | Trạng thái thành công |
| `color.warning` | `#D97706` | Cảnh báo |
| `color.danger` | `#DC2626` | Lỗi, xóa, khóa |
| `color.info` | `#2563EB` | Thông tin |

### 3.2. Typography tokens

CMS ưu tiên font sans-serif dễ đọc như Inter, SF Pro, Roboto hoặc system font. Không dùng quá nhiều font family. Font size trong table và form cần vừa đủ để tiết kiệm không gian nhưng không gây khó đọc.

| Token | Giá trị gợi ý | Mục đích |
|---|---:|---|
| `font.family.base` | `Inter, system-ui, sans-serif` | Font chính |
| `font.size.xs` | `12px` | Meta, badge nhỏ |
| `font.size.sm` | `13px` | Table, helper text |
| `font.size.base` | `14px` | Form, nội dung chính |
| `font.size.md` | `16px` | Section title |
| `font.size.lg` | `20px` | Page title |
| `font.weight.regular` | `400` | Nội dung thường |
| `font.weight.medium` | `500` | Label, button |
| `font.weight.semibold` | `600` | Title, emphasis |

### 3.3. Spacing tokens

Spacing phải theo scale cố định để CMS nhìn gọn và nhất quán. Không dùng padding quá lớn làm màn hình dài không cần thiết.

| Token | Giá trị | Mục đích |
|---|---:|---|
| `space.1` | `4px` | Khoảng cách rất nhỏ |
| `space.2` | `8px` | Icon/text, compact gap |
| `space.3` | `12px` | Field nội bộ |
| `space.4` | `16px` | Gap mặc định |
| `space.5` | `20px` | Section nhỏ |
| `space.6` | `24px` | Page/card padding |
| `space.8` | `32px` | Section lớn |

## 4. Layout tổng thể CMS

CMS dùng bố cục **sidebar + topbar + content area**. Sidebar quản lý điều hướng chính, topbar xử lý breadcrumb, search, notification và tài khoản. Content area phải có page header, filter/action area và nội dung chính.

| Khu vực | Quy tắc |
|---|---|
| Sidebar | Rộng 220–260px desktop, có trạng thái active rõ ràng, nhóm menu theo nghiệp vụ |
| Topbar | Cao 56–64px, chỉ chứa thông tin cần thiết, không nhồi quá nhiều action |
| Content area | Padding 24px desktop, 16px màn hình nhỏ, max width tùy loại trang |
| Page header | Gồm title, mô tả ngắn nếu cần, primary action ở bên phải |
| Breadcrumb | Dùng cho module nhiều cấp, không thay thế title |

### 4.1. Sidebar rules

Menu sidebar phải được nhóm theo nghiệp vụ, tránh sắp xếp theo thứ tự phát sinh tính năng. Label cần ngắn, dễ hiểu và thống nhất ngôn ngữ. Nếu menu có nhiều module, cần section title như **Tổng quan**, **Người dùng**, **Live & Sự kiện**, **Phần thưởng**, **Nhiệm vụ**, **Báo cáo**, **Cấu hình**.

| Trạng thái sidebar | Hiển thị |
|---|---|
| Default | Icon + label trung tính |
| Hover | Nền nhẹ, text rõ hơn |
| Active | Nền primary nhạt hoặc border left primary |
| Disabled | Opacity thấp, không click |
| Collapsed | Chỉ icon, tooltip khi hover |

### 4.2. Page header rules

Mỗi trang CMS phải có page header nhất quán. Title cần nói đúng nghiệp vụ, không dùng title chung chung. Primary action chỉ có một hành động chính nổi bật.

| Thành phần | Ví dụ |
|---|---|
| Title | `Quản lý chương trình lì xì` |
| Description | `Tạo và theo dõi các chương trình phát thưởng cho người dùng.` |
| Primary action | `Tạo chương trình` |
| Secondary action | `Export`, `Import`, `Làm mới` |

## 5. Table/Data list rules

Table là thành phần quan trọng nhất của CMS. Table phải giúp admin quét dữ liệu nhanh, lọc nhanh và thao tác an toàn. Không được thiết kế table như một danh sách card nếu dữ liệu có nhiều cột cần so sánh.

| Thành phần table | Quy tắc |
|---|---|
| Header | Có font weight medium, nền nhẹ hoặc trắng, border bottom rõ |
| Row height | 44–56px tùy density |
| Text alignment | Text trái, số phải, trạng thái giữa hoặc trái tùy ngữ cảnh |
| Primary column | Đặt bên trái, có thể sticky nếu table rộng |
| Action column | Đặt cuối, nên sticky right nếu table nhiều cột |
| Status | Dùng badge, không chỉ dùng text màu |
| Pagination | Đặt cuối table, hiển thị tổng số record |
| Empty state | Có mô tả và action tiếp theo nếu phù hợp |
| Loading | Skeleton hoặc table loading, không làm layout nhảy |

### 5.1. Filter rules

Filter phải đặt trên table và chia thành filter cơ bản/advanced nếu có nhiều điều kiện. Không được để filter chiếm quá nhiều chiều cao làm table bị đẩy xuống.

| Loại filter | Quy tắc |
|---|---|
| Search | Nằm bên trái, placeholder rõ như `Tìm theo UID, tên, số điện thoại` |
| Select status | Dùng dropdown ngắn, có option `Tất cả` |
| Date range | Dùng preset `Hôm nay`, `7 ngày`, `30 ngày` nếu dữ liệu vận hành theo thời gian |
| Advanced filter | Đưa vào popover/drawer nếu có trên 5 filter |
| Reset filter | Luôn có khi filter đang active |

### 5.2. Bulk action rules

Bulk action chỉ hiện khi user chọn record. Các hành động nguy hiểm như xóa, khóa, cộng tiền hàng loạt phải có modal xác nhận và mô tả hậu quả.

| Bulk action | Yêu cầu UX |
|---|---|
| Export selected | Xác nhận nhẹ hoặc chạy ngay |
| Change status | Modal xác nhận, hiển thị số lượng record |
| Delete/ban | Modal danger, yêu cầu nhập xác nhận nếu rủi ro cao |
| Distribute reward | Modal review, hiển thị tổng tiền/quà/code dự kiến phát |

## 6. Form rules

Form CMS phải được thiết kế để nhập liệu nhanh, ít lỗi và dễ kiểm tra lại trước khi lưu. Form dài phải chia section. Field ngắn phải dùng grid 2–3 cột thay vì kéo full width không cần thiết.

| Loại form | Layout khuyến nghị |
|---|---|
| Form ngắn dưới 6 field | Một card, grid 1–2 cột |
| Form trung bình 6–15 field | Chia section trong một trang hoặc drawer rộng |
| Form dài trên 15 field | Dùng tab/step hoặc section có anchor |
| Form cấu hình phức tạp | Chia nhóm theo nghiệp vụ và có preview nếu cần |

### 6.1. Field rules

| Field | Quy tắc |
|---|---|
| Label | Luôn rõ nghĩa, không viết tắt khó hiểu |
| Required | Đánh dấu `*`, nhưng không lạm dụng tất cả field đều required |
| Helper text | Dùng cho rule nghiệp vụ, giới hạn, ví dụ format file |
| Validation | Hiển thị gần field, thông báo cụ thể nguyên nhân |
| Placeholder | Gợi ý nhập liệu, không thay thế label |
| Disabled field | Phải có lý do nếu người dùng có thể thắc mắc |

### 6.2. Form action rules

Action của form phải nhất quán. Với form dài, footer action nên sticky để người dùng không phải scroll xuống cuối mới lưu được.

| Action | Vị trí | Kiểu button |
|---|---|---|
| Save/Create | Footer right | Primary |
| Cancel | Footer right trước primary | Secondary/Ghost |
| Delete | Footer left hoặc danger section | Danger |
| Preview | Gần Save nếu có | Secondary |

## 7. Modal/Drawer rules

Modal dùng cho tác vụ ngắn, xác nhận hoặc form nhỏ. Drawer dùng cho form dài vừa phải hoặc xem chi tiết record mà không rời khỏi list. Không dùng modal quá dài khiến footer bị mất khỏi viewport.

| Thành phần | Quy tắc |
|---|---|
| Header | Có title rõ, optional description |
| Body | Scroll riêng nếu nội dung dài |
| Footer | Sticky bottom, luôn nhìn thấy action chính |
| Width modal | 480px confirm, 720–960px form vừa, tối đa 1080px |
| Height modal | `max-height: calc(100vh - 48px)` |
| Close | Có nút close, nhưng thao tác chưa lưu cần confirm |

### 7.1. Modal form compact

Với các form như **Cập nhật giải thưởng**, **Tạo lì xì**, **Tạo code**, **Cấu hình popup**, nên ưu tiên layout 2 cột nếu có ảnh/upload hoặc nhiều field ngắn.

```text
┌──────────────────────────────────────────────┐
│ Tạo chương trình lì xì                    × │
├──────────────────────────────────────────────┤
│ Thông tin cơ bản        Cấu hình phát        │
│ [Tên chương trình]      [Số lượng]           │
│ [Thời gian bắt đầu]     [Số lượt/user]       │
│ [Thời gian kết thúc]    [Ngân sách]          │
│ Điều kiện nhận                                │
│ [Rule / segment user]                         │
├──────────────────────────────────────────────┤
│                              [Hủy] [Tạo]     │
└──────────────────────────────────────────────┘
```

## 8. Dashboard rules

Dashboard CMS không phải nơi hiển thị mọi thứ. Dashboard phải trả lời nhanh các câu hỏi vận hành: hôm nay có gì bất thường, đã phát bao nhiêu tiền/xu/code, top user nào nhận nhiều, có job nào lỗi, hệ thống live có ổn không.

| Widget | Quy tắc |
|---|---|
| KPI card | Hiển thị số chính, thay đổi so với kỳ trước, label rõ |
| Chart | Chỉ dùng khi xu hướng quan trọng; không dùng chart trang trí |
| Top list | Top user, top chương trình, top lỗi cần có link drill-down |
| Alert | Lỗi job, phát thưởng thất bại, API bất thường phải nổi bật |
| Date filter | Dashboard phải có filter ngày/tuần/tháng |

## 9. State design rules

Mọi màn hình phải thiết kế đủ trạng thái. Không được chỉ thiết kế happy path.

| State | Yêu cầu |
|---|---|
| Loading | Skeleton hoặc spinner có kích thước giữ layout |
| Empty | Mô tả chưa có dữ liệu và action tiếp theo |
| Error | Thông báo lỗi rõ, có nút retry nếu phù hợp |
| Success | Toast hoặc inline success, không che dữ liệu quan trọng |
| Permission denied | Nói rõ không có quyền, không hiển thị action bị cấm nếu không cần |
| Expired | Dùng cho campaign, popup, nhiệm vụ, dự đoán đã hết hạn |
| Processing | Dùng cho job import/export/phát thưởng/tính điểm |

## 10. Color semantics cho trạng thái

Không dùng màu tùy ý cho trạng thái. Màu phải có ý nghĩa cố định toàn hệ thống.

| Trạng thái | Màu | Ví dụ |
|---|---|---|
| Active/Success | Green | Hoạt động, đã phát, đã hoàn thành |
| Pending/Processing | Blue | Đang xử lý, đang chạy job |
| Warning | Amber/Orange | Sắp hết hạn, cần kiểm tra |
| Error/Danger | Red | Thất bại, khóa, xóa, hết quỹ |
| Inactive/Disabled | Gray | Tạm dừng, nháp, chưa kích hoạt |

## 11. UX cho chức năng rủi ro cao

Các module liên quan **tiền, xu, điểm, code, lì xì, user VIP, tính lại điểm, rollback, khóa user** phải có UX an toàn. Không được chỉ có một nút bấm là thao tác xong.

| Chức năng | UX bắt buộc |
|---|---|
| Cộng tiền cho user | Chọn user rõ, nhập số tiền, lý do, confirm, audit log |
| Phát code/lì xì | Preview số lượng, tổng ngân sách, danh sách user, confirm |
| Tính lại điểm | Preview trước/sau, batch id, apply sau khi xác nhận, rollback nếu cần |
| Xóa/khóa user | Modal danger, mô tả hậu quả, có quyền riêng |
| Settle dự đoán | Preview user trúng, tổng thưởng, confirm trước khi phát |

## 12. CMS module templates

### 12.1. Template màn hình danh sách

Mỗi màn hình danh sách nên theo cấu trúc chuẩn sau:

```text
Page Header
  Title + Description + Primary Action

Filter Bar
  Search + Status + Date Range + Advanced Filter + Reset

Table
  Columns + Status Badge + Row Actions + Pagination

Optional Drawer/Modal
  Detail / Create / Edit / Confirm
```

### 12.2. Template màn hình tạo/sửa

```text
Page Header
  Title + Breadcrumb

Form Sections
  1. Thông tin cơ bản
  2. Cấu hình nghiệp vụ
  3. Điều kiện áp dụng
  4. Phần thưởng / Kết quả
  5. Trạng thái / Thời gian

Sticky Footer
  Cancel + Save Draft + Publish/Save
```

### 12.3. Template màn hình chi tiết

```text
Header
  Tên record + status + actions

Summary Cards
  Thông tin chính / KPI liên quan

Tabs
  Tổng quan | Lịch sử | Log | Cấu hình | Người dùng liên quan

Audit Section
  Người tạo, người cập nhật, thời gian, batch/job id nếu có
```

## 13. Responsive rules

CMS chủ yếu dùng desktop/laptop, nhưng vẫn phải hoạt động tốt trên màn hình nhỏ. Mục tiêu tối thiểu là không vỡ layout ở 1366×768.

| Kích thước | Quy tắc |
|---|---|
| 1366×768 | Không để modal vượt quá viewport; table có horizontal scroll nếu cần |
| 1440×900 | Layout chuẩn desktop |
| ≥1920px | Content có max width hoặc table tận dụng chiều ngang hợp lý |
| Tablet | Sidebar collapsible, filter có thể xuống dòng |
| Mobile | Chỉ hỗ trợ tác vụ cần thiết nếu CMS bắt buộc dùng mobile |

## 14. Accessibility rules

CMS cần đủ accessibility cơ bản để thao tác nhanh và tránh lỗi. Không được dùng màu làm tín hiệu duy nhất.

| Yêu cầu | Quy tắc |
|---|---|
| Contrast | Text và background đủ tương phản |
| Keyboard | Form, modal, dropdown thao tác được bằng keyboard |
| Focus state | Input/button/select có focus rõ |
| Label | Input phải có label liên kết đúng |
| Error | Error message mô tả cụ thể, không chỉ đổi border đỏ |
| Icon | Icon-only button phải có tooltip hoặc aria-label |

## 15. Microcopy rules

Ngôn ngữ trong CMS phải ngắn gọn, rõ nghĩa và nhất quán. Không dùng câu mơ hồ như “Có lỗi xảy ra” nếu có thể nói cụ thể hơn.

| Tình huống | Câu nên dùng |
|---|---|
| Lưu thành công | `Đã lưu thay đổi.` |
| Tạo thành công | `Đã tạo chương trình.` |
| Phát thưởng thành công | `Đã phát thưởng cho 1.240 người dùng.` |
| Hết hạn | `Chương trình đã hết hạn, không thể nhận thêm.` |
| Không đủ quyền | `Bạn không có quyền thực hiện thao tác này.` |
| Dữ liệu trống | `Chưa có chương trình nào. Tạo chương trình đầu tiên để bắt đầu.` |

## 16. Quy tắc cho AI/code assistant khi làm UI CMS

Khi dùng AI để code hoặc refactor UI CMS, luôn yêu cầu AI đọc file này trước. AI không được tự tạo style tùy tiện nếu đã có component hoặc token tương ứng.

> **AI implementation rule:** Trước khi code UI CMS, phải xác định màn hình thuộc loại nào: list, form, detail, dashboard, modal, drawer, setting hoặc report. Sau đó áp dụng đúng template và component rules trong file này.

| Khi yêu cầu AI làm | Prompt nên dùng |
|---|---|
| Tạo màn hình mới | `Hãy áp dụng CMS_UI_UX_RULES.md, dùng template list/form/detail phù hợp, không tạo style riêng nếu component đã có.` |
| Refactor màn hình dài | `Hãy giảm scroll, chia section, dùng grid 2 cột cho field ngắn, sticky footer cho action.` |
| Tối ưu table | `Hãy chuẩn hóa table theo rule: filter bar, status badge, fixed action, pagination, empty/loading/error state.` |
| Tạo modal | `Modal phải có header/body/footer, max-height theo viewport, footer sticky, không để form quá dài một cột.` |

## 17. Checklist review UI trước khi merge

| Câu hỏi review | Đạt/Không |
|---|---|
| Màn hình có đúng page header, primary action và breadcrumb nếu cần chưa? |  |
| Table có filter, pagination, empty/loading/error state chưa? |  |
| Form đã chia section và có validation rõ chưa? |  |
| Modal/drawer có sticky footer và không vượt viewport chưa? |  |
| Các trạng thái active/pending/error/expired có dùng badge đúng màu chưa? |  |
| Có xử lý permission denied hoặc action bị cấm chưa? |  |
| Các thao tác rủi ro cao có confirm/audit/preview chưa? |  |
| Giao diện có hoạt động tốt ở 1366×768 chưa? |  |
| Có dùng token/component chung thay vì hardcode style chưa? |  |
| Text/microcopy có rõ ràng và nhất quán chưa? |  |

## 18. Definition of Done cho UI/UX CMS

Một màn hình CMS chỉ được coi là hoàn thành khi đã đáp ứng đầy đủ các tiêu chí sau: giao diện đúng layout chuẩn, trạng thái dữ liệu đầy đủ, thao tác chính rõ ràng, có validation/error state, responsive tối thiểu ở 1366×768, dùng component/token chung và không phá vỡ trải nghiệm ở các module khác.

| Nhóm tiêu chí | Điều kiện hoàn thành |
|---|---|
| Visual | Đúng design system, spacing, typography, màu, badge |
| UX | Dễ hiểu, ít scroll, action rõ, feedback đầy đủ |
| Data | Có loading, empty, error, pagination nếu cần |
| Safety | Có confirm cho thao tác nguy hiểm, phân quyền rõ |
| Maintainability | Dùng component chung, không hardcode style rời rạc |
| QA | Test trên màn hình phổ biến và dữ liệu nhiều/ít/rỗng/lỗi |

## 19. Gợi ý cấu trúc component CMS

| Component | Mục đích |
|---|---|
| `PageHeader` | Title, description, breadcrumb, actions |
| `FilterBar` | Search, select, date range, reset, advanced filter |
| `DataTable` | Table chuẩn CMS |
| `StatusBadge` | Badge trạng thái dùng toàn hệ thống |
| `FormSection` | Nhóm field trong form |
| `StickyActionBar` | Footer action cố định cho form/modal |
| `ConfirmDialog` | Xác nhận thao tác rủi ro |
| `AuditLogPanel` | Hiển thị lịch sử thao tác |
| `EmptyState` | Trạng thái không có dữ liệu |
| `ErrorState` | Trạng thái lỗi có retry |

## 20. Nguyên tắc mở rộng về sau

Khi dự án phát triển thêm module mới, không tạo pattern UI mới nếu pattern hiện tại đáp ứng được. Nếu một màn hình cần hành vi mới, hãy cập nhật file rule này trước rồi mới triển khai component. File rule phải được xem như một phần của source code, có review khi thay đổi và được dùng làm chuẩn cho cả designer, developer và AI assistant.

> **Quy tắc cuối cùng:** UI CMS phải nhất quán hơn là sáng tạo. Sự sáng tạo nên nằm ở cách làm quy trình vận hành nhanh hơn, an toàn hơn và ít lỗi hơn.
