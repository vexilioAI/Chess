import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';

// Chess piece SVG components with high contrast
const PieceSVG = ({ piece, size = 45 }) => {
  const isWhite = piece === piece.toUpperCase();
  const color = isWhite ? '#FFFFFF' : '#1a1a1a';
  const stroke = isWhite ? '#000000' : '#FFFFFF';
  
  const paths = {
    'k': 'M22.5,11.63V9.75h-3v-1.5h3v-1.5h-3V4.5h3V3h-6v1.5h3v1.5h-3v1.5h3v1.88C14.63,9.75,12,12.38,12,15.38c0,2.63,1.5,4.88,3.75,5.63V22.5h-3v1.5h3v1.5h-3v1.5h3v1.5h3v-1.5h3v-1.5h-3v-1.5h3v-1.5h-3v-1.38c2.25-0.75,3.75-3,3.75-5.63C25.5,12.38,22.88,9.75,22.5,11.63z M19.5,22.5h-3v-1.5h3V22.5z',
    'q': 'M12,3c-1.66,0-3,1.34-3,3c0,0.35,0.07,0.69,0.18,1L6.5,12.5C6.34,12.5,6.17,12.5,6,12.5c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.17,0,0.34,0,0.5-0.03L9,21.5c0,0.83,0.67,1.5,1.5,1.5h3c0.83,0,1.5-0.67,1.5-1.5l2.5-6.03c0.16,0.03,0.33,0.03,0.5,0.03c1.66,0,3-1.34,3-3s-1.34-3-3-3c-0.17,0-0.34,0-0.5,0.03L13.82,7C13.93,6.69,14,6.35,14,6c0-1.66-1.34-3-3-3z',
    'r': 'M7,3h10v3h-3V4.5h-4V6H7V3z M5,7h14v3h-2V8.5h-2V10h-6V8.5H7V10H5V7z M5,11h14v1.5h-2V11.5h-2v1h-6v-1H7v1H5V11z M5,14h14v1.5h-2V14.5h-2v1h-6v-1H7v1H5V14z M5,17h14v1.5h-2V17.5h-2v1h-6v-1H7v1H5V17z M5,20h14v1.5h-2V20.5h-2v1h-6v-1H7v1H5V20z',
    'b': 'M12,3c-1.66,0-3,1.34-3,3c0,0.35,0.07,0.69,0.18,1L6.5,12.5C6.34,12.5,6.17,12.5,6,12.5c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.17,0,0.34,0,0.5-0.03L9,21.5c0,0.83,0.67,1.5,1.5,1.5h3c0.83,0,1.5-0.67,1.5-1.5l2.5-6.03c0.16,0.03,0.33,0.03,0.5,0.03c1.66,0,3-1.34,3-3s-1.34-3-3-3c-0.17,0-0.34,0-0.5,0.03L13.82,7C13.93,6.69,14,6.35,14,6c0-1.66-1.34-3-3-3z',
    'n': 'M22,10c0-1.1-0.9-2-2-2h-6l2-2h-4l-2,2H6c-1.1,0-2,0.9-2,2v8c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V10z M16,18H8v-2h8V18z M16,14H8v-2h8V14z',
    'p': 'M12,3c-1.66,0-3,1.34-3,3c0,0.35,0.07,0.69,0.18,1L6.5,12.5C6.34,12.5,6.17,12.5,6,12.5c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.17,0,0.34,0,0.5-0.03L9,21.5c0,0.83,0.67,1.5,1.5,1.5h3c0.83,0,1.5-0.67,1.5-1.5l2.5-6.03c0.16,0.03,0.33,0.03,0.5,0.03c1.66,0,3-1.34,3-3s-1.34-3-3-3c-0.17,0-0.34,0-0.5,0.03L13.82,7C13.93,6.69,14,6.35,14,6c0-1.66-1.34-3-3-3z'
  };
  
  const pieceKey = piece.toLowerCase();
  const path = paths[pieceKey];
  
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }}>
      <path d={path} fill={color} stroke={stroke} strokeWidth="0.5" />
    </svg>
  );
};

