import "./globals.css";

export const metadata = {
  title: "My Blog",
  description: "A Next.js blog with comments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 font-sans">
        <nav className="bg-white shadow-sm py-4 px-6 mb-8">
          <a href="/posts" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            📝 My Blog
          </a>
        </nav>
        <div className="max-w-3xl mx-auto px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
