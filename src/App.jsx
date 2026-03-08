import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Library from './components/Library';
import Reader from './components/Reader';

const APP_TABS = {
  LIBRARY: 'library',
  READER: 'reader'
};

const App = () => {
  const [library, setLibrary] = useState([]);
  const [activeMangaId, setActiveMangaId] = useState(null);
  const [activeTab, setActiveTab] = useState(APP_TABS.LIBRARY);

  const activeManga = useMemo(
    () => library.find((item) => item.id === activeMangaId) ?? null,
    [library, activeMangaId]
  );

  useEffect(() => {
    const loadLibrary = async () => {
      const items = await window.mangaAPI.getLibrary();
      setLibrary(items);
      if (items.length > 0) {
        setActiveMangaId(items[0].id);
      }
    };

    loadLibrary();
  }, []);

  const handleImportFolder = async () => {
    const response = await window.mangaAPI.importFolder();
    if (!response.canceled) {
      setLibrary(response.library);
      setActiveMangaId(response.mangaTitle.id);
      setActiveTab(APP_TABS.LIBRARY);
    }
  };

  const handleSelectManga = (mangaId) => {
    setActiveMangaId(mangaId);
    setActiveTab(APP_TABS.READER);
  };

  return (
    <div className="min-h-screen bg-app-gradient px-4 py-6 text-slate-100">
      <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-[1600px] gap-4">
        <Sidebar
          library={library}
          activeMangaId={activeMangaId}
          onSelectManga={handleSelectManga}
          onImportFolder={handleImportFolder}
          onOpenLibrary={() => setActiveTab(APP_TABS.LIBRARY)}
        />

        <main className="glass-panel flex-1 overflow-hidden p-5">
          {activeTab === APP_TABS.LIBRARY ? (
            <Library library={library} onOpenReader={handleSelectManga} />
          ) : (
            <Reader manga={activeManga} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