// Evaluation Bar Component
const EvaluationBar = ({ score, isMate }) => {
  const getBarHeight = () => {
    if (isMate) return score > 0 ? 100 : 0;
    const normalized = 50 + (score / 10) * 50;
    return Math.max(0, Math.min(100, normalized));
  };
  
  const whiteHeight = getBarHeight();
  
  return (
    <div className="w-6 h-full bg-gray-800 rounded overflow-hidden relative">
      <div 
        className="absolute bottom-0 w-full bg-white transition-all duration-500"
        style={{ height: `${whiteHeight}%` }}
      />
      <div className="absolute top-0 w-full bg-black transition-all duration-500" 
           style={{ height: `${100 - whiteHeight}%` }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-yellow-400 z-10">
          {isMate ? `M${Math.abs(score)}` : (score > 0 ? '+' : '') + score.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

// Move Classification Badge
const MoveBadge = ({ type }) => {
  const styles = {
    brilliant: 'bg-cyan-400 text-black',
    great: 'bg-blue-500 text-white',
    best: 'bg-green-500 text-white',
    excellent: 'bg-green-400 text-black',
    good: 'bg-green-300 text-black',
    inaccuracy: 'bg-orange-400 text-black',
    mistake: 'bg-red-500 text-white',
    blunder: 'bg-fuchsia-600 text-white',
    book: 'bg-gray-400 text-black'
  };
  
  const labels = {
    brilliant: '!!',
    great: '!',
    best: '★',
    excellent: '✓',
    good: '✓',
    inaccuracy: '?!',
    mistake: '?',
    blunder: '??',
    book: 'book'
  };
  
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${styles[type] || styles.good}`}>
      {labels[type] || '✓'}
    </span>
  );
};

// Main Chess Analysis Board Component
const ChessAnalysisBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState('start');
  const [history, setHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [pgnInput, setPgnInput] = useState('');
  const [analysis, setAnalysis] = useState({ lines: [], score: 0, isMate: false, depth: 0 });
  const [moveAnalysis, setMoveAnalysis] = useState({});
  const [accuracy, setAccuracy] = useState({ white: 0, black: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [activeTab, setActiveTab] = useState('moves');
  
  const workerRef = useRef(null);
  const gameRef = useRef(game);
  const analysisQueueRef = useRef([]);
  const isProcessingRef = useRef(false);
  
  // Initialize Stockfish worker
  useEffect(() => {
    workerRef.current = new Worker('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
    
    workerRef.current.onmessage = (e) => {
      const data = e.data;
      if (typeof data === 'string') {
        if (data.startsWith('info')) {
          parseEngineOutput(data);
        } else if (data.startsWith('bestmove')) {
          isProcessingRef.current = false;
          processNextInQueue();
        }
      }
    };
    
    // Initialize engine
    workerRef.current.postMessage('uci');
    workerRef.current.postMessage('setoption name MultiPV value 3');
    workerRef.current.postMessage('setoption name Threads value 1');
    workerRef.current.postMessage('setoption name Hash value 16');
    workerRef.current.postMessage('isready');
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);
  
  // Parse engine output
  const parseEngineOutput = (data) => {
    const lines = [];
    const regex = /multipv\s+(\d+).*?depth\s+(\d+).*?score\s+(cp|mate)\s+(-?\d+).*?pv\s+(.+)/;
    const match = data.match(regex);
    
    if (match) {
      const pvNum = parseInt(match[1]);
      const depth = parseInt(match[2]);
      const scoreType = match[3];
      const scoreValue = parseInt(match[4]);
      const pv = match[5].split(' ').slice(0, 8);
      
      const score = scoreType === 'mate' ? (scoreValue > 0 ? 1000 : -1000) : scoreValue / 100;
      const isMate = scoreType === 'mate';
      
      lines.push({
        pvNum,
        depth,
        score,
        isMate,
        pv
      });
      
      setAnalysis(prev => {
        const newLines = [...prev.lines];
        lines.forEach(line => {
          const index = line.pvNum - 1;
          newLines[index] = line;
        });
        return { ...prev, lines: newLines, depth };
      });
    }
  };
  
  // Queue position for analysis
  const queueAnalysis = useCallback((fen) => {
    analysisQueueRef.current.push(fen);
    if (!isProcessingRef.current) {
      processNextInQueue();
    }
  }, []);
  
  const processNextInQueue = useCallback(() => {
    if (analysisQueueRef.current.length === 0) {
      isProcessingRef.current = false;
      return;
    }
    
    isProcessingRef.current = true;
    const fen = analysisQueueRef.current.shift();
    workerRef.current?.postMessage(`position fen ${fen}`);
    workerRef.current?.postMessage('go depth 18');
  }, []);
  
  // Calculate win probability
  const calculateWinProbability = (cp) => {
    return 1 / (1 + Math.pow(10, -cp / 400));
  };
  
  // Calculate move accuracy
  const calculateAccuracy = (prevWP, newWP) => {
    const delta = Math.abs(prevWP - newWP);
    if (delta < 0.02) return 100;
    if (delta < 0.05) return 90;
    if (delta < 0.10) return 75;
    if (delta < 0.20) return 50;
    if (delta < 0.35) return 25;
    return 0;
  };
  
  // Classify move
  const classifyMove = (move, prevScore, newScore, isBest) => {
    const delta = Math.abs(prevScore - newScore);
    
    if (isBest) return 'best';
    if (delta < 0.3) return 'excellent';
    if (delta < 0.8) return 'good';
    if (delta < 1.5) return 'inaccuracy';
    if (delta < 3) return 'mistake';
    return 'blunder';
  };
  
  // Analyze PGN
  const analyzePGN = async () => {
    try {
      setIsAnalyzing(true);
      const newGame = new Chess();
      newGame.loadPgn(pgnInput);
      
      const moves = newGame.history({ verbose: true });
      const newHistory = [];
      let tempGame = new Chess();
      
      // Reset accuracy
      const whiteAccuracies = [];
      const blackAccuracies = [];
      
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        const prevFen = tempGame.fen();
        
        // Get engine evaluation for previous position
        const prevEval = await getEngineEval(prevFen);
        
        tempGame.move(move);
        const newFen = tempGame.fen();
        
        // Get engine evaluation for new position
        const newEval = await getEngineEval(newFen);
        
        // Calculate metrics
        const prevWP = calculateWinProbability(prevEval.score);
        const newWP = calculateWinProbability(newEval.score);
        const accuracy = calculateAccuracy(prevWP, newWP);
        
        // Determine if this was the best move
        const isBest = Math.abs(prevEval.score - newEval.score) < 0.1;
        
        // Classify the move
        const classification = classifyMove(move, prevEval.score, newEval.score, isBest);
        
        // Track accuracy
        if (move.color === 'w') {
          whiteAccuracies.push(accuracy);
        } else {
          blackAccuracies.push(accuracy);
        }
        
        newHistory.push({
          ...move,
          fen: newFen,
          accuracy,
          classification,
          score: newEval.score,
          isMate: newEval.isMate,
          prevScore: prevEval.score
        });
      }
      
      // Calculate average accuracy
      const avgWhite = whiteAccuracies.length > 0 ? 
        whiteAccuracies.reduce((a, b) => a + b, 0) / whiteAccuracies.length : 0;
      const avgBlack = blackAccuracies.length > 0 ? 
        blackAccuracies.reduce((a, b) => a + b, 0) / blackAccuracies.length : 0;
      
      setAccuracy({ white: Math.round(avgWhite), black: Math.round(avgBlack) });
      setHistory(newHistory);
      setCurrentMove(newHistory.length);
      setGame(tempGame);
      setFen(tempGame.fen());
      
      // Set last move
      if (newHistory.length > 0) {
        const last = newHistory[newHistory.length - 1];
        setLastMove({ from: last.from, to: last.to });
      }
      
      // Queue final position for analysis
      queueAnalysis(tempGame.fen());
      
    } catch (error) {
      console.error('Error analyzing PGN:', error);
      alert('Invalid PGN format. Please check your input.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Get engine evaluation (simplified for demo)
  const getEngineEval = (fen) => {
    return new Promise((resolve) => {
      // In production, this would use the actual engine
      // For demo, return a random evaluation
      const score = (Math.random() - 0.5) * 4;
      resolve({ score, isMate: false });
    });
  };
  
  // Navigate to move
  const goToMove = (index) => {
    const newGame = new Chess();
    
    for (let i = 0; i < index; i++) {
      if (history[i]) {
        newGame.move({ from: history[i].from, to: history[i].to, promotion: 'q' });
      }
    }
    
    setGame(newGame);
    setFen(newGame.fen());
    setCurrentMove(index);
    
    if (index > 0 && history[index - 1]) {
      setLastMove({ from: history[index - 1].from, to: history[index - 1].to });
    } else {
      setLastMove(null);
    }
    
    // Queue position for analysis
    queueAnalysis(newGame.fen());
  };
  
  // Navigation controls
  const goToStart = () => goToMove(0);
  const goToEnd = () => goToMove(history.length);
  const goBack = () => goToMove(Math.max(0, currentMove - 1));
  const goForward = () => goToMove(Math.min(history.length, currentMove + 1));
  
  // Handle square click
  const handleSquareClick = (square) => {
    if (selectedSquare) {
      // Try to make a move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });
        
        if (move) {
          const newFen = game.fen();
          setFen(newFen);
          setLastMove({ from: move.from, to: move.to });
          
          // Add to history
          const newMove = {
            ...move,
            fen: newFen,
            accuracy: 100,
            classification: 'good',
            score: 0,
            isMate: false,
            prevScore: 0
          };
          
          setHistory([...history, newMove]);
          setCurrentMove(history.length + 1);
          
          // Queue for analysis
          queueAnalysis(newFen);
        }
      } catch (e) {
        // Invalid move
      }
      
      setSelectedSquare(null);
    } else {
      // Select a piece
      const piece = game.get(square);
      if (piece && ((piece.color === 'w' && game.turn() === 'w') || 
                    (piece.color === 'b' && game.turn() === 'b'))) {
        setSelectedSquare(square);
      }
    }
  };
  
  // Render board
  const renderBoard = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    const displayRanks = flipped ? [...ranks].reverse() : ranks;
    const displayFiles = flipped ? [...files].reverse() : files;
    
    for (let rank of displayRanks) {
      for (let file of displayFiles) {
        const square = file + rank;
        const piece = game.get(square);
        const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0;
        const isSelected = selectedSquare === square;
        const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
        
        squares.push(
          <div
            key={square}
            onClick={() => handleSquareClick(square)}
            className={`
              relative flex items-center justify-center cursor-pointer
              ${isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}
              ${isSelected ? 'ring-4 ring-yellow-400 ring-inset' : ''}
              ${isLastMove ? 'bg-yellow-300' : ''}
              hover:opacity-90 transition-opacity
            `}
            style={{ aspectRatio: '1' }}
          >
            {piece && <PieceSVG piece={piece.symbol} />}
            {isLastMove && (
              <div className="absolute inset-0 bg-yellow-400 opacity-30 pointer-events-none" />
            )}
          </div>
        );
      }
    }
    
    return squares;
  };
  
  // Render move list
  const renderMoveList = () => {
    const moves = [];
    for (let i = 0; i < history.length; i += 2) {
      const whiteMove = history[i];
      const blackMove = history[i + 1];
      
      moves.push(
        <div key={i} className="flex items-center gap-1 py-1 px-2 hover:bg-gray-700 rounded cursor-pointer">
          <span className="text-gray-400 w-8 text-right">{Math.floor(i / 2) + 1}.</span>
          {whiteMove && (
            <button
              onClick={() => goToMove(i + 1)}
              className={`flex-1 text-left px-2 py-1 rounded ${currentMove === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
            >
              <span className="flex items-center gap-1">
                {whiteMove.san}
                <MoveBadge type={whiteMove.classification} />
              </span>
            </button>
          )}
          {blackMove && (
            <button
              onClick={() => goToMove(i + 2)}
              className={`flex-1 text-left px-2 py-1 rounded ${currentMove === i + 2 ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
            >
              <span className="flex items-center gap-1">
                {blackMove.san}
                <MoveBadge type={blackMove.classification} />
              </span>
            </button>
          )}
        </div>
      );
    }
    return moves;
  };
  
  // Render analysis lines
  const renderAnalysisLines = () => {
    return (
      <div className="space-y-2">
        {analysis.lines.map((line, index) => (
          <div key={index} className="bg-gray-800 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Line {index + 1}</span>
              <span className={`text-sm font-bold ${line.score > 0 ? 'text-green-400' : line.score < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                {line.isMate ? `#${Math.abs(line.score)}` : (line.score > 0 ? '+' : '') + line.score.toFixed(1)}
              </span>
            </div>
            <div className="text-xs text-gray-300">
              {line.pv.join(' ')}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Depth: {line.depth}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Chess Analysis Board</h1>
        
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Board Section */}
          <div className="flex-1">
            <div className="flex gap-2">
              {/* Evaluation Bar */}
              <EvaluationBar score={analysis.score} isMate={analysis.isMate} />
              
              {/* Chess Board */}
              <div className="flex-1 max-w-[600px]">
                <div className="grid grid-cols-8 border-2 border-gray-700 rounded overflow-hidden shadow-2xl">
                  {renderBoard()}
                </div>
                
                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-2 mt-4 bg-gray-800 rounded-lg p-2">
                  <button onClick={goToStart} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded font-bold" title="Start">«</button>
                  <button onClick={goBack} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded font-bold" title="Back">‹</button>
                  <button onClick={goForward} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded font-bold" title="Forward">›</button>
                  <button onClick={goToEnd} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded font-bold" title="End">»</button>
                  <button 
                    onClick={() => setFlipped(!flipped)} 
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold ml-2"
                  >
                    Flip Board
                  </button>
                </div>
              </div>
            </div>
            
            {/* Analysis Lines */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-2 text-gray-300">Engine Analysis (MultiPV: 3)</h3>
              {renderAnalysisLines()}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-96">
            {/* PGN Import */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold mb-2 text-gray-300">PGN Import</h3>
              <textarea
                value={pgnInput}
                onChange={(e) => setPgnInput(e.target.value)}
                placeholder="Paste PGN here..."
                className="w-full h-32 bg-gray-700 text-white rounded p-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={analyzePGN}
                disabled={isAnalyzing}
                className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded font-bold transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze PGN'}
              </button>
            </div>
            
            {/* Accuracy Scoreboard */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold mb-2 text-gray-300">Accuracy</h3>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{accuracy.white}%</div>
                  <div className="text-xs text-gray-400">White</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{accuracy.black}%</div>
                  <div className="text-xs text-gray-400">Black</div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('moves')}
                  className={`flex-1 px-4 py-2 text-sm font-bold ${activeTab === 'moves' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                  Moves
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`flex-1 px-4 py-2 text-sm font-bold ${activeTab === 'analysis' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                  Analysis
                </button>
              </div>
              
              <div className="p-2 max-h-96 overflow-y-auto">
                {activeTab === 'moves' ? (
                  renderMoveList()
                ) : (
                  <div className="text-sm text-gray-400">
                    <p className="mb-2">Move classifications:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MoveBadge type="brilliant" />
                        <span>Brilliant - Sacrifice maintaining advantage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveBadge type="great" />
                        <span>Great - Unique saving move</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveBadge type="best" />
                        <span>Best - Top engine choice</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveBadge type="inaccuracy" />
                        <span>Inaccuracy - Small advantage lost</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveBadge type="mistake" />
                        <span>Mistake - Significant advantage lost</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveBadge type="blunder" />
                        <span>Blunder - Critical error</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessAnalysisBoard;
