"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");

  async function greet() {
    try {
      // invoke gọi sang hàm Rust "greet" định nghĩa trong src-tauri/src/lib.rs
      const { invoke } = await import("@tauri-apps/api/core");
      const result = await invoke<string>("greet", { name: name || "Điền" });
      setGreeting(result);
    } catch (e) {
      setGreeting("Chưa chạy trong Tauri webview nên invoke() lỗi, đây là bình thường nếu mở bằng trình duyệt thường.");
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Tauri + Next.js trên iOS</h1>
      <p>App mẫu để test pipeline build iOS (CI macOS → sideload bằng SideStore).</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nhập tên của bạn"
        style={{ padding: 8, marginRight: 8 }}
      />
      <button onClick={greet} style={{ padding: 8 }}>
        Chào (gọi Rust)
      </button>
      <p style={{ marginTop: 16, fontWeight: 600 }}>{greeting}</p>
    </main>
  );
}
