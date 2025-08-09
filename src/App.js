import React, { useState, useMemo, useCallback, useRef } from 'react';

/* =========================
   SVG-Icons
   ========================= */
const X = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);
const Edit2 = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const StarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const FireIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);
const SnowflakeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path>
  </svg>
);
const CheckSquareIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);
const UploadCloudIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path>
  </svg>
);
const DownloadIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);
const UndoIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
  </svg>
);
const RedoIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
  </svg>
);

/* =========================
   Drop-Zone (angedockt, große Hit-Area, schmale Optik)
   ========================= */
const DropZoneRow = ({
  onDrop,        // bleibt vorhanden (für klassische Drops)
  onDragOver,
  ariaLabel = 'Drop here',
  active = false,
  hitHeightPx = 28,   // großzügige Trefferfläche
  visualHeightPx = 4, // schmaler Balken
  className = '',
}) => {
  return (
    <tr onDrop={onDrop} onDragOver={onDragOver} className={className}>
      <td colSpan="10" className="p-0">
        <div
          style={{ height: `${hitHeightPx}px` }}
          className="m-0 flex items-center"
          aria-label={ariaLabel}
        >
          <div
            style={{ height: `${visualHeightPx}px` }}
            className={[
              'w-full rounded-full transition-all duration-75',
              active ? 'bg-blue-400' : 'bg-blue-700/60',
              'outline outline-1 outline-blue-900/40'
            ].join(' ')}
          />
        </div>
      </td>
    </tr>
  );
};

/* =========================
   Hauptkomponente
   ========================= */
