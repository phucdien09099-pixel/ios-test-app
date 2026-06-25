export const metadata = {
  title: "iOS Test App",
  description: "App mẫu để test pipeline build iOS không cần Mac",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
