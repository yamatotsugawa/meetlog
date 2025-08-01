import "./globals.css";

export const metadata = {
  title: "会った人メモ",
  description: "人との出会いを忘れず記録するアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:px-4">
            <a href="/" className="font-semibold tracking-tight">会った人メモ</a>
            <a
              href="/people/new"
              className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              新規登録
            </a>
          </div>
        </header>

        {/* Page */}
        <div className="mx-auto max-w-5xl px-3 pb-24 pt-4 sm:px-4">
          {children}
        </div>

        {/* Floating Action (mobile) */}
        <a
          href="/people/new"
          className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-black text-white shadow-lg hover:opacity-90 sm:hidden"
          aria-label="新規登録"
          title="新規登録"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M11 11V6a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5Z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