const InteractivePlayerTable = () => {
  const [players, setPlayers] = useState([]);
  const [activePositionFilter, setActivePositionFilter] = useState('Overall');
  const [teamFilter, setTeamFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState({
    favorite: false,
    hot: false,
    cold: false,
    available: false,
  });
  const [editingCell, setEditingCell] = useState(null);

  // Drag & Drop
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoverKey, setHoverKey] = useState(null); // letzte "aktive" Zone (entscheidet die Einfügeposition)

  // History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isPerformingHistoryAction = useRef(false);

  const addToHistory = useCallback((newPlayers) => {
    if (isPerformingHistoryAction.current) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newPlayers)));
    setHistory(newHistory.slice(-50));
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isPerformingHistoryAction.current = true;
      const prevIndex = historyIndex - 1;
      setPlayers(JSON.parse(JSON.stringify(history[prevIndex])));
      setHistoryIndex(prevIndex);
      setTimeout(() => { isPerformingHistoryAction.current = false; }, 0);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isPerformingHistoryAction.current = true;
      const nextIndex = historyIndex + 1;
      setPlayers(JSON.parse(JSON.stringify(history[nextIndex])));
      setHistoryIndex(nextIndex);
      setTimeout(() => { isPerformingHistoryAction.current = false; }, 0);
    }
  }, [history, historyIndex]);

  const setPlayersWithHistory = useCallback((updateFunction) => {
    setPlayers(prev => {
      const newPlayers = typeof updateFunction === 'function' ? updateFunction(prev) : updateFunction;
      if (!isPerformingHistoryAction.current && JSON.stringify(prev) !== JSON.stringify(newPlayers)) {
        addToHistory(newPlayers);
      }
      return newPlayers;
    });
  }, [addToHistory]);

  const uniqueTeams = useMemo(() => [...new Set(players.map(p => p.team))].sort(), [players]);

  const calculatePositionalRanks = (playerList) => {
    const positionCounts = {};
    return playerList.map(player => {
      const pos = player.basePos;
      if (!positionCounts[pos]) {
        positionCounts[pos] = 0;
      }
      positionCounts[pos]++;
      return {
        ...player,
        pos: `${pos}${positionCounts[pos]}`
      };
    });
  };

  /* ========== CSV Import/Export & Edit ========== */
  const exportToCSV = () => {
    if (players.length === 0) return;
    const headers = ['RK', 'TIERS', 'PLAYER NAME', 'TEAM', 'POS', 'BYE WEEK', 'Notes', 'Unavailable', 'Favorite', 'Hot', 'Cold'];
    const csvContent = [
      headers.join(','),
      ...players.map(p => [
        p.rank, p.tier, `"${p.name}"`, p.team,
        p.pos, p.byeWeek, `"${p.notes || ''}"`,
        p.unavailable, p.isFavorite, p.isHot, p.isCold
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fantasy-rankings-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').slice(1);
      const parsedPlayers = rows.map((row, index) => {
        const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        if (columns.length < 6) return null;
        const rank = parseInt(columns[0]?.replace(/"/g, ''), 10);
        return {
          id: rank || `player-${Date.now()}-${index}`,
          rank: rank,
          tier: parseInt(columns[1]?.replace(/"/g, ''), 10) || 1,
          name: columns[2]?.replace(/"/g, '') || '',
          team: columns[3]?.replace(/"/g, '') || '',
          pos: columns[4]?.replace(/"/g, '') || '',
          basePos: (columns[4]?.replace(/"/g, '').match(/[A-Z]+/) || [''])[0],
          byeWeek: parseInt(columns[5]?.replace(/"/g, ''), 10) || 0,
          notes: columns[8]?.replace(/"/g, '') || '',
          unavailable: columns[9] === 'true',
          isFavorite: columns[10] === 'true',
          isHot: columns[11] === 'true',
          isCold: columns[12] === 'true',
        };
      }).filter(p => p && !isNaN(p.rank));
      const sorted = parsedPlayers.sort((a,b) => a.rank - b.rank);
      const withOrder = sorted.map((p, i) => ({ ...p, rank: i + 1, order: i + 1 }));
      const finalPlayers = calculatePositionalRanks(withOrder);
      setPlayers(finalPlayers);
      setHistory([JSON.parse(JSON.stringify(finalPlayers))]);
      setHistoryIndex(0);
    };
    reader.readAsText(file);
  };

  const togglePlayerStatus = (playerId, statusKey) => {
    setPlayersWithHistory(prev => prev.map(p => p.id === playerId ? { ...p, [statusKey]: !p[statusKey] } : p));
  };

  const handleStatusFilterToggle = (filterKey) => {
    setStatusFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  const toggleAvailability = (playerId) => {
    setPlayersWithHistory(prev => prev.map(p => p.id === playerId ? { ...p, unavailable: !p.unavailable } : p));
  };

  const handleCellEdit = (playerId, field, value) => {
    setPlayersWithHistory(prev => {
      const playerIndex = prev.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return prev;

      if (field === 'rank') {
        const targetRank = parseInt(value);
        if (isNaN(targetRank) || targetRank < 1) {
          setEditingCell(null);
          return prev;
        }
        const player = prev[playerIndex];
        const newPlayers = [...prev];
        newPlayers.splice(playerIndex, 1);
        const insertIndex = Math.min(targetRank - 1, newPlayers.length);
        newPlayers.splice(insertIndex, 0, player);
        const updatedRanks = newPlayers.map((p, index) => ({ ...p, rank: index + 1, order: index + 1 }));
        return calculatePositionalRanks(updatedRanks);
      }
      return prev.map(p => p.id === playerId ? { ...p, [field]: value } : p);
    });
    setEditingCell(null);
  };

  /* ========== Filter-Pipeline ========== */
  const getFilteredByPosition = useCallback((playersList) => {
    switch (activePositionFilter) {
      case 'QB': return playersList.filter(p => p.basePos === 'QB');
      case 'RB': return playersList.filter(p => p.basePos === 'RB');
      case 'WR': return playersList.filter(p => p.basePos === 'WR');
      case 'TE': return playersList.filter(p => p.basePos === 'TE');
      case 'FLEX': return playersList.filter(p => ['RB','WR','TE'].includes(p.basePos));
      case 'K': return playersList.filter(p => p.basePos === 'K');
      case 'DST': return playersList.filter(p => p.basePos === 'DST');
      default: return playersList;
    }
  }, [activePositionFilter]);

  const filteredAndSortedPlayers = useMemo(() => {
    let playersToFilter = getFilteredByPosition(players);
    if (statusFilters.available) playersToFilter = playersToFilter.filter(p => !p.unavailable);
    if (statusFilters.favorite) playersToFilter = playersToFilter.filter(p => p.isFavorite);
    if (statusFilters.hot) playersToFilter = playersToFilter.filter(p => p.isHot);
    if (statusFilters.cold) playersToFilter = playersToFilter.filter(p => p.isCold);

    playersToFilter = playersToFilter.filter(player => {
      if (teamFilter && player.team !== teamFilter) return false;
      if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    return playersToFilter.sort((a,b) => (a.order ?? a.rank) - (b.order ?? b.rank));
  }, [players, getFilteredByPosition, teamFilter, searchQuery, statusFilters]);

  /* ========== Drag & Drop Helpers ========== */
  const handleDragStart = (_e, player) => {
    setDraggedItem(player);
  };
  const handleDragEnd = () => {
    setDraggedItem(null);
    setHoverKey(null);
  };

  const getOrder = (p) => p ? (p.order ?? p.rank) : null;
  const between = (a, b) => {
    const ao = getOrder(a) ?? ((getOrder(b) ?? 1) - 1);
    const bo = getOrder(b) ?? (ao + 2);
    return (ao + bo) / 2;
  };

  const buildVisibleFrom = (prevPlayers) => {
    let list = [...prevPlayers];
    if (activePositionFilter !== 'Overall' && activePositionFilter) {
      if (activePositionFilter === 'FLEX') list = list.filter(p => ['RB','WR','TE'].includes(p.basePos));
      else list = list.filter(p => p.basePos === activePositionFilter);
    }
    if (statusFilters.favorite) list = list.filter(p => p.isFavorite);
    if (statusFilters.hot) list = list.filter(p => p.isHot);
    if (statusFilters.cold) list = list.filter(p => p.isCold);
    if (statusFilters.available) list = list.filter(p => !p.unavailable);

    list = list.filter(player => {
      if (teamFilter && player.team !== teamFilter) return false;
      if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    return list.sort((a,b) => (a.order ?? a.rank) - (b.order ?? b.rank));
  };

  /* ----- Drop: Tier-Grenze (über Tier 1 KEINE) ----- */
  const handleDropAtBoundary = (e, visIndex, where /* 'above' | 'below' */) => {
    e.preventDefault();
    if (!draggedItem) return;

    setPlayersWithHistory(prevPlayers => {
      const visible = buildVisibleFrom(prevPlayers);
      const cloned = [...prevPlayers];
      const fromIdx = cloned.findIndex(p => p.id === draggedItem.id);
      if (fromIdx === -1) return prevPlayers;
      const [moved] = cloned.splice(fromIdx, 1);

      const left = visible[visIndex - 1] ?? null; // letzter im oberen Block
      const right = visible[visIndex] ?? null;     // erster im unteren Block

      let newOrder = between(left, right);
      let newTier;
      if (where === 'above') {
        newTier = left ? left.tier : Math.max(1, (right?.tier ?? moved.tier) - 1);
      } else {
        newTier = right ? right.tier : (left?.tier ?? moved.tier);
      }

      cloned.push({ ...moved, order: newOrder, tier: newTier });

      const normalized = cloned
        .sort((a,b) => (a.order ?? a.rank) - (b.order ?? b.rank))
        .map((p, i) => ({ ...p, rank: i + 1, order: i + 1 }));

      return calculatePositionalRanks(normalized);
    });

    handleDragEnd();
  };

  /* ----- Drop: Zwischen zwei Spielerreihen (eine Zone pro Gap) ----- */
  const handleDropBetweenRows = (e, visIndex /* drop VOR diesem Index */) => {
    e.preventDefault();
    if (!draggedItem) return;

    setPlayersWithHistory(prevPlayers => {
      const visible = buildVisibleFrom(prevPlayers);

      const cloned = [...prevPlayers];
      const fromIdx = cloned.findIndex(p => p.id === draggedItem.id);
      if (fromIdx === -1) return prevPlayers;

      const [moved] = cloned.splice(fromIdx, 1);

      const left = visible[visIndex - 1] ?? null;
      const right = visible[visIndex] ?? null;

      let newOrder;
      if (!left && right) newOrder = (getOrder(right) ?? 0) - 1;
      else if (left && !right) newOrder = (getOrder(left) ?? 0) + 1;
      else newOrder = between(left, right);

      let newTier;
      if (left && right) {
        newTier = (left.tier === right.tier) ? left.tier : right.tier; // Gap gehört logisch zum rechten Tier
      } else if (left) newTier = left.tier;
      else if (right) newTier = right.tier;
      else newTier = moved.tier;

      cloned.push({ ...moved, order: newOrder, tier: newTier });

      const normalized = cloned
        .sort((a,b) => (a.order ?? a.rank) - (b.order ?? b.rank))
        .map((p, i) => ({ ...p, rank: i + 1, order: i + 1 }));

      return calculatePositionalRanks(normalized);
    });

    handleDragEnd();
  };

  /* ======= GLOBALER DROP-HANDLER =======
     Nutzt die zuletzt aktive Zone (hoverKey) als Ziel,
     egal wo im tbody gedroppt wird. */
  const handleGlobalDrop = (e) => {
    e.preventDefault();
    if (!draggedItem || !hoverKey) {
      handleDragEnd();
      return;
    }

    // Muster:
    // 'tier-<tier>-above-<index>'
    // 'tier-<tier>-below-<index>'
    // 'gap-before-<index>'
    // 'end'
    if (hoverKey === 'end') {
      handleDropBetweenRows(e, filteredAndSortedPlayers.length);
      return;
    }

    const tierAboveMatch = hoverKey.match(/^tier-(\d+)-above-(\d+)$/);
    if (tierAboveMatch) {
      const idx = parseInt(tierAboveMatch[2], 10);
      handleDropAtBoundary(e, idx, 'above');
      return;
    }

    const tierBelowMatch = hoverKey.match(/^tier-(\d+)-below-(\d+)$/);
    if (tierBelowMatch) {
      const idx = parseInt(tierBelowMatch[2], 10);
      handleDropAtBoundary(e, idx, 'below');
      return;
    }

    const gapMatch = hoverKey.match(/^gap-before-(\d+)$/);
    if (gapMatch) {
      const idx = parseInt(gapMatch[1], 10);
      handleDropBetweenRows(e, idx);
      return;
    }

    // Fallback: nichts erkannt → nur aufräumen
    handleDragEnd();
  };

  const positionButtons = ['Overall', 'QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'];

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 bg-gray-900 text-gray-200 min-h-screen font-sans">
      <div className="bg-gray-800 rounded-lg shadow-2xl flex flex-col h-[calc(100vh-2rem)]">
        {/* Kopfbereich */}
        <div className="flex-shrink-0">
          <div className="p-4 bg-gray-700/50 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                <UploadCloudIcon className="w-5 h-5" /> CSV importieren
              </label>
              <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              <button
                onClick={exportToCSV}
                disabled={players.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <DownloadIcon className="w-5 h-5" /> CSV exportieren
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={undo} disabled={historyIndex <= 0} className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition disabled:bg-gray-700 disabled:cursor-not-allowed" title="Rückgängig">
                <UndoIcon className="w-5 h-5" />
              </button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition disabled:bg-gray-700 disabled:cursor-not-allowed" title="Wiederholen">
                <RedoIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-gray-700 flex flex-wrap items-center justify-between gap-y-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <button onClick={() => handleStatusFilterToggle('available')} title="Nur verfügbare Spieler" className={`p-2 rounded-md transition-colors ${statusFilters.available ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                <CheckSquareIcon className="w-5 h-5" />
              </button>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                {positionButtons.map(pos => (
                  <button
                    key={pos}
                    onClick={() => setActivePositionFilter(pos)}
                    className={`px-3 py-1.5 text-sm sm:text-base font-semibold rounded-md transition-all duration-200 ${activePositionFilter === pos ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-600'}`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="team-filter" className="text-sm font-medium text-gray-400">Team:</label>
                <select
                  id="team-filter"
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-600 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Alle</option>
                  {uniqueTeams.map(team => (<option key={team} value={team}>{team}</option>))}
                </select>
              </div>
              <div className="relative flex items-center">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  id="search-filter"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Suchen..."
                  className="w-40 bg-gray-700 border border-gray-600 rounded-md py-1.5 pl-9 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2 text-gray-400 hover:text-white" aria-label="Suche zurücksetzen">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => handleStatusFilterToggle('favorite')} title="Favoriten" className={`p-2 rounded-md transition-colors ${statusFilters.favorite ? 'bg-yellow-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><StarIcon className="w-5 h-5" /></button>
              <button onClick={() => handleStatusFilterToggle('hot')} title="Hot" className={`p-2 rounded-md transition-colors ${statusFilters.hot ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><FireIcon className="w-5 h-5" /></button>
              <button onClick={() => handleStatusFilterToggle('cold')} title="Cold" className={`p-2 rounded-md transition-colors ${statusFilters.cold ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><SnowflakeIcon className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {/* Tabelle */}
        <div className="flex-grow overflow-y-auto relative">
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead className="bg-gray-800">
              <tr className="sticky top-0 bg-gray-800 z-10 border-b-2 border-gray-600">
                <th className="p-3 text-center w-12 font-semibold">✓</th>
                <th className="p-3 text-left font-semibold">RK</th>
                <th className="p-3 text-left font-semibold">PLAYER NAME</th>
                <th className="p-3 text-left font-semibold">TEAM</th>
                <th className="p-3 text-left font-semibold">POS</th>
                <th className="p-3 text-center font-semibold">BYE</th>
                <th className="p-3 text-left min-w-[200px] font-semibold">NOTIZEN</th>
                <th className="p-3 text-center w-12 font-semibold"><StarIcon className="w-4 h-4 mx-auto" /></th>
                <th className="p-3 text-center w-12 font-semibold"><FireIcon className="w-4 h-4 mx-auto" /></th>
                <th className="p-3 text-center w-12 font-semibold"><SnowflakeIcon className="w-4 h-4 mx-auto" /></th>
              </tr>
            </thead>

            {/* Wichtig: global onDrop nutzt hoverKey → Zielzone */}
            <tbody
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleGlobalDrop}
            >
              {/* Falls keine Spieler */}
              {filteredAndSortedPlayers.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center p-8 text-gray-500">
                    Keine Spieler gefunden. Bitte eine CSV-Datei hochladen.
                  </td>
                </tr>
              )}

              {filteredAndSortedPlayers.map((player, index) => {
                const prev = filteredAndSortedPlayers[index - 1] || null;
                const isNewTier = index === 0 || player.tier !== prev?.tier;

                const tierAboveKey = `tier-${player.tier}-above-${index}`;
                const tierBelowKey = `tier-${player.tier}-below-${index}`;
                const gapKey = `gap-before-${index}`;

                return (
                  <React.Fragment key={player.id}>
                    {/* ---- Tier-Header: KEINE Dropzone über Tier 1 ---- */}
                    {isNewTier && player.tier !== 1 && (
                      <DropZoneRow
                        ariaLabel={`Tier ${player.tier} oben`}
                        active={hoverKey === tierAboveKey}
                        onDragOver={(e) => { e.preventDefault(); setHoverKey(tierAboveKey); }}
                        // onDrop optional — globaler Drop fängt ohnehin ab
                      />
                    )}

                    {/* ---- Tier-Header ---- */}
                    {isNewTier && (
                      <tr className="bg-blue-800/50 text-white">
                        <td colSpan="10" className="px-4 py-1 text-sm font-bold tracking-wider">
                          Tier {player.tier}
                        </td>
                      </tr>
                    )}

                    {/* ---- Tier-Header: Dropzone UNTER der Tier-Zeile (auch bei Tier 1) ---- */}
                    {isNewTier && (
                      <DropZoneRow
                        ariaLabel={`Tier ${player.tier} unten`}
                        active={hoverKey === tierBelowKey}
                        onDragOver={(e) => { e.preventDefault(); setHoverKey(tierBelowKey); }}
                      />
                    )}

                    {/* ---- Zwischen Spielerzeilen: eine Zone pro Gap ---- */}
                    {!isNewTier && (
                      <DropZoneRow
                        ariaLabel={`Gap vor Zeile ${index}`}
                        active={hoverKey === gapKey}
                        onDragOver={(e) => { e.preventDefault(); setHoverKey(gapKey); }}
                      />
                    )}

                    {/* ---- Spielerzeile ---- */}
                    <tr
                      className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150 cursor-grab active:cursor-grabbing ${draggedItem?.id === player.id ? 'opacity-40' : ''} ${player.unavailable ? 'opacity-50 bg-gray-800/60' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, player)}
                      onDragEnd={handleDragEnd}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={player.unavailable}
                          onChange={() => toggleAvailability(player.id)}
                          className="w-4 h-4 cursor-pointer bg-gray-600 border-gray-500 rounded text-blue-500 focus:ring-blue-500"
                        />
                      </td>

                      <td className={`p-3 text-center ${player.unavailable ? 'line-through text-gray-500' : ''}`}>
                        {editingCell === `${player.id}-rank` ? (
                          <input
                            type="number"
                            defaultValue={player.rank}
                            onBlur={(e) => handleCellEdit(player.id, 'rank', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                            className="px-2 py-1 border border-gray-600 rounded bg-gray-900 w-16 text-center"
                            autoFocus
                          />
                        ) : (
                          <span
                            className="cursor-pointer hover:bg-gray-600/50 px-2 py-1 rounded inline-flex items-center gap-1 group"
                            onClick={() => setEditingCell(`${player.id}-rank`)}
                          >
                            {player.rank}
                            <Edit2 className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                        )}
                      </td>

                      <td className={`p-3 group ${player.unavailable ? 'line-through text-gray-500' : ''}`}>
                        <span className="font-medium text-gray-100">{player.name}</span>
                      </td>

                      <td className={`p-3 ${player.unavailable ? 'line-through text-gray-500' : ''}`}>
                        <span className="font-semibold text-gray-400">{player.team}</span>
                      </td>

                      <td className={`p-3 ${player.unavailable ? 'line-through text-gray-500' : 'text-gray-300'}`}>{player.pos}</td>

                      <td className={`p-3 text-center ${player.unavailable ? 'line-through text-gray-500' : ''}`}>
                        <span className="font-medium">{player.byeWeek}</span>
                      </td>

                      <td className="p-3">
                        {editingCell === `${player.id}-notes` ? (
                          <input
                            type="text"
                            defaultValue={player.notes}
                            onBlur={(e) => handleCellEdit(player.id, 'notes', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                            className="px-2 py-1 border border-gray-600 rounded bg-gray-900 w-full"
                            placeholder="Notiz hinzufügen..."
                            autoFocus
                          />
                        ) : (
                          <span
                            className={`cursor-pointer hover:bg-gray-600/50 px-2 py-1 rounded block min-h-[28px] w-full ${player.notes ? 'text-gray-300' : 'text-gray-500'}`}
                            onClick={() => setEditingCell(`${player.id}-notes`)}
                          >
                            {player.notes || '+ Notiz'}
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => togglePlayerStatus(player.id, 'isFavorite')}
                          className={`p-1 rounded-full transition-colors ${player.isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
                        >
                          <StarIcon className="w-5 h-5" fill={player.isFavorite ? 'currentColor' : 'none'} />
                        </button>
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => togglePlayerStatus(player.id, 'isHot')}
                          className={`p-1 rounded-full transition-colors ${player.isHot ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                        >
                          <FireIcon className="w-5 h-5" />
                        </button>
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => togglePlayerStatus(player.id, 'isCold')}
                          className={`p-1 rounded-full transition-colors ${player.isCold ? 'text-blue-400' : 'text-gray-600 hover:text-blue-400'}`}
                        >
                          <SnowflakeIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}

              {/* Abschluss-Dropzone am Ende */}
              {filteredAndSortedPlayers.length > 0 && (
                <DropZoneRow
                  ariaLabel="Ende der Liste"
                  active={hoverKey === 'end'}
                  onDragOver={(e) => { e.preventDefault(); setHoverKey('end'); }}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return <InteractivePlayerTable />;
}
