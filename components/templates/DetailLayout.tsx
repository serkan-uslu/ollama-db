interface DetailLayoutProps {
  back: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function DetailLayout({ back, header, main, sidebar }: DetailLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-10">
      <div className="mb-6">{back}</div>
      <div className="mb-8 pb-8 border-b border-[var(--color-border)]">{header}</div>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 lg:items-start">
        <main
          id="main"
          className="flex-1 min-w-0 flex flex-col gap-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[var(--shadow-sm)] p-6"
        >
          {main}
        </main>
        {sidebar && (
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[var(--shadow-sm)] p-5">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
