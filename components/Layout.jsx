import Header from "./Header";

export default function Example({ main, side }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="py-6">
        <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
          <div className="hidden lg:col-span-3 lg:block xl:col-span-2">
            <nav
              aria-label="Sidebar"
              className="fixed mt-[72px] top-6 divide-y divide-gray-300"
            >
              {side}
            </nav>
          </div>
          <main className="lg:col-span-9 xl:col-span-6">
            {main}
            {/* Your content */}
          </main>
          <aside className="hidden xl:col-span-4 xl:block">
            <div className="sticky top-6 space-y-4">{/* Your content */}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
