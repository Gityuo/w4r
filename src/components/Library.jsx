const Library = ({ library, onOpenReader }) => (
  <section className="h-full overflow-y-auto">
    <header className="mb-6">
      <h1 className="text-3xl font-semibold tracking-tight">Manga Library</h1>
      <p className="mt-1 text-slate-300">Import local folders and continue reading where you left off.</p>
    </header>

    {library.length === 0 ? (
      <div className="glass-card flex h-40 items-center justify-center text-slate-300">
        Import a folder to get started.
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {library.map((title) => (
          <button
            type="button"
            key={title.id}
            onClick={() => onOpenReader(title.id)}
            className="glass-card text-left transition-all duration-300 ease-apple hover:scale-105"
          >
            <div className="mb-3 h-48 overflow-hidden rounded-[12px] border border-white/20 bg-slate-900/25">
              {title.pages[0] ? (
                <img
                  src={title.pages[0].src}
                  alt={title.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-200/70">No preview</div>
              )}
            </div>
            <h2 className="truncate text-lg font-medium">{title.title}</h2>
            <p className="text-sm text-slate-300">{title.pageCount} pages</p>
          </button>
        ))}
      </div>
    )}
  </section>
);

export default Library;
