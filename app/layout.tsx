import "./globals.css";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Save your bookmarks securely with Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header-bar">
          <h1>📑 Smart Bookmark App</h1>
        </header>

        <main className="main-content">{children}</main>

        <footer className="footer">
          © 2026 Smart Bookmark App by Samruddhi Shetty
        </footer>
      </body>
    </html>
  );
}
