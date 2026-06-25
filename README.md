# App test pipeline iOS (không phải app thật của bạn)

Đây là 1 app Tauri 2 + Next.js **tối giản** (chỉ có 1 nút "Chào" gọi sang Rust),
mục đích duy nhất là để thử nghiệm toàn bộ pipeline build iOS không cần Mac,
trước khi áp dụng vào app `ir_remote_app` thật của bạn.

Phần frontend (Next.js) mình đã build thử thật và chạy được (`npm run build`
ra file tĩnh trong thư mục `out/`). Phần Rust/iOS thì mình **chưa thể test
trực tiếp** vì sandbox của mình không có máy macOS — đây chính là lý do
chúng ta cần chạy thử trên Codemagic để xem điều gì xảy ra thật.

## Cơ chế hoạt động (ai làm gì, ở đâu)

```
Máy bạn (Windows)          CI Codemagic (máy macOS ảo)         iPhone của bạn
─────────────────          ────────────────────────            ───────────────
1. git push code    →      2. cài Rust + Xcode build app
                            3. xuất ra file .ipa (artifact)
4. download .ipa    ←──────┘
5. dùng SideStore/AltStore để cài .ipa lên máy  ────────────→  6. app chạy trên iPhone
```

- Bước 2–3 là phần duy nhất cần "máy macOS" — Codemagic cho bạn mượn máy đó
  miễn phí 500 phút/tháng, bạn không cần tự cài Xcode.
- Bước 5 là phần ký app (code signing) bằng Apple ID free của bạn, làm ngay
  trên điện thoại qua app SideStore, không cần Mac.

## Các bước cụ thể

### 1. Đẩy code này lên GitHub
Tạo 1 repo mới (private cũng được), push toàn bộ thư mục này lên.

### 2. Đăng ký Codemagic (free)
Vào codemagic.io, đăng ký bằng GitHub, chọn "Add application", chọn đúng repo
vừa tạo. Codemagic sẽ tự nhận diện file `codemagic.yaml` đã có sẵn trong repo.

### 3. Chạy workflow `ios-test-build`
Bấm "Start new build", chọn workflow này. Đây là bước **chẩn đoán**, không
phải bước "chắc chắn chạy được" — mình đã viết để nó không tự fail cứng ở
bước build iOS cuối, mục đích để mình đọc được log lỗi thật (gần như chắc
chắn sẽ vướng ở phần ký app, vì đó là phần phức tạp nhất của iOS mà mình
chưa thể tự kiểm chứng trước).

### 4. Gửi lại log cho mình
Sau khi build xong (dù thành công hay lỗi ở bước cuối), copy phần log của
bước "Thu build iOS" gửi lại đây, mình sẽ đọc lỗi cụ thể và chỉnh tiếp —
đúng kiểu làm việc lặp từng bước, không cố đoán mò khi chưa thấy log thật.

### 5. Khi đã có file .ipa
Cài app **SideStore** lên iPhone của bạn (cần 1 lần dùng máy Windows để
setup, sau đó SideStore tự refresh qua WiFi, không cần máy tính nữa).
Dùng SideStore để sideload file `.ipa` từ Codemagic vào máy — bước này
SideStore tự ký bằng Apple ID free của bạn.

## Vì sao mình chưa thể chắc 100% ngay từ đầu

Tài liệu chính thức của Tauri có ghi rõ là việc ký app cho iOS thường đi
cùng với tài khoản Apple Developer Program (99$/năm) hoặc cần một thiết bị
Apple thật để thực hiện ký — đây là quy trình "chuẩn" mà Tauri hỗ trợ sẵn.
Hướng "build app không ký, để SideStore tự ký trên điện thoại" là một kỹ
thuật được giới sideloading dùng phổ biến cho nhiều app khác, về lý thuyết
áp dụng được cho app Tauri, nhưng mình chưa có cách nào tự kiểm chứng từng
dòng lệnh chính xác mà không có máy macOS trong tay — nên bước 3–4 ở trên
(chạy thật trên Codemagic rồi đọc log) là cách duy nhất để biết chắc.

Nếu hướng này quá vướng, phương án dự phòng chắc chắn chạy được (nhưng tốn
99$/năm) là dùng đúng quy trình ký chính thức của Tauri với Apple Developer
Program — mình có thể hướng dẫn nếu cần tới lúc đó.
