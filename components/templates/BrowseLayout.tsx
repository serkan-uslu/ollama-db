interface BrowseLayoutProps {
  sidebar: React.ReactNode;
  search: React.ReactNode;
  results: React.ReactNode;
  count: React.ReactNode;
  chips?: React.ReactNode;
}

export function BrowseLayout({ sidebar, search, results, count, chips }: BrowseLayoutProps) {
  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--color-page-bg)]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-10">
        {/* Search — full width */}
        <div className="mb-4">{search}</div>

        {/* Mobile filter bar */}
        <div className="lg:hidden mb-4">{sidebar}</div>

        <div className="flex gap-8 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">{sidebar}</div>

          {/* Main content */}
          <main id="main" className="flex-1 min-w-0 flex flex-col gap-4">
            {chips}
            <div className="hidden lg:block">{count}</div>
            {results}
          </main>
        </div>
      </div>
    </div>
  );
}
