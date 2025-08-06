import React, { useState, useEffect } from 'react';

// Da 'lucide-react' in dieser Umgebung nicht direkt importiert werden kann,
// definieren wir die benötigten Icons als einfache SVG-Komponenten.

const X = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Edit2 = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

const SearchIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <path d="m20 16-4-4 4-4"></path>
        <path d="m4 8 4 4-4 4"></path>
        <path d="m16 4-4 4-4-4"></path>
        <path d="m8 20 4-4 4 4"></path>
    </svg>
);

const CheckSquareIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
);

const UploadCloudIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="M12 12v9"></path>
        <path d="m16 16-4-4-4 4"></path>
    </svg>
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
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Extrahiere alle einzigartigen Teams für den Dropdown
  const uniqueTeams = [...new Set(players.map(p => p.team))].sort();

  // Berechnet die Positions-Rankings (RB1, WR1, etc.) für eine gegebene Spielerliste
  const calculatePositionalRanks = (playerList) => {
    const positionCounts = {};
    // Die Liste muss nach dem Gesamtrang sortiert sein, um korrekte Positionsränge zu erhalten
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

  // CSV-Parser und Ladefunktion
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').slice(1); // Header überspringen
        const parsedPlayers = rows.map(row => {
          const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          if (columns.length < 6) return null;

          const rank = parseInt(columns[0].replace(/"/g, ''), 10);
          const tier = parseInt(columns[1].replace(/"/g, ''), 10);
          const name = columns[2].replace(/"/g, '');
          const team = columns[3].replace(/"/g, '');
          const posRaw = columns[4].replace(/"/g, '');
          const byeWeek = parseInt(columns[5].replace(/"/g, ''), 10);
          const basePos = (posRaw.match(/[A-Z]+/) || [''])[0];

          return {
            id: rank,
            rank,
            tier,
            name,
            team,
            pos: posRaw, // Temporär speichern
            basePos,
            byeWeek,
            unavailable: false,
            notes: '',
            isFavorite: false,
            isHot: false,
            isCold: false,
          };
        }).filter(p => p && !isNaN(p.rank)); 

        const sortedPlayers = parsedPlayers.sort((a,b) => a.rank - b.rank);
        setPlayers(calculatePositionalRanks(sortedPlayers));
      };
      reader.readAsText(file);
    }
  };

  // Toggle für Status-Icons
  const togglePlayerStatus = (playerId, statusKey) => {
    setPlayers(prev => prev.map(player => 
        player.id === playerId 
        ? { ...player, [statusKey]: !player[statusKey] }
        : player
    ));
  };
  
  // Toggle für Status-Filter
  const handleStatusFilterToggle = (filterKey) => {
    setStatusFilters(prev => ({
        ...prev,
        [filterKey]: !prev[filterKey]
    }));
  };


  // Toggle Verfügbarkeit
  const toggleAvailability = (playerId) => {
    setPlayers(prev => prev.map(player => 
        player.id === playerId 
        ? { ...player, unavailable: !player.unavailable }
        : player
    ));
  };

  // Händische Rank-Eingabe
  const handleRankEdit = (playerId, newRank) => {
    const targetRank = parseInt(newRank);
    if (isNaN(targetRank) || targetRank < 1) {
      setEditingCell(null);
      return;
    }

    setPlayers(prev => {
      const playerIndex = prev.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return prev;
      const player = prev[playerIndex];
      
      let newPlayers = [...prev];
      newPlayers.splice(playerIndex, 1);
      
      const insertIndex = Math.min(targetRank - 1, newPlayers.length);
      newPlayers.splice(insertIndex, 0, player);
      
      const updatedRanks = newPlayers.map((p, index) => ({
        ...p,
        rank: index + 1
      }));
      
      return calculatePositionalRanks(updatedRanks);
    });
    
    setEditingCell(null);
  };

  // Inline-Bearbeitung für andere Felder
  const handleCellEdit = (playerId, field, value) => {
    if (field === 'rank') {
      handleRankEdit(playerId, value);
      return;
    }
    
    setPlayers(prev => prev.map(player => 
        player.id === playerId 
        ? { ...player, [field]: value }
        : player
    ));
    setEditingCell(null);
  };

  // Drag & Drop
  const handleDragStart = (e, player) => {
    setDraggedItem(player);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    if (y < height / 2) {
      setDragOverIndex(index);
    } else {
      setDragOverIndex(index + 0.5);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
        setDragOverIndex(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem || dragOverIndex === null) {
        handleDragEnd();
        return;
    }

    setPlayers(prevPlayers => {
        const sourceIndex = prevPlayers.findIndex(p => p.id === draggedItem.id);
        if (sourceIndex === -1) return prevPlayers;

        const reorderedPlayers = [...prevPlayers];
        const [playerToMove] = reorderedPlayers.splice(sourceIndex, 1);

        const dropIndexInVisible = Math.round(dragOverIndex);
        
        let targetPlayerInVisibleList;
        if (dropIndexInVisible < filteredAndSortedPlayers.length) {
            targetPlayerInVisibleList = filteredAndSortedPlayers[dropIndexInVisible];
        } else {
            targetPlayerInVisibleList = null; 
        }

        let finalInsertIndex;
        if (targetPlayerInVisibleList) {
            finalInsertIndex = reorderedPlayers.findIndex(p => p.id === targetPlayerInVisibleList.id);
        } else {
            const lastVisiblePlayer = filteredAndSortedPlayers[filteredAndSortedPlayers.length - 1];
            finalInsertIndex = lastVisiblePlayer ? reorderedPlayers.findIndex(p => p.id === lastVisiblePlayer.id) + 1 : reorderedPlayers.length;
        }
        
        if (finalInsertIndex === -1) finalInsertIndex = reorderedPlayers.length;

        let newTier;
        if (finalInsertIndex >= reorderedPlayers.length) {
            newTier = reorderedPlayers.length > 0 ? reorderedPlayers[reorderedPlayers.length - 1].tier : 1;
        } else {
            newTier = reorderedPlayers[finalInsertIndex].tier;
        }
        playerToMove.tier = newTier;

        reorderedPlayers.splice(finalInsertIndex, 0, playerToMove);

        const finalPlayersWithRanks = reorderedPlayers.map((p, i) => ({ ...p, rank: i + 1 }));
        return calculatePositionalRanks(finalPlayersWithRanks);
    });

    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // Positions-Filter anwenden
  const getFilteredByPosition = (playersList) => {
    switch(activePositionFilter) {
      case 'QB':
        return playersList.filter(p => p.basePos === 'QB');
      case 'RB':
        return playersList.filter(p => p.basePos === 'RB');
      case 'WR':
        return playersList.filter(p => p.basePos === 'WR');
      case 'TE':
        return playersList.filter(p => p.basePos === 'TE');
      case 'FLEX':
        return playersList.filter(p => ['RB', 'WR', 'TE'].includes(p.basePos));
      case 'K':
        return playersList.filter(p => p.basePos === 'K');
      case 'DST':
        return playersList.filter(p => p.basePos === 'DST');
      default:
        return playersList;
    }
  };

  // Gefilterte und sortierte Daten
  const filteredAndSortedPlayers = React.useMemo(() => {
    let playersToFilter = getFilteredByPosition(players);

    if (statusFilters.available) {
        playersToFilter = playersToFilter.filter(p => !p.unavailable);
    }
    if (statusFilters.favorite) {
        playersToFilter = playersToFilter.filter(p => p.isFavorite);
    }
    if (statusFilters.hot) {
        playersToFilter = playersToFilter.filter(p => p.isHot);
    }
    if (statusFilters.cold) {
        playersToFilter = playersToFilter.filter(p => p.isCold);
    }
    
    playersToFilter = playersToFilter.filter(player => {
        if (teamFilter && player.team !== teamFilter) return false;
        if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return playersToFilter.sort((a,b) => a.rank - b.rank);

  }, [players, activePositionFilter, teamFilter, searchQuery, statusFilters]);


  const positionButtons = ['Overall', 'QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DST'];

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 bg-gray-900 text-gray-200 min-h-screen font-sans">
      <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        {/* CSV Upload */}
        <div className="p-4 bg-gray-700/50 border-b border-gray-700 text-center">
            <label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                <UploadCloudIcon className="w-5 h-5" />
                CSV-Datei importieren
            </label>
            <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </div>
        
        {/* Header mit Filtern */}
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
                        className={`px-3 py-1.5 text-base font-semibold rounded-md transition-all duration-200 ${
                        activePositionFilter === pos 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-gray-300 hover:text-white hover:bg-gray-600'
                        }`}
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
                    {uniqueTeams.map(team => (
                        <option key={team} value={team}>{team}</option>
                    ))}
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
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 text-gray-400 hover:text-white"
                            aria-label="Suche zurücksetzen"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => handleStatusFilterToggle('favorite')} title="Favoriten" className={`p-2 rounded-md transition-colors ${statusFilters.favorite ? 'bg-yellow-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    <StarIcon className="w-5 h-5" />
                </button>
                <button onClick={() => handleStatusFilterToggle('hot')} title="Hot" className={`p-2 rounded-md transition-colors ${statusFilters.hot ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    <FireIcon className="w-5 h-5" />
                </button>
                <button onClick={() => handleStatusFilterToggle('cold')} title="Cold" className={`p-2 rounded-md transition-colors ${statusFilters.cold ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    <SnowflakeIcon className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Tabelle */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-700/50 border-b-2 border-gray-600">
              <tr>
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
            <tbody onDragLeave={handleDragLeave} onDrop={handleDrop}>
              {filteredAndSortedPlayers.length > 0 ? filteredAndSortedPlayers.map((player, index) => {
                const showTierHeader = index === 0 || player.tier !== filteredAndSortedPlayers[index - 1].tier;
                
                return (
                  <React.Fragment key={player.id}>
                    {showTierHeader && (
                      <tr className="bg-blue-800/50 text-white sticky top-0 z-10">
                        <td colSpan="10" className="px-4 py-1 text-sm font-bold tracking-wider">
                          Tier {player.tier}
                        </td>
                      </tr>
                    )}
                    {dragOverIndex === index && (
                      <tr><td colSpan="10" className="p-0"><div className="h-1 bg-blue-500 rounded-full"></div></td></tr>
                    )}
                    <tr 
                      className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150 cursor-grab active:cursor-grabbing
                        ${draggedItem?.id === player.id ? 'opacity-30 bg-gray-700' : ''}
                        ${player.unavailable ? 'opacity-50 bg-gray-800/60' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, player)}
                      onDragOver={(e) => handleDragOver(e, index)}
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
                            onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
                            className="px-2 py-1 border border-gray-600 rounded bg-gray-900 w-16 text-center"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="cursor-pointer hover:bg-gray-600/50 px-2 py-1 rounded inline-flex items-center gap-1"
                            onClick={() => setEditingCell(`${player.id}-rank`)}
                          >
                            {player.rank}
                            <Edit2 className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                        )}
                      </td>
                      <td className={`p-3 group ${player.unavailable ? 'line-through text-gray-500' : ''}`}>
                        <span className="font-medium text-gray-100">
                          {player.name}
                        </span>
                      </td>
                      <td className={`p-3 ${player.unavailable ? 'line-through text-gray-500' : ''}`}>
                        <span className="font-semibold text-gray-400">{player.team}</span>
                      </td>
                      <td className={`p-3 ${player.unavailable ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                        {player.pos}
                      </td>
                      <td className={`p-3 text-center ${player.unavailable ? 'line-through text-gray-500' : ''}`}>
                        <span className="font-medium">{player.byeWeek}</span>
                      </td>
                      <td className="p-3">
                        {editingCell === `${player.id}-notes` ? (
                          <input
                            type="text"
                            defaultValue={player.notes}
                            onBlur={(e) => handleCellEdit(player.id, 'notes', e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
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
                    {dragOverIndex === index + 0.5 && (
                      <tr><td colSpan="10" className="p-0"><div className="h-1 bg-blue-500 rounded-full"></div></td></tr>
                    )}
                  </React.Fragment>
                );
              }) : (
                 <tr>
                    <td colSpan="10" className="text-center p-8 text-gray-500">
                        Bitte laden Sie eine CSV-Datei hoch, um die Tabelle zu befüllen.
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
