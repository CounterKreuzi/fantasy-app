import React, { useState, useMemo, useCallback, useRef } from 'react';

// --- SVG Icon Components (Unchanged) ---
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

// Helper component for the visual drop indicator
const DropIndicator = () => (
    <tr><td colSpan="11" className="p-0"><div className="h-1 bg-blue-500 rounded-full"></div></td></tr>
);

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
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverInfo, setDragOverInfo] = useState({ dropIndex: null, targetTier: null });

    // History (Undo/Redo) state
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const isPerformingHistoryAction = useRef(false);

    // Memoized history function
    const addToHistory = useCallback((newPlayers) => {
        if (isPerformingHistoryAction.current) return;
        const snapshot = JSON.stringify(newPlayers);
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            // Avoid adding duplicate states
            if (newHistory.length > 0 && newHistory[newHistory.length - 1] === snapshot) {
                return prev;
            }
            newHistory.push(snapshot);
            return newHistory.slice(-50); // Keep last 50 states
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
    }, [historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            isPerformingHistoryAction.current = true;
            setPlayers(JSON.parse(history[historyIndex - 1]));
            setHistoryIndex(prev => prev - 1);
            setTimeout(() => { isPerformingHistoryAction.current = false; }, 0);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            isPerformingHistoryAction.current = true;
            setPlayers(JSON.parse(history[historyIndex + 1]));
            setHistoryIndex(prev => prev + 1);
            setTimeout(() => { isPerformingHistoryAction.current = false; }, 0);
        }
    }, [history, historyIndex]);

    // Wrapper function to update players and add to history
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

    // Recalculates positional ranks (e.g., RB1, RB2) after sorting
    const calculatePositionalRanks = (playerList) => {
        const positionCounts = {};
        // Ensure the list is sorted by the master rank before calculating positional ranks
        const sortedList = [...playerList].sort((a, b) => a.rank - b.rank);
        return sortedList.map(player => {
            if (!positionCounts[player.basePos]) {
                positionCounts[player.basePos] = 0;
            }
            positionCounts[player.basePos]++;
            return {
                ...player,
                pos: `${player.basePos}${positionCounts[player.basePos]}`
            };
        });
    };

    const exportToCSV = () => {
        if (players.length === 0) {
            alert('Keine Daten zum Exportieren vorhanden.');
            return;
        }
        const headers = ['RK', 'TIERS', 'PLAYER NAME', 'TEAM', 'POS', 'BYE WEEK', 'Notes', 'Unavailable', 'Favorite', 'Hot', 'Cold'];
        const csvContent = [
            headers.join(','),
            ...players.map(player => [
                player.rank, player.tier, `"${player.name}"`, player.team,
                player.pos, player.byeWeek, `"${player.notes || ''}"`,
                player.unavailable, player.isFavorite,
                player.isHot, player.isCold
            ].join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `fantasy-rankings-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const rows = text.split('\n').slice(1);
                const parsedPlayers = rows.map((row, index) => {
                    const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                    if (columns.length < 5) return null;
                    const rank = parseInt(columns[0]?.replace(/"/g, ''), 10);
                    const name = columns[2]?.replace(/"/g, '');
                    if (!name || isNaN(rank)) return null; // Basic validation

                    return {
                        id: `${name.replace(/\s/g, '-')}-${rank}-${index}`, // DEPLOYMENT FIX: Create a more robust unique ID
                        rank: rank,
                        tier: parseInt(columns[1]?.replace(/"/g, ''), 10) || 1,
                        name: name,
                        team: columns[3]?.replace(/"/g, '') || 'N/A',
                        pos: columns[4]?.replace(/"/g, '') || 'N/A',
                        basePos: (columns[4]?.replace(/"/g, '').match(/[A-Z]+/) || [''])[0],
                        byeWeek: parseInt(columns[5]?.replace(/"/g, ''), 10) || 0,
                        notes: columns[6]?.replace(/"/g, '') || '',
                        unavailable: columns[7] === 'true',
                        isFavorite: columns[8] === 'true',
                        isHot: columns[9] === 'true',
                        isCold: columns[10] === 'true',
                    };
                }).filter(p => p !== null);

                const sortedPlayers = parsedPlayers.sort((a,b) => a.rank - b.rank);
                // Renumber ranks to be contiguous after sorting
                const reRankedPlayers = sortedPlayers.map((p, i) => ({ ...p, rank: i + 1 }));
                const finalPlayers = calculatePositionalRanks(reRankedPlayers);
                setPlayersWithHistory(finalPlayers);
                // Initialize history
                setHistory([JSON.stringify(finalPlayers)]);
                setHistoryIndex(0);
            };
            reader.readAsText(file);
        }
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

    const handleRankEdit = (playerId, newRankStr) => {
        const targetRank = parseInt(newRankStr);
        if (isNaN(targetRank) || targetRank < 1) {
            setEditingCell(null);
            return;
        }
        setPlayersWithHistory(prev => {
            const playerToMove = prev.find(p => p.id === playerId);
            if (!playerToMove) return prev;
            
            let others = prev.filter(p => p.id !== playerId);
            const insertIndex = Math.max(0, Math.min(targetRank - 1, others.length));
            
            others.splice(insertIndex, 0, playerToMove);
            
            const updatedRanks = others.map((p, index) => ({ ...p, rank: index + 1 }));
            return calculatePositionalRanks(updatedRanks);
        });
        setEditingCell(null);
    };

    const handleCellEdit = (playerId, field, value) => {
        if (field === 'rank') {
            handleRankEdit(playerId, value);
            return;
        }
        setPlayersWithHistory(prev => prev.map(p => p.id === playerId ? { ...p, [field]: value } : p));
        setEditingCell(null);
    };

    const handleDragStart = (e, player) => {
        setDraggedItem(player);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', player.id);
    };
    
    const handleDragOverOnPlayerRow = (e, player, indexInVisibleList) => {
        e.preventDefault();
        if (!draggedItem) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const isTopHalf = y < rect.height / 2;

        const dropIndex = isTopHalf ? indexInVisibleList : indexInVisibleList + 1;
        
        let targetTier = player.tier;
        if (!isTopHalf) {
            // If dragging to the bottom half of the last player of a tier,
            // the tier should remain the same, not the next one.
            const nextPlayer = filteredAndSortedPlayers[indexInVisibleList + 1];
            if (nextPlayer && nextPlayer.tier !== player.tier) {
                 targetTier = player.tier;
            }
        }

        setDragOverInfo({ dropIndex, targetTier });
    };
    
    const handleDragOverOnTierHeader = (e, tier, firstPlayerIndex) => {
        e.preventDefault();
        if (!draggedItem) return;
        setDragOverInfo({
            dropIndex: firstPlayerIndex,
            targetTier: tier,
        });
    };

    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverInfo({ dropIndex: null, targetTier: null });
        }
    };

    const handleDrop = () => {
        if (!draggedItem || dragOverInfo.dropIndex === null || dragOverInfo.targetTier === null) {
            handleDragEnd();
            return;
        }

        setPlayersWithHistory(prevPlayers => {
            const playerToMove = { ...draggedItem, tier: dragOverInfo.targetTier };
            let reorderedPlayers = prevPlayers.filter(p => p.id !== draggedItem.id);
            const dropIndexInVisible = dragOverInfo.dropIndex;

            let finalInsertIndex;
            if (dropIndexInVisible >= filteredAndSortedPlayers.length) {
                finalInsertIndex = reorderedPlayers.length;
            } else {
                const targetPlayerInVisibleList = filteredAndSortedPlayers[dropIndexInVisible];
                finalInsertIndex = reorderedPlayers.findIndex(p => p.id === targetPlayerInVisibleList.id);
            }

            if (finalInsertIndex === -1) {
                finalInsertIndex = reorderedPlayers.length;
            }

            reorderedPlayers.splice(finalInsertIndex, 0, playerToMove);

            const finalPlayersWithRanks = reorderedPlayers.map((p, i) => ({ ...p, rank: i + 1 }));
            return calculatePositionalRanks(finalPlayersWithRanks);
        });
        handleDragEnd();
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverInfo({ dropIndex: null, targetTier: null });
    };

    const getFilteredByPosition = useCallback((playersList) => {
        if (activePositionFilter === 'Overall') return playersList;
        if (activePositionFilter === 'FLEX') return playersList.filter(p => ['RB', 'WR', 'TE'].includes(p.basePos));
        return playersList.filter(p => p.basePos === activePositionFilter);
    }, [activePositionFilter]);

    const filteredAndSortedPlayers = useMemo(() => {
        let playersToFilter = getFilteredByPosition(players);
        
        const activeStatusFilters = Object.entries(statusFilters).filter(([, isActive]) => isActive);
        if (activeStatusFilters.length > 0) {
            playersToFilter = playersToFilter.filter(p => {
                return activeStatusFilters.every(([key]) => {
                    if (key === 'available') return !p.unavailable;
                    return p[`is${key.charAt(0).toUpperCase() + key.slice(1)}`];
                });
            });
        }
        
        if (teamFilter) {
            playersToFilter = playersToFilter.filter(p => p.team === teamFilter);
        }
        
        if (searchQuery) {
            playersToFilter = playersToFilter.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        
        return playersToFilter.sort((a,b) => a.rank - b.rank);
    }, [players, getFilteredByPosition, teamFilter, searchQuery, statusFilters]);

    const positionButtons = ['Overall', 'QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'];

    return (
        <div className="max-w-7xl mx-auto p-2 sm:p-4 bg-gray-900 text-gray-200 min-h-screen font-sans">
            <div className="bg-gray-800 rounded-lg shadow-2xl flex flex-col h-[calc(100vh-2rem)]">
                {/* Header and Controls */}
                <div className="flex-shrink-0">
                    {/* Top Bar: Import/Export/History */}
                    <div className="p-4 bg-gray-700/50 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                                <UploadCloudIcon className="w-5 h-5" /> CSV importieren
                            </label>
                            <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                            <button onClick={exportToCSV} disabled={players.length === 0} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed">
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
                    {/* Filter Bar */}
                    <div className="p-3 border-b border-gray-700 flex flex-wrap items-center justify-between gap-y-4">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                            <button onClick={() => handleStatusFilterToggle('available')} title="Nur verfügbare Spieler anzeigen" className={`p-2 rounded-md transition-colors ${statusFilters.available ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                <CheckSquareIcon className="w-5 h-5" />
                            </button>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                {positionButtons.map(pos => (
                                <button key={pos} onClick={() => setActivePositionFilter(pos)} className={`px-3 py-1.5 text-base font-semibold rounded-md transition-all duration-200 ${activePositionFilter === pos ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-600'}`}>
                                    {pos}
                                </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="team-filter" className="text-sm font-medium text-gray-400">Team:</label>
                                <select id="team-filter" value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="px-3 py-1.5 border border-gray-600 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Alle</option>
                                    {uniqueTeams.map(team => (<option key={team} value={team}>{team}</option>))}
                                </select>
                            </div>
                            <div className="relative flex items-center">
                                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                                <input id="search-filter" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Suchen..." className="w-40 bg-gray-700 border border-gray-600 rounded-md py-1.5 pl-9 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-2 text-gray-400 hover:text-white" aria-label="Suche zurücksetzen"><X className="w-4 h-4" /></button>)}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => handleStatusFilterToggle('favorite')} title="Favoriten filtern" className={`p-2 rounded-md transition-colors ${statusFilters.favorite ? 'bg-yellow-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><StarIcon className="w-5 h-5" /></button>
                            <button onClick={() => handleStatusFilterToggle('hot')} title="Hot Player filtern" className={`p-2 rounded-md transition-colors ${statusFilters.hot ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><FireIcon className="w-5 h-5" /></button>
                            <button onClick={() => handleStatusFilterToggle('cold')} title="Cold Player filtern" className={`p-2 rounded-md transition-colors ${statusFilters.cold ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}><SnowflakeIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                {/* Player Table */}
                <div className="flex-grow overflow-y-auto relative" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    <table className="w-full min-w-[900px] border-separate border-spacing-0">
                        <thead className="sticky top-0 bg-gray-800 z-10">
                            <tr className="border-b-2 border-gray-600">
                                <th className="p-3 text-center w-12 font-semibold">✓</th>
                                <th className="p-3 text-left font-semibold w-20">RK</th>
                                <th className="p-3 text-left font-semibold">PLAYER NAME</th>
                                <th className="p-3 text-left font-semibold w-24">TEAM</th>
                                <th className="p-3 text-left font-semibold w-24">POS</th>
                                <th className="p-3 text-center font-semibold w-20">BYE</th>
                                <th className="p-3 text-left min-w-[200px] font-semibold">NOTIZEN</th>
                                <th className="p-3 text-center w-12 font-semibold"><StarIcon className="w-4 h-4 mx-auto" /></th>
                                <th className="p-3 text-center w-12 font-semibold"><FireIcon className="w-4 h-4 mx-auto" /></th>
                                <th className="p-3 text-center w-12 font-semibold"><SnowflakeIcon className="w-4 h-4 mx-auto" /></th>
                            </tr>
                        </thead>
                        <tbody onDragLeave={handleDragLeave}>
                            {filteredAndSortedPlayers.length > 0 ? filteredAndSortedPlayers.map((player, index) => {
                                const showTierHeader = index === 0 || player.tier !== filteredAndSortedPlayers[index - 1].tier;
                                
                                return (
                                    <React.Fragment key={player.id}>
                                        {dragOverInfo.dropIndex === index && <DropIndicator />}

                                        {showTierHeader && (
                                            <tr className="bg-blue-800/50 text-white sticky top-[53px] z-10">
                                                <td colSpan="11" className="px-4 py-1 text-sm font-bold tracking-wider"
                                                    onDragOver={(e) => handleDragOverOnTierHeader(e, player.tier, index)}>
                                                    Tier {player.tier}
                                                </td>
                                            </tr>
                                        )}
                                        
                                        <tr className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150 cursor-grab active:cursor-grabbing ${draggedItem?.id === player.id ? 'opacity-30' : ''} ${player.unavailable ? 'opacity-50 bg-gray-800/60' : ''}`}
                                            draggable 
                                            onDragStart={(e) => handleDragStart(e, player)} 
                                            onDragOver={(e) => handleDragOverOnPlayerRow(e, player, index)} 
                                            onDragEnd={handleDragEnd}>
                                            
                                            <td className="p-3 text-center">
                                                <input type="checkbox" checked={player.unavailable} onChange={() => toggleAvailability(player.id)} className="w-4 h-4 cursor-pointer bg-gray-600 border-gray-500 rounded text-blue-500 focus:ring-blue-500"/>
                                            </td>
                                            <td className={`p-3 text-center ${player.unavailable ? 'line-through text-gray-500' : ''}`}>
                                                {editingCell === `${player.id}-rank` ? (
                                                <input type="number" defaultValue={player.rank} onBlur={(e) => handleCellEdit(player.id, 'rank', e.target.value)} onKeyPress={(e) => e.key === 'Enter' && e.target.blur()} className="px-2 py-1 border border-gray-600 rounded bg-gray-900 w-16 text-center" autoFocus/>
                                                ) : (
                                                <span className="cursor-pointer hover:bg-gray-600/50 px-2 py-1 rounded inline-flex items-center gap-1 group" onClick={() => setEditingCell(`${player.id}-rank`)}>
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
                                                <input type="text" defaultValue={player.notes} onBlur={(e) => handleCellEdit(player.id, 'notes', e.target.value)} onKeyPress={(e) => e.key === 'Enter' && e.target.blur()} className="px-2 py-1 border border-gray-600 rounded bg-gray-900 w-full" placeholder="Notiz hinzufügen..." autoFocus/>
                                                ) : (
                                                <span className={`cursor-pointer hover:bg-gray-600/50 px-2 py-1 rounded block min-h-[28px] w-full ${player.notes ? 'text-gray-300' : 'text-gray-500'}`} onClick={() => setEditingCell(`${player.id}-notes`)}>
                                                    {player.notes || '+ Notiz'}
                                                </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => togglePlayerStatus(player.id, 'isFavorite')} className={`p-1 rounded-full transition-colors ${player.isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}>
                                                    <StarIcon className="w-5 h-5" fill={player.isFavorite ? 'currentColor' : 'none'} />
                                                </button>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => togglePlayerStatus(player.id, 'isHot')} className={`p-1 rounded-full transition-colors ${player.isHot ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}>
                                                    <FireIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => togglePlayerStatus(player.id, 'isCold')} className={`p-1 rounded-full transition-colors ${player.isCold ? 'text-blue-400' : 'text-gray-600 hover:text-blue-400'}`}>
                                                    <SnowflakeIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="11" className="text-center p-8 text-gray-500">
                                        Keine Spielerdaten. Bitte laden Sie eine CSV-Datei hoch.
                                    </td>
                                </tr>
                            )}
                            {filteredAndSortedPlayers.length > 0 && dragOverInfo.dropIndex === filteredAndSortedPlayers.length && <DropIndicator />}
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
