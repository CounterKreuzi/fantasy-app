import React, { useState, useMemo, useCallback, useRef } from 'react';

// --- SVG-Icon-Komponenten (unverändert) ---
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

// Hilfskomponente für den visuellen Drop-Indikator
const DropIndicator = () => (
    <tr><td colSpan="10" className="p-0"><div className="h-2 bg-blue-500 rounded-full mx-2 my-1 transition-[height] duration-100 ease-out"></div></td></tr>
);

const DropAnchorRow = ({ onDrop }) => (
    <tr onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
        <td colSpan="10" className="p-0"><div className="h-2 bg-blue-500 rounded-full mx-2 my-1 transition-[height] duration-100 ease-out"></div></td>
    </tr>
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

    // Drag & Drop State
    const [draggedItem, setDraggedItem] = useState(null);
    const [dropInfo, setDropInfo] = useState({ index: null, above: false, isHeader: false });

    // History und Player Management
    const [history, setHistory] = useState([]);
    const hoverTimer = useRef(null);
    const lastCommittedKey = useRef(null);
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
    
    // CSV und Editierfunktionen
    const exportToCSV = () => {
        if (players.length === 0) {
            console.warn('Keine Daten zum Exportieren vorhanden.');
            return;
        }
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
        if (file) {
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
                const sortedPlayers = parsedPlayers.sort((a,b) => a.rank - b.rank);
                const withOrder = sortedPlayers.map((p, i) => ({ ...p, rank: i + 1, order: i + 1 }));
                const finalPlayers = calculatePositionalRanks(withOrder);
                setPlayers(finalPlayers);
                setHistory([JSON.parse(JSON.stringify(finalPlayers))]);
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
                let newPlayers = [...prev];
                newPlayers.splice(playerIndex, 1);
                const insertIndex = Math.min(targetRank - 1, newPlayers.length);
                newPlayers.splice(insertIndex, 0, player);
                const updatedRanks = newPlayers.map((p, index) => ({ ...p, rank: index + 1 }));
                return calculatePositionalRanks(updatedRanks);
            }
            return prev.map(p => p.id === playerId ? { ...p, [field]: value } : p);
        });
        setEditingCell(null);
    };

    const getFilteredByPosition = useCallback((playersList) => {
        switch(activePositionFilter) {
            case 'QB': return playersList.filter(p => p.basePos === 'QB');
            case 'RB': return playersList.filter(p => p.basePos === 'RB');
            case 'WR': return playersList.filter(p => p.basePos === 'WR');
            case 'TE': return playersList.filter(p => p.basePos === 'TE');
            case 'FLEX': return playersList.filter(p => ['RB', 'WR', 'TE'].includes(p.basePos));
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


    // --- Drag & Drop Logik ---

    const handleDragStart = (e, player) => {
        setDraggedItem(player);
    };

    const handleDragEnd = () => {
        if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
        lastCommittedKey.current = null;
        setDraggedItem(null);
        setDropInfo({ index: null, above: false, isHeader: false });
    };

    

const handleDragOver = (e, index, isHeader = false) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const isAbove = e.clientY < rect.top + rect.height / 2;

        const key = `${index}|${isHeader ? 'H' : 'R'}|${isAbove ? 'A' : 'B'}`;
        if (key === lastCommittedKey.current) return;

        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => {
            setDropInfo({ index, above: isAbove, isHeader });
            lastCommittedKey.current = key;
        }, 90); // 90ms Hover-Intent -> deutlich weniger Flackern
    };


export default function App() {
    return <InteractivePlayerTable />;
}
