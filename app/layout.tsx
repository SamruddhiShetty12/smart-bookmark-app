import "./globals.css";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Save and manage your bookmarks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <h1>📑 Smart Bookmark App</h1>
        </header>

        <main className="main">{children}</main>

        <footer className="footer">
          <p>© 2026 Smart Bookmark App by Samruddhi Shetty</p>
        </footer>
      </body>
    </html>
  );
}
