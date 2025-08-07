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

const InteractivePlayerTable = () => {
    // --- States (unverändert) ---
    const [players, setPlayers] = useState([]);
    const [activePositionFilter, setActivePositionFilter] = useState('Overall');
    const [teamFilter, setTeamFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilters, setStatusFilters] = useState({ /* ... */ });
    const [editingCell, setEditingCell] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    // State für Drag-Over-Info wurde präzisiert
    const [dragOverInfo, setDragOverInfo] = useState({ dropIndex: null, targetTier: null });

    // --- Undo/Redo Logik (unverändert) ---
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const isPerformingHistoryAction = useRef(false);
    const addToHistory = useCallback((newPlayers) => { /* ... */ }, []);
    const undo = useCallback(() => { /* ... */ }, []);
    const redo = useCallback(() => { /* ... */ }, []);
    const setPlayersWithHistory = useCallback((updateFunction) => { /* ... */ }, []);

    // --- Helper-Funktionen (unverändert) ---
    const uniqueTeams = [...new Set(players.map(p => p.team))].sort();
    const calculatePositionalRanks = (playerList) => { /* ... */ };
    const exportToCSV = () => { /* ... */ };
    const handleFileUpload = (event) => { /* ... */ };
    const togglePlayerStatus = (playerId, statusKey) => { /* ... */ };
    const handleStatusFilterToggle = (filterKey) => { /* ... */ };
    const toggleAvailability = (playerId) => { /* ... */ };
    const handleRankEdit = (playerId, newRank) => { /* ... */ };
    const handleCellEdit = (playerId, field, value) => { /* ... */ };

    // --- Drag & Drop Logik (überarbeitet) ---
    const handleDragStart = (e, player) => {
        setDraggedItem(player);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', player.id);
    };

    // KORREKTUR (BUG 1): `handleDragOver` wurde überarbeitet, um die exakte Drop-Position (oben/unten) und das korrekte Ziel-Tier zu ermitteln.
    const handleDragOver = (e, player, indexInVisibleList) => {
        e.preventDefault();
        if (!draggedItem) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const isTopHalf = y < rect.height / 2;

        if (isTopHalf) {
            setDragOverInfo({
                dropIndex: indexInVisibleList,
                targetTier: player.tier
            });
        } else {
            setDragOverInfo({
                dropIndex: indexInVisibleList + 1,
                targetTier: player.tier // Wichtig: Das Tier der aktuellen Zeile wird beibehalten!
            });
        }
    };
    
    // `handleDragOver` für Tier-Header, um Dragging über sie zu ermöglichen
    const handleDragOverTierHeader = (e, tier, firstPlayerIndexOfTier) => {
        e.preventDefault();
        if (!draggedItem) return;
        setDragOverInfo({
            dropIndex: firstPlayerIndexOfTier,
            targetTier: tier
        });
    };

    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverInfo({ dropIndex: null, targetTier: null });
        }
    };

    // KORREKTUR (BUG 1 & 2): `handleDrop` wurde komplett neu geschrieben, um beide Bugs zu beheben.
    const handleDrop = (e) => {
        e.preventDefault();
        if (!draggedItem || dragOverInfo.dropIndex === null) {
            handleDragEnd();
            return;
        }

        setPlayersWithHistory(prevPlayers => {
            // Schritt 1: Finde den Start-Index des gezogenen Spielers in der aktuell sichtbaren Liste.
            const sourceIndexInVisible = filteredAndSortedPlayers.findIndex(p => p.id === draggedItem.id);
            
            // KORREKTUR (BUG 2): Abbrechen, wenn sich nichts ändert.
            // Verhindert das Verschwinden des Spielers.
            const isDroppingInSamePlace = sourceIndexInVisible === dragOverInfo.dropIndex || sourceIndexInVisible + 1 === dragOverInfo.dropIndex;
            if (isDroppingInSamePlace) {
                return prevPlayers; // Keine Änderung, gib den alten State zurück.
            }

            // Schritt 2: Finde den Spieler, der bewegt werden soll.
            const playerToMove = { ...draggedItem, tier: dragOverInfo.targetTier };

            // Schritt 3: Erstelle eine neue Liste OHNE den bewegten Spieler.
            // Wir arbeiten mit der ungefilterten Gesamtliste.
            let reorderedPlayers = prevPlayers.filter(p => p.id !== draggedItem.id);

            // Schritt 4: Finde den Einfügepunkt in der Gesamtliste.
            const dropIndexInVisible = dragOverInfo.dropIndex;
            let finalInsertIndex;

            if (dropIndexInVisible >= filteredAndSortedPlayers.length) {
                // Drop am Ende der sichtbaren Liste
                const lastVisiblePlayer = filteredAndSortedPlayers[filteredAndSortedPlayers.length - 1];
                if (lastVisiblePlayer) {
                    const idx = reorderedPlayers.findIndex(p => p.id === lastVisiblePlayer.id);
                    finalInsertIndex = idx + 1;
                } else {
                    finalInsertIndex = reorderedPlayers.length;
                }
            } else {
                // Drop vor einem existierenden Spieler in der sichtbaren Liste
                const targetPlayerInVisibleList = filteredAndSortedPlayers[dropIndexInVisible];
                finalInsertIndex = reorderedPlayers.findIndex(p => p.id === targetPlayerInVisibleList.id);
            }
            
            // Fallback, falls etwas schiefgeht
            if (finalInsertIndex === -1) {
                finalInsertIndex = reorderedPlayers.length;
            }

            // Schritt 5: Füge den Spieler an der neuen Position ein.
            reorderedPlayers.splice(finalInsertIndex, 0, playerToMove);

            // Schritt 6: Berechne Ränge neu und gib den finalen State zurück.
            const finalPlayersWithRanks = reorderedPlayers.map((p, i) => ({ ...p, rank: i + 1 }));
            return calculatePositionalRanks(finalPlayersWithRanks);
        });

        handleDragEnd();
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverInfo({ dropIndex: null, targetTier: null });
    };

    // --- Filter- und Sortierlogik (unverändert) ---
    const getFilteredByPosition = useCallback((playersList) => { /* ... */ }, []);
    const filteredAndSortedPlayers = useMemo(() => { /* ... */ }, []);
    const positionButtons = ['Overall', 'QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'];

    return (
        <div className="max-w-7xl mx-auto p-2 sm:p-4 bg-gray-900 text-gray-200 min-h-screen font-sans">
            <div className="bg-gray-800 rounded-lg shadow-2xl flex flex-col h-[calc(100vh-2rem)]">
                {/* OBERER BEREICH: Bleibt immer sichtbar (unverändert) */}
                <div className="flex-shrink-0">
                    {/* ... Filter und Buttons ... */}
                </div>

                {/* SCROLL-BEREICH (unverändert) */}
                <div className="flex-grow overflow-y-auto relative" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-800">
                            <tr className="sticky top-0 bg-gray-800 z-20 border-b-2 border-gray-600">
                                {/* ... Tabellen-Header ... */}
                            </tr>
                        </thead>
                        <tbody onDragLeave={handleDragLeave}>
                            {filteredAndSortedPlayers.length > 0 ? filteredAndSortedPlayers.map((player, index) => {
                                const showTierHeader = index === 0 || player.tier !== filteredAndSortedPlayers[index - 1].tier;
                                return (
                                    <React.Fragment key={player.id}>
                                        {showTierHeader && (
                                            <tr className="bg-blue-800/50 text-white" onDragOver={(e) => handleDragOverTierHeader(e, player.tier, index)}>
                                                <td colSpan="10" className="px-4 py-1 text-sm font-bold tracking-wider">
                                                    Tier {player.tier}
                                                </td>
                                            </tr>
                                        )}
                                        
                                        {/* Drop-Indikator */}
                                        {dragOverInfo.dropIndex === index && (
                                            <tr><td colSpan="10" className="p-0"><div className="h-1 bg-blue-500 rounded-full"></div></td></tr>
                                        )}
                                        
                                        <tr className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150 cursor-grab active:cursor-grabbing ${draggedItem?.id === player.id ? 'opacity-30 bg-gray-700' : ''} ${player.unavailable ? 'opacity-50 bg-gray-800/60' : ''}`}
                                            draggable 
                                            onDragStart={(e) => handleDragStart(e, player)} 
                                            // Wichtig: handleDragOver bekommt jetzt den Index in der *sichtbaren* Liste
                                            onDragOver={(e) => handleDragOver(e, player, index)} 
                                            onDragEnd={handleDragEnd}>
                                            
                                            {/* --- Zellen-Inhalt (unverändert) --- */}
                                            {/* ... */}
                                        </tr>

                                        {/* Drop-Indikator für die letzte Position */}
                                        {index === filteredAndSortedPlayers.length - 1 && dragOverInfo.dropIndex === filteredAndSortedPlayers.length && (
                                             <tr><td colSpan="10" className="p-0"><div className="h-1 bg-blue-500 rounded-full"></div></td></tr>
                                        )}
                                    </React.Fragment>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="10" className="text-center p-8 text-gray-500">
                                        Bitte laden Sie eine CSV-Datei hoch oder es wurden keine Spieler gefunden.
                                    </td>
                                </tr>
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
