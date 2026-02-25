interface BrowseLayoutProps {
  sidebar: React.ReactNode;
  search: React.ReactNode;
  results: React.ReactNode;
  count: React.ReactNode;
}

export function BrowseLayout({ sidebar, search, results, count }: BrowseLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-10">
      {/* Search — full width on all breakpoints */}
      <div className="mb-4">{search}</div>

      {/* Mobile filter bar — hidden on desktop (ModelFilters shows its trigger bar here) */}
      <div className="lg:hidden mb-4">{sidebar}</div>

      <div className="flex gap-8 items-start">
        {/* Desktop sidebar — hidden on mobile (ModelFilters shows its aside here) */}
        <div className="hidden lg:block">{sidebar}</div>

        {/* Main content */}
        <main id="main" className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Result count — desktop only */}
          <div className="hidden lg:block">{count}</div>
          {results}
        </main>
      </div>
    </div>
  );
}
