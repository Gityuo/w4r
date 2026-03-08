import { useEffect, useMemo, useState } from 'react';

const VIEW_MODES = {
  VERTICAL: 'vertical',
  SINGLE: 'single',
  DOUBLE: 'double'
};

const Reader = ({ manga }) => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.VERTICAL);
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const loadProgress = async () => {
      if (!manga) {
        return;
      }

      const savedPage = await window.mangaAPI.getProgress(manga.id);
      setPageIndex(savedPage);
    };

    loadProgress();
  }, [manga]);

  useEffect(() => {
    if (!manga) {
      return;
    }

    window.mangaAPI.saveProgress({ mangaId: manga.id, pageIndex });
  }, [manga, pageIndex]);

  const pages = manga?.pages ?? [];

  const visiblePages = useMemo(() => {
    if (viewMode === VIEW_MODES.VERTICAL) {
      return pages;
    }

    if (viewMode === VIEW_MODES.SINGLE) {
      return pages[pageIndex] ? [pages[pageIndex]] : [];
    }

    return pages.slice(pageIndex, pageIndex + 2);
  }, [pages, pageIndex, viewMode]);

  if (!manga) {
    return <div className="glass-card flex h-full items-center justify-center">Select a manga title to start reading.</div>;
  }

  return (
    <section className="flex h-full flex-col gap-4">
      <header className="glass-card flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{manga.title}</h2>
          <p className="text-sm text-slate-300">
            Page {pageIndex + 1} of {manga.pageCount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={viewMode}
            onChange={(event) => setViewMode(event.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-sm"
          >
            <option value={VIEW_MODES.VERTICAL}>Vertical</option>
            <option value={VIEW_MODES.SINGLE}>Single Page</option>
            <option value={VIEW_MODES.DOUBLE}>Double Spread</option>
          </select>
          <button
            type="button"
            onClick={() => setZoom((currentZoom) => Math.max(0.5, Number((currentZoom - 0.1).toFixed(2))))}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1"
          >
            -
          </button>
          <span className="w-14 text-center text-sm">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((currentZoom) => Math.min(3, Number((currentZoom + 0.1).toFixed(2))))}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1"
          >
            +
          </button>
        </div>
      </header>

      <div className="glass-card flex items-center justify-between p-3">
        <button
          type="button"
          disabled={pageIndex <= 0 || viewMode === VIEW_MODES.VERTICAL}
          onClick={() => setPageIndex((index) => Math.max(0, index - (viewMode === VIEW_MODES.DOUBLE ? 2 : 1)))}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={pageIndex >= pages.length - 1 || viewMode === VIEW_MODES.VERTICAL}
          onClick={() =>
            setPageIndex((index) => Math.min(pages.length - 1, index + (viewMode === VIEW_MODES.DOUBLE ? 2 : 1)))
          }
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="glass-card flex-1 overflow-y-auto">
        <div
          className={`mx-auto gap-3 ${viewMode === VIEW_MODES.VERTICAL ? 'flex max-w-4xl flex-col' : 'grid grid-cols-1 md:grid-cols-2'}`}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {visiblePages.map((page) => (
            <img
              key={page.filePath}
              src={page.src}
              alt={manga.title}
              className="w-full rounded-xl border border-white/20 bg-slate-900/50"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reader;
