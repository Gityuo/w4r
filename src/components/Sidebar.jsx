const Sidebar = ({ library, activeMangaId, onSelectManga, onImportFolder, onOpenLibrary }) => (
  <aside className="glass-panel w-[300px] shrink-0 p-4">
    <button
      type="button"
      onClick={onOpenLibrary}
      className="w-full rounded-card border border-glass-edge bg-white/10 px-4 py-3 text-left text-lg font-semibold transition-all duration-300 ease-apple hover:scale-[1.02] hover:bg-white/15"
    >
      Local Library
    </button>

    <button
      type="button"
      onClick={onImportFolder}
      className="mt-3 w-full rounded-card border border-cyan-200/25 bg-cyan-400/10 px-4 py-3 font-medium transition-all duration-300 ease-apple hover:scale-105 hover:bg-cyan-300/20"
    >
      Import Folder
    </button>

    <div className="mt-5 space-y-2 overflow-y-auto pr-1">
      {library.map((title) => {
        const selected = title.id === activeMangaId;
        return (
          <button
            type="button"
            key={title.id}
            onClick={() => onSelectManga(title.id)}
            className={`w-full rounded-card border px-3 py-2 text-left transition-all duration-300 ease-apple ${
              selected
                ? 'scale-[1.02] border-white/30 bg-white/18'
                : 'border-glass-edge bg-white/5 hover:scale-[1.02] hover:bg-white/15'
            }`}
          >
            <p className="truncate font-medium">{title.title}</p>
            <p className="text-xs text-slate-300">{title.pageCount} pages</p>
          </button>
        );
      })}
    </div>
  </aside>
);

export default Sidebar;
