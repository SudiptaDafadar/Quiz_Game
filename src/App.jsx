import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QUESTIONS, TOPICS } from './data/questions.js';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Volume2, 
  VolumeX, 
  Scissors, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Moon, 
  Sun, 
  Share2, 
  BookOpen, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Keyboard,
  Server
} from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState('dark');

  // Backend status
  const [backendHealth, setBackendHealth] = useState(null);

  // Setup configuration
  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem('omniquest_name') || '';
    } catch {
      return '';
    }
  });
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [isTimedMode, setIsTimedMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questionCount, setQuestionCount] = useState(8);

  // High score & local leaderboard
  const [bestScore, setBestScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('omniquest_best') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('omniquest_board') || '[]');
    } catch {
      return [];
    }
  });

  // Game state
  const [gameState, setGameState] = useState('setup');
  const [activePool, setActivePool] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [lifelinesRemaining, setLifelinesRemaining] = useState(2);
  const [eliminatedIndices, setEliminatedIndices] = useState([]);

  // Turn state
  const [currentOptions, setCurrentOptions] = useState([]);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [lastVerification, setLastVerification] = useState(null);

  // UI helpers
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [isMissedOpen, setIsMissedOpen] = useState(true);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isLoadingDeck, setIsLoadingDeck] = useState(false);
  
  // Refs
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const arenaRef = useRef(null);
  const isAnswerLockedRef = useRef(false);
  const currentQuestionRef = useRef(null);
  const handleTimeExpiredRef = useRef();

  // Check Python backend health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') {
          setBackendHealth(data);
        }
      })
      .catch(() => {
        // Dev proxy initializing
      });

    // Fetch initial leaderboard from Python backend
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
          setLeaderboard(data.leaderboard);
        }
      })
      .catch(() => {});
  }, []);

  // Audio synthesize function
  const playBeep = useCallback((freq, duration = 0.14) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio playback prevented by browser policy
    }
  }, [soundEnabled]);

  // Shuffler utility
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Confetti effect
  const triggerConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#e11d48', '#38bdf8', '#10b981', '#fbbf24', '#6366f1', '#f43f5e'];
    const particles = Array.from({ length: 120 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12,
      gravity: 0.35,
    }));

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (++frame < 120) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  }, []);

  // Start game with a question deck
  const startGameWithDeck = (deck) => {
    setActivePool(deck);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongQuestions([]);
    setLifelinesRemaining(2);
    setGameState('playing');
    loadQuestion(deck, 0);
  };

  // When time expires: reveal the correct answer with zero latency
  const handleTimeExpired = useCallback((q) => {
    if (isAnswerLockedRef.current) return;
    isAnswerLockedRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const currentQ = q || currentQuestionRef.current;
    if (!currentQ) return;
    const correctOpt = currentQ.o[currentQ.a];

    setIsAnswerLocked(true);
    setIsTimedOut(true);
    setSelectedAnswerIndex(null);
    setStreak(0);
    setWrongQuestions((prev) => [...prev, currentQ]);
    playBeep(220, 0.25);
    setLastVerification({
      isCorrect: false,
      correctAnswer: correctOpt,
      explanation: currentQ.e,
      pointsGain: 0,
      speedBonus: 0,
      streakBonus: 0,
    });
  }, [playBeep]);

  handleTimeExpiredRef.current = handleTimeExpired;

  const loadQuestion = (deck, idx) => {
    if (idx >= deck.length) {
      finishGame();
      return;
    }
    const q = deck[idx];
    currentQuestionRef.current = q;
    isAnswerLockedRef.current = false;
    setCurrentOptions(shuffleArray(q.o));
    setSelectedAnswerIndex(null);
    setIsAnswerLocked(false);
    setIsTimedOut(false);
    setEliminatedIndices([]);
    setLastVerification(null);
    setTimeLeft(15);

    if (timerRef.current) clearInterval(timerRef.current);
    if (isTimedMode) {
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remain = Math.max(0, 15 - elapsed);
        setTimeLeft(remain);
        if (remain <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeExpiredRef.current?.(q);
        }
      }, 100);
    }
  };

  // Instant zero-delay answer selection
  const handleSelectAnswer = (chosenOpt, optIndex) => {
    if (isAnswerLockedRef.current || eliminatedIndices.includes(optIndex)) return;
    isAnswerLockedRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const q = activePool[currentIndex];
    const correctOpt = q.o[q.a];
    const isCorrect = chosenOpt === correctOpt;

    // Instantly calculate scores and bonuses with 0ms latency
    const speedBonus = isCorrect && isTimedMode ? Math.round(timeLeft * 6) : 0;
    const streakBonus = isCorrect ? streak * 15 : 0;
    const totalGain = isCorrect ? 100 + speedBonus + streakBonus : 0;

    // Lock and update UI state immediately in the current frame
    setIsAnswerLocked(true);
    setIsTimedOut(false);
    setSelectedAnswerIndex(optIndex);
    setLastVerification({
      isCorrect,
      correctAnswer: correctOpt,
      explanation: q.e,
      pointsGain: totalGain,
      speedBonus,
      streakBonus,
    });

    if (isCorrect) {
      playBeep(660, 0.16);
      setTimeout(() => playBeep(880, 0.14), 80);
      setScore((prev) => prev + totalGain);
      setCorrectCount((prev) => prev + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((prev) => Math.max(prev, nextStreak));
    } else {
      playBeep(220, 0.25);
      setStreak(0);
      setWrongQuestions((prev) => [...prev, q]);
    }

    // Background asynchronous sync with Python backend (fire-and-forget, 0ms UI delay)
    fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: q.id,
        selectedAnswer: chosenOpt,
        timeLeft,
        streak,
        isTimed: isTimedMode,
      }),
    }).catch(() => {
      // Background sync complete
    });
  };

  const handleUseLifeline = () => {
    if (isAnswerLockedRef.current || lifelinesRemaining <= 0) return;
    const q = activePool[currentIndex];
    const correctOpt = q.o[q.a];

    const wrongIndices = [];
    currentOptions.forEach((opt, idx) => {
      if (opt !== correctOpt) wrongIndices.push(idx);
    });

    const shuffledWrong = shuffleArray(wrongIndices).slice(0, 2);
    setEliminatedIndices(shuffledWrong);
    setLifelinesRemaining((prev) => prev - 1);
    playBeep(520, 0.08);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= activePool.length) {
      finishGame();
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      loadQuestion(activePool, nextIdx);
    }
  };

  const finishGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('results');

    if (score > bestScore) {
      setBestScore(score);
      try {
        localStorage.setItem('omniquest_best', score.toString());
      } catch {
        // storage disabled
      }
    }

    if (activePool.length >= 4) {
      const topicName = selectedTopic === 'Marvel' ? 'Marvel Universe' : selectedTopic;
      const newEntry = {
        name: playerName.trim() || 'Hero',
        topic: topicName,
        score: score,
        correct: correctCount,
        total: activePool.length,
        date: new Date().toLocaleDateString(),
      };

      // Post to Python backend /api/leaderboard
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.leaderboard) {
            setLeaderboard(data.leaderboard);
          }
        })
        .catch(() => {});

      const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 6);
      setLeaderboard(updated);
      try {
        localStorage.setItem('omniquest_board', JSON.stringify(updated));
      } catch {
        // storage disabled
      }
    }

    const accuracyRate = Math.round((correctCount / activePool.length) * 100);
    if (accuracyRate >= 80) {
      setTimeout(() => {
        triggerConfetti();
        playBeep(880, 0.3);
      }, 200);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showRestartModal) {
        if (e.key === 'Escape') {
          setShowRestartModal(false);
        } else if (e.key === 'Enter') {
          confirmRestart();
        }
        return;
      }

      if (gameState === 'results') {
        if (e.key.toLowerCase() === 'r' || e.key === 'Enter') {
          handleRestartQuiz(true);
        }
        return;
      }

      if (gameState !== 'playing') return;

      if (['1', '2', '3', '4'].includes(e.key) && !isAnswerLocked) {
        const index = parseInt(e.key, 10) - 1;
        if (currentOptions[index] && !eliminatedIndices.includes(index)) {
          handleSelectAnswer(currentOptions[index], index);
        }
      } else if (e.key === 'Enter' && isAnswerLocked) {
        handleNextQuestion();
      } else if (e.key.toLowerCase() === 'h' && !isAnswerLocked && lifelinesRemaining > 0) {
        handleUseLifeline();
      } else if (e.key.toLowerCase() === 'r') {
        handleRestartQuiz();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isAnswerLocked, currentOptions, eliminatedIndices, lifelinesRemaining, currentIndex, activePool, showRestartModal]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const scrollToArena = () => {
    arenaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartGame = async () => {
    try {
      localStorage.setItem('omniquest_name', playerName);
    } catch {
      // storage disabled
    }

    setIsLoadingDeck(true);

    // Fetch deck from Python backend /api/questions
    try {
      const res = await fetch(`/api/questions?topic=${selectedTopic}&count=${questionCount}`);
      if (res.ok) {
        const data = await res.json();
        if (data.deck && data.deck.length > 0) {
          // Format questions from Python backend
          const formattedDeck = data.deck.map((item) => ({
            id: item.id,
            topic: item.topic,
            c: item.c,
            q: item.q,
            code: item.code,
            o: item.options,
            a: item.options.indexOf(item.correctAnswer),
            e: item.explanation,
          }));
          setIsLoadingDeck(false);
          startGameWithDeck(formattedDeck);
          return;
        }
      }
    } catch {
      // Local fallback
    }

    setIsLoadingDeck(false);
    let filtered = QUESTIONS;
    if (selectedTopic !== 'All') {
      filtered = QUESTIONS.filter((q) => q.topic === selectedTopic);
    }
    const deck = shuffleArray(filtered).slice(0, Math.min(questionCount, filtered.length));
    startGameWithDeck(deck);
  };

  const handleRestartQuiz = (force = false) => {
    // If already in results or forced or hasn't accumulated score, restart immediately
    if (gameState === 'results' || force || (currentIndex === 0 && !isAnswerLocked && score === 0)) {
      setShowRestartModal(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      handleStartGame();
    } else {
      setShowRestartModal(true);
    }
  };

  const confirmRestart = () => {
    setShowRestartModal(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    handleStartGame();
  };

  const restartToSetup = () => {
    setShowRestartModal(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState('setup');
  };

  const handleCopyScore = () => {
    const accuracyVal = Math.round((correctCount / activePool.length) * 100);
    const topicLabel = selectedTopic === 'Marvel' ? 'Marvel Universe' : selectedTopic;
    const text = `🏆 OmniQuest [${topicLabel}]: Scored ${score} pts with ${accuracyVal}% accuracy (${correctCount}/${activePool.length} correct) & streak of ${maxStreak}! 🔥`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2400);
    });
  };

  const currentQ = activePool[currentIndex];
  const progressPercent = activePool.length > 0 ? (currentIndex / activePool.length) * 100 : 0;
  const timerPercent = (timeLeft / 15) * 100;
  const accuracy = activePool.length > 0 ? Math.round((correctCount / activePool.length) * 100) : 0;

  const getTopicIcon = (topic) => {
    switch (topic) {
      case 'Marvel': return '🛡️';
      case 'GK': return '🌍';
      case 'Games': return '🎮';
      case 'Python': return '🐍';
      case 'Science': return '🔬';
      default: return '✨';
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col ${theme === 'light' ? 'theme-light' : ''}`} style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text)' }}>
      {/* Ambient background glow elements */}
      <div className="ambient-glow">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
        <div className="ambient-blob-3" />
      </div>

      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b py-3 px-6 transition-colors duration-200" style={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.88)' : 'rgba(11, 15, 25, 0.82)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-md text-white" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #4f46e5 50%, #38bdf8 100%)' }}>
              ⚡
            </div>
            <span className="font-extrabold text-xl tracking-tight" style={{ color: 'var(--text)' }}>
              OmniQuest
            </span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
            <button onClick={scrollToArena} className="hover:text-indigo-400 transition-colors cursor-pointer">Play Arena</button>
            <button onClick={() => setShowAboutModal(true)} className="hover:text-indigo-400 transition-colors cursor-pointer">Topics Lore</button>
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-full border flex items-center justify-center text-lg transition-transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>

            {gameState === 'playing' ? (
              <button
                onClick={() => handleRestartQuiz()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #e11d48 0%, #6366f1 100%)', boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Quiz</span>
              </button>
            ) : (
              <button
                onClick={scrollToArena}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #e11d48 0%, #6366f1 100%)', boxShadow: '0 4px 16px var(--primary-glow)' }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Playing</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-12 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-7 leading-tight">
              <span className="bg-gradient-to-r from-rose-500 via-indigo-400 to-amber-400 bg-clip-text text-transparent">
                Rapid–Fire Quizzes
              </span>
            </h1>

            {/* Quick Topic Badges in Hero */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-8">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTopic(t.id);
                    scrollToArena();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${selectedTopic === t.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-105' : 'hover:border-indigo-400'}`}
                  style={{
                    backgroundColor: selectedTopic === t.id ? (t.id === 'Marvel' ? '#e11d48' : 'var(--primary)') : 'var(--bg-surface)',
                    borderColor: selectedTopic === t.id ? (t.id === 'Marvel' ? '#e11d48' : 'var(--primary)') : 'var(--border)',
                    color: selectedTopic === t.id ? '#ffffff' : 'var(--text-muted)',
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <button
                onClick={scrollToArena}
                className="px-8 py-3.5 rounded-full text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #e11d48 0%, #6366f1 100%)', boxShadow: '0 4px 20px rgba(225, 29, 72, 0.35)' }}
              >
                <span>Play Live Arena</span>
              </button>

              <button
                onClick={() => setShowAboutModal(true)}
                className="px-6 py-3.5 rounded-full text-base font-semibold border transition-all hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Explore Topics & Lore</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                🛡️ <strong style={{ color: 'var(--text)' }}>Marvel Universe (MCU)</strong>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                🌍 <strong style={{ color: 'var(--text)' }}>World GK & History</strong>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                🎮 <strong style={{ color: 'var(--text)' }}>Video Games & Esports</strong>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                🐍 <strong style={{ color: 'var(--text)' }}>Python Backend Powered</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Live Quiz Arena Section */}
        <section ref={arenaRef} id="play" className="py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div 
              className="rounded-3xl p-6 sm:p-9 border backdrop-blur-2xl shadow-2xl transition-all duration-300 relative overflow-hidden" 
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-lg), var(--glow)'
              }}
            >
              {/* STATE 1: SETUP SCREEN */}
              {gameState === 'setup' && (
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
                        OmniQuest Arena Setup
                      </h2>
                      <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
                        Select your challenge domain: Marvel Universe, GK, Games, or Code.
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'var(--border)', color: 'var(--primary)' }}>
                        Best: <b className="text-indigo-400">{bestScore} pts</b>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                        <Server className="w-3 h-3" />
                        <span>Python API Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Player Handle */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
                      Player Handle
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="e.g. AvengerOne"
                      className="w-full px-4 py-3 rounded-xl border text-sm sm:text-base outline-none transition-all"
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    />
                  </div>

                  {/* Topic Category Selection */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                        Select Quiz Topic
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {TOPICS.map((t) => {
                        const isSelected = selectedTopic === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTopic(t.id)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${isSelected ? 'border-rose-500 shadow-lg' : 'hover:border-indigo-400'}`}
                            style={{
                              backgroundColor: isSelected 
                                ? (t.id === 'Marvel' ? (theme === 'dark' ? 'rgba(225, 29, 72, 0.2)' : '#ffe4e6') : (theme === 'dark' ? 'rgba(99, 102, 241, 0.18)' : '#ede9fe')) 
                                : 'var(--bg-surface)',
                              borderColor: isSelected ? (t.id === 'Marvel' ? '#e11d48' : 'var(--primary)') : 'var(--border)',
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xl">{t.icon}</span>
                              {isSelected && <span className={`w-2 h-2 rounded-full ${t.id === 'Marvel' ? 'bg-rose-500' : 'bg-indigo-500'}`} />}
                            </div>
                            <div className="font-bold text-xs sm:text-sm" style={{ color: isSelected ? (t.id === 'Marvel' ? '#e11d48' : 'var(--primary)') : 'var(--text)' }}>
                              {t.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Round Duration & Sound */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
                      Round Duration & Sound
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setIsTimedMode(true)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border ${isTimedMode ? 'text-white shadow-md' : 'hover:border-indigo-400'}`}
                        style={{
                          backgroundColor: isTimedMode ? 'var(--primary)' : 'var(--bg-surface)',
                          borderColor: isTimedMode ? 'var(--primary)' : 'var(--border)',
                          color: isTimedMode ? '#ffffff' : 'var(--text-muted)',
                        }}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>15s Timed</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsTimedMode(false)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border ${!isTimedMode ? 'text-white shadow-md' : 'hover:border-indigo-400'}`}
                        style={{
                          backgroundColor: !isTimedMode ? 'var(--primary)' : 'var(--bg-surface)',
                          borderColor: !isTimedMode ? 'var(--primary)' : 'var(--border)',
                          color: !isTimedMode ? '#ffffff' : 'var(--text-muted)',
                        }}
                      >
                        <span>☕ Relaxed Mode</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer hover:border-indigo-400"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border)',
                          color: soundEnabled ? 'var(--primary)' : 'var(--text-dim)',
                        }}
                      >
                        {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Pool */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
                      Question Pool Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[5, 10, 15, 20].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setQuestionCount(count)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border ${questionCount === count ? 'text-white shadow-md' : 'hover:border-indigo-400'}`}
                          style={{
                            backgroundColor: questionCount === count ? 'var(--primary)' : 'var(--bg-surface)',
                            borderColor: questionCount === count ? 'var(--primary)' : 'var(--border)',
                            color: questionCount === count ? '#ffffff' : 'var(--text-muted)',
                          }}
                        >
                          {count} Questions
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Local High Scores Accordion */}
                  {leaderboard.length > 0 && (
                    <div className="mb-6 border rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                      <button
                        type="button"
                        onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
                        className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold cursor-pointer"
                        style={{ color: 'var(--text)' }}
                      >
                        <span className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span>Leaderboard (Python Backend Synced)</span>
                        </span>
                        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
                          <span>{leaderboard.length} entries</span>
                          {isLeaderboardOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isLeaderboardOpen && (
                        <div className="px-4 pb-3 border-t divide-y" style={{ borderColor: 'var(--border)' }}>
                          {leaderboard.map((item, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between text-sm" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                              <div className="flex items-center gap-3">
                                <span className="font-extrabold w-5 text-indigo-400">#{idx + 1}</span>
                                <div>
                                  <span className="font-semibold block" style={{ color: 'var(--text)' }}>{item.name}</span>
                                  <span className="text-[11px] text-slate-400">{item.topic}</span>
                                </div>
                              </div>
                              <div className="text-xs text-right" style={{ color: 'var(--text-muted)' }}>
                                <b className="text-indigo-400 text-sm block">{item.score} pts</b>
                                <span>{item.correct}/{item.total} correct</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer & Start Game */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                      <Keyboard className="w-4 h-4 text-indigo-400" />
                      <span>Shortcuts: <b>1–4</b> answer, <b>Enter</b> next, <b>H</b> 50/50, <b>R</b> restart</span>
                    </div>

                    <button
                      disabled={isLoadingDeck}
                      onClick={handleStartGame}
                      className="w-full sm:w-auto px-8 py-3 rounded-full text-base font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #e11d48 0%, #6366f1 100%)', boxShadow: '0 4px 18px var(--primary-glow)' }}
                    >
                      <span>{isLoadingDeck ? 'Loading Deck...' : 'Start Game →'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 2: ACTIVE PLAYING SCREEN */}
              {gameState === 'playing' && currentQ && (
                <div>
                  {/* Question Header Bar */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5" style={{ 
                        backgroundColor: currentQ.topic === 'Marvel' ? 'rgba(225, 29, 72, 0.18)' : 'rgba(99, 102, 241, 0.16)', 
                        color: currentQ.topic === 'Marvel' ? '#fb7185' : '#a5b4fc' 
                      }}>
                        <span>{getTopicIcon(currentQ.topic)}</span>
                        <span>{currentQ.topic === 'Marvel' ? 'Marvel Universe' : currentQ.topic}</span>
                        <span className="opacity-60">·</span>
                        <span>{currentQ.c}</span>
                      </span>
                      <span className="text-xs sm:text-sm font-semibold hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
                        Q <b>{currentIndex + 1}</b> / {activePool.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleRestartQuiz()}
                        title="Restart quiz game (or press R)"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all hover:border-rose-400 hover:text-rose-400 cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                      >
                        <RotateCcw className="w-3 h-3 text-rose-400" />
                        <span>Restart</span>
                      </button>

                      <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold ${streak >= 2 ? 'streak-pulsing text-amber-400' : ''}`} style={{ color: streak >= 2 ? '#fbbf24' : 'var(--text-muted)' }}>
                        <Flame className="w-4 h-4 fill-current" />
                        <span>{streak} streak</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-indigo-400">
                        {score} pts
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progressPercent}%`,
                        background: 'linear-gradient(90deg, #e11d48, #38bdf8, #6366f1)'
                      }}
                    />
                  </div>

                  {/* Timer Bar (if timed mode) */}
                  {isTimedMode ? (
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${isTimedOut ? 'text-rose-400' : 'text-amber-400'}`} />
                          <span>{isTimedOut ? "Time Expired" : `Time Remaining: ${Math.ceil(timeLeft)}s`}</span>
                        </span>
                        {isTimedOut ? (
                          <span className="text-rose-400 font-extrabold uppercase tracking-wider text-[11px] animate-pulse">⏰ 0.0s — Time's Up!</span>
                        ) : (
                          <span className={`font-mono text-xs font-bold ${timeLeft <= 4 ? 'text-rose-400 font-extrabold' : 'text-slate-400'}`}>
                            {timeLeft.toFixed(1)}s
                          </span>
                        )}
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                        <div
                          className="h-full transition-all duration-100 rounded-full"
                          style={{
                            width: isTimedOut ? '100%' : `${timerPercent}%`,
                            backgroundColor: isTimedOut ? '#ef4444' : timeLeft > 7 ? '#10b981' : timeLeft > 3 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-3" />
                  )}

                  {/* TIME'S UP ALERT BANNER */}
                  {isTimedOut && (
                    <div className="mb-4 p-3.5 rounded-2xl border border-rose-500/50 bg-rose-500/15 flex items-center justify-between gap-3 animate-fadeIn shadow-lg shadow-rose-950/30">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl animate-bounce">⏰</span>
                        <div>
                          <div className="text-rose-400 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                            <span>Time's Up!</span>
                            <span className="text-slate-300 font-medium normal-case">The correct answer is:</span>
                          </div>
                          <span className="text-emerald-400 text-sm sm:text-base font-extrabold block mt-0.5">
                            {lastVerification?.correctAnswer || currentQ.o[currentQ.a]}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-500 text-white shrink-0 shadow-md flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Correct Answer</span>
                      </span>
                    </div>
                  )}

                  {/* Question Text */}
                  <h3 className="text-lg sm:text-xl font-bold leading-snug mb-4" style={{ color: 'var(--text)' }}>
                    {currentQ.q}
                  </h3>

                  {/* Code snippet if present */}
                  {currentQ.code && (
                    <div className="mb-4 rounded-xl p-3.5 border font-mono text-xs sm:text-sm overflow-x-auto" style={{ backgroundColor: '#0d1117', borderColor: 'var(--border)', color: '#e6edf3' }}>
                      <pre><code>{currentQ.code}</code></pre>
                    </div>
                  )}

                  {/* Options List */}
                  <div className="grid gap-2.5 mb-5">
                    {currentOptions.map((opt, idx) => {
                      const correctOpt = lastVerification ? lastVerification.correctAnswer : currentQ.o[currentQ.a];
                      const isCorrect = opt === correctOpt;
                      const isSelected = selectedAnswerIndex === idx;
                      const isEliminated = eliminatedIndices.includes(idx);

                      let btnStyle = {
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                      };

                      let extraClass = '';

                      if (isAnswerLocked) {
                        if (isCorrect) {
                          // Correct answer is always prominently highlighted in emerald green
                          btnStyle = {
                            backgroundColor: isTimedOut ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.18)',
                            borderColor: '#10b981',
                            color: '#34d399',
                          };
                          extraClass = isTimedOut 
                            ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/30 font-bold scale-[1.01]' 
                            : 'ring-2 ring-emerald-500/40 font-bold';
                        } else if (isSelected && !isCorrect) {
                          // Wrongly chosen option highlighted in red with shake
                          btnStyle = {
                            backgroundColor: 'rgba(239, 68, 68, 0.18)',
                            borderColor: '#ef4444',
                            color: '#f87171',
                          };
                          extraClass = 'animate-shake';
                        } else {
                          // Dim non-selected, non-correct options
                          extraClass = 'opacity-40';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswerLocked || isEliminated}
                          onClick={() => handleSelectAnswer(opt, idx)}
                          className={`w-full flex items-center justify-between gap-3.5 px-4 py-3 rounded-xl border text-left text-sm sm:text-base font-medium transition-all ${isEliminated ? 'opacity-25 line-through pointer-events-none' : !isAnswerLocked ? 'hover:border-indigo-500 hover:translate-x-1 cursor-pointer' : ''} ${extraClass}`}
                          style={btnStyle}
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <span
                              className="w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold border shrink-0"
                              style={{
                                backgroundColor: isAnswerLocked && isCorrect 
                                  ? '#10b981' 
                                  : isAnswerLocked && isSelected && !isCorrect 
                                  ? '#ef4444' 
                                  : 'rgba(255, 255, 255, 0.06)',
                                borderColor: isAnswerLocked && (isCorrect || isSelected) ? 'transparent' : 'var(--border)',
                                color: isAnswerLocked && (isCorrect || isSelected) ? '#fff' : 'var(--text-muted)'
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span className="truncate">{opt}</span>
                          </div>

                          {/* Explicit visual badges when answer is locked */}
                          {isAnswerLocked && isCorrect && (
                            <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500 text-white flex items-center gap-1.5 shrink-0 shadow-md">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isTimedOut ? 'Correct Answer' : 'Correct'}</span>
                            </span>
                          )}

                          {isAnswerLocked && isSelected && !isCorrect && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-500 text-white flex items-center gap-1 shrink-0">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Your Choice</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Card */}
                  {isAnswerLocked && (
                    <div
                      className="rounded-2xl p-4 sm:p-5 mb-5 border animate-fadeIn flex items-start gap-3.5 shadow-lg"
                      style={{
                        backgroundColor: lastVerification?.isCorrect 
                          ? 'var(--success-bg)' 
                          : isTimedOut 
                          ? 'rgba(239, 68, 68, 0.16)' 
                          : 'var(--error-bg)',
                        borderColor: lastVerification?.isCorrect 
                          ? 'rgba(16, 185, 129, 0.4)' 
                          : isTimedOut 
                          ? 'rgba(239, 68, 68, 0.5)' 
                          : 'rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      {lastVerification?.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                      ) : isTimedOut ? (
                        <Clock className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1 text-sm">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          {isTimedOut && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm">
                              ⏰ Time's Up!
                            </span>
                          )}
                          <h4 className="font-extrabold text-sm sm:text-base" style={{ 
                            color: lastVerification?.isCorrect 
                              ? 'var(--success)' 
                              : isTimedOut 
                              ? '#f87171' 
                              : 'var(--error)' 
                          }}>
                            {lastVerification?.isCorrect ? (
                              <>
                                ✓ Correct! +{lastVerification.pointsGain} pts
                                {lastVerification && ((lastVerification.speedBonus ?? 0) > 0 || (lastVerification.streakBonus ?? 0) > 0) && (
                                  <span className="ml-2 text-xs opacity-85 font-normal">
                                    ({[
                                      (lastVerification.speedBonus ?? 0) > 0 ? `Speed +${lastVerification.speedBonus}` : null,
                                      (lastVerification.streakBonus ?? 0) > 0 ? `Streak +${lastVerification.streakBonus}` : null
                                    ].filter(Boolean).join(', ')})
                                  </span>
                                )}
                              </>
                            ) : isTimedOut ? (
                              <>
                                The correct answer is:{' '}
                                <span className="text-emerald-400 font-black underline decoration-emerald-500/80 ml-1 text-base">
                                  {lastVerification?.correctAnswer || currentQ.o[currentQ.a]}
                                </span>
                              </>
                            ) : (
                              <>
                                ✗ Incorrect (Correct Answer:{' '}
                                <span className="text-emerald-400 font-extrabold ml-1">
                                  {lastVerification?.correctAnswer || currentQ.o[currentQ.a]}
                                </span>)
                              </>
                            )}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                          {lastVerification?.explanation || currentQ.e}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bottom Bar: Lifeline + Restart + Next Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isAnswerLocked || lifelinesRemaining === 0}
                        onClick={handleUseLifeline}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-400 hover:text-amber-400 cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>50/50 Lifeline ({lifelinesRemaining})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRestartQuiz()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition-all hover:border-rose-400 hover:text-rose-400 cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                        <span>Restart Quiz</span>
                      </button>
                    </div>

                    {isAnswerLocked && (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-md transition-all hover:brightness-110 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <span>{currentIndex + 1 === activePool.length ? 'Finish & See Results 🏆' : 'Next Question →'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STATE 3: RESULTS SCREEN */}
              {gameState === 'results' && (
                <div className="text-center py-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'var(--border)', color: '#818cf8' }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Topic: {selectedTopic === 'Marvel' ? 'Marvel Universe' : selectedTopic} · Completed</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>
                    {accuracy === 100 ? 'Avengers-Level Mastery! 🏆' : accuracy >= 80 ? 'Outstanding Performance! 🚀' : accuracy >= 50 ? 'Solid Run! 👍' : 'Keep Practicing! 💪'}
                  </h2>

                  <div className="text-5xl sm:text-6xl font-extrabold my-3 bg-gradient-to-r from-rose-500 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                    {score} <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>pts</span>
                  </div>

                  {score >= bestScore && score > 0 && (
                    <p className="text-xs font-bold text-emerald-400 mb-4">
                      🎉 New All-Time High Score!
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 my-6">
                    <div className="p-3 sm:p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                      <div className="text-lg sm:text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
                        {correctCount} / {activePool.length}
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                        Questions Correct
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                      <div className="text-lg sm:text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
                        {accuracy}%
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                        Accuracy Rate
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                      <div className="text-lg sm:text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
                        {maxStreak}
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                        Longest Streak
                      </div>
                    </div>
                  </div>

                  {/* Missed Questions Review Accordion */}
                  {wrongQuestions.length > 0 && (
                    <div className="mb-6 text-left border rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                      <button
                        type="button"
                        onClick={() => setIsMissedOpen(!isMissedOpen)}
                        className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold cursor-pointer"
                        style={{ color: 'var(--text)' }}
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-rose-400" />
                          <span>Review Missed Questions ({wrongQuestions.length})</span>
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-rose-400">
                          <span>{isMissedOpen ? 'Hide' : 'Expand'}</span>
                          {isMissedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isMissedOpen && (
                        <div className="px-4 pb-3 border-t divide-y" style={{ borderColor: 'var(--border)' }}>
                          {wrongQuestions.map((q, idx) => (
                            <div key={idx} className="py-3 text-xs sm:text-sm" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                  {getTopicIcon(q.topic)} {q.topic === 'Marvel' ? 'Marvel Universe' : q.topic}
                                </span>
                              </div>
                              <p className="font-bold mb-1" style={{ color: 'var(--text)' }}>
                                {idx + 1}. {q.q}
                              </p>
                              <p className="text-emerald-400 font-semibold mb-1">
                                Correct Answer: {q.o[q.a]}
                              </p>
                              <p style={{ color: 'var(--text-muted)' }} className="text-xs">
                                {q.e}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      onClick={() => handleRestartQuiz(true)}
                      className="px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-md transition-all hover:brightness-110 cursor-pointer flex items-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #e11d48 0%, #6366f1 100%)' }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restart Quiz (R)</span>
                    </button>

                    {wrongQuestions.length > 0 && (
                      <button
                        onClick={() => startGameWithDeck(shuffleArray(wrongQuestions))}
                        className="px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all hover:border-amber-400 cursor-pointer flex items-center gap-2"
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                      >
                        <span>⚡ Retry Mistakes ({wrongQuestions.length})</span>
                      </button>
                    )}

                    <button
                      onClick={handleCopyScore}
                      className="px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all hover:border-indigo-400 cursor-pointer flex items-center gap-2"
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{copiedAlert ? 'Copied! ✓' : 'Copy Score'}</span>
                    </button>

                    <button
                      onClick={() => setGameState('setup')}
                      className="px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all hover:border-indigo-400 cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                      🏠 Arena Menu
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Topic Highlights Showcase */}
        <section className="py-12 px-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
                Available Subjects
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
                Multi-Domain Knowledge Arenas
              </h2>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
                Explore specialized question banks curated with verified MCU canon, world facts, and tech benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div 
                onClick={() => { setSelectedTopic('Marvel'); scrollToArena(); }}
                className="p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer group"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(225, 29, 72, 0.3)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(225, 29, 72, 0.12)', borderColor: 'rgba(225, 29, 72, 0.3)' }}>
                  🛡️
                </div>
                <h3 className="text-lg font-bold mb-1.5 flex items-center justify-between" style={{ color: 'var(--text)' }}>
                  <span>Marvel Universe</span>
                  <span className="text-xs text-rose-400 font-mono">Play →</span>
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Infinity Stones, Avengers lore, Thanos on Vormir, Wakandan Vibranium, Thor's Stormbreaker, and MCU Phase 1–4.
                </p>
              </div>

              <div 
                onClick={() => { setSelectedTopic('GK'); scrollToArena(); }}
                className="p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer group"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                  🌍
                </div>
                <h3 className="text-lg font-bold mb-1.5 flex items-center justify-between" style={{ color: 'var(--text)' }}>
                  <span>General Knowledge</span>
                  <span className="text-xs text-sky-400 font-mono">Play →</span>
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  World geography, ancient & modern history, Apollo 11, world wonders, national flags, and world records.
                </p>
              </div>

              <div 
                onClick={() => { setSelectedTopic('Games'); scrollToArena(); }}
                className="p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer group"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  🎮
                </div>
                <h3 className="text-lg font-bold mb-1.5 flex items-center justify-between" style={{ color: 'var(--text)' }}>
                  <span>Video Games</span>
                  <span className="text-xs text-emerald-400 font-mono">Play →</span>
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Nintendo 1889 heritage, Minecraft records, FromSoftware soulslikes, Zelda lore, arcade origins, and console milestones.
                </p>
              </div>

              <div 
                onClick={() => { setSelectedTopic('Python'); scrollToArena(); }}
                className="p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer group"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                  🐍
                </div>
                <h3 className="text-lg font-bold mb-1.5 flex items-center justify-between" style={{ color: 'var(--text)' }}>
                  <span>Python & Code</span>
                  <span className="text-xs text-indigo-400 font-mono">Play →</span>
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Python 3.12 grammar, sequences, mutability rules, floating-point gotchas, floor division, and slicing internals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-16 px-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
                Key Features
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
                Engineered for Effective Recall
              </h2>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
                Every mechanic is crafted to help players build intuition through immediate feedback loops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl border transition-all hover:-translate-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border" style={{ backgroundColor: 'rgba(225, 29, 72, 0.12)', borderColor: 'rgba(225, 29, 72, 0.25)' }}>
                  🛡️
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Marvel Universe Exclusives</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Deep-dive canon questions dedicated exclusively to the Marvel Cinematic Universe and superhero lore.
                </p>
              </div>

              <div className="p-6 rounded-2xl border transition-all hover:-translate-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
                  ⏱️
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Adaptive Timed Mode</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  15 seconds per question with dynamic speed multipliers rewarding split-second precision.
                </p>
              </div>

              <div className="p-6 rounded-2xl border transition-all hover:-translate-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
                  🔥
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Streak Multipliers</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Maintain consecutive correct answers to multiply points and surge up the leaderboard.
                </p>
              </div>

              <div className="p-6 rounded-2xl border transition-all hover:-translate-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
                  ✂️
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>50/50 Lifelines</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Remove two distracting incorrect answers when faced with tricky questions.
                </p>
              </div>

              <div className="p-6 rounded-2xl border transition-all hover:-translate-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
                  💡
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Instant Contextual Explanations</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Detailed background context accompanies every answer to turn missed questions into learning moments.
                </p>
              </div>

              <div className="p-6 rounded-2xl border transition-all hover:-translate-y-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
                  ⌨️
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Full Keyboard Support</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Press keys 1–4 to lock options, H for lifeline, and Enter to advance with lightning speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="how" className="py-16 px-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
                Workflow
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
                How OmniQuest Operates
              </h2>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
                Full-stack architecture running Python backend logic and real-time JavaScript browser scoring.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="text-3xl font-extrabold text-indigo-400 mb-2">01</div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text)' }}>Select Domain</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Choose Marvel Universe, GK, Games, Python, or tournament mix.
                </p>
              </div>

              <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="text-3xl font-extrabold text-indigo-400 mb-2">02</div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text)' }}>Python Shuffled Deck</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The Python API generates Fisher-Yates randomized decks so no run feels repetitive.
                </p>
              </div>

              <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="text-3xl font-extrabold text-indigo-400 mb-2">03</div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text)' }}>Backend Verification</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Answers are evaluated on the backend to compute speed and streak multipliers.
                </p>
              </div>

              <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="text-3xl font-extrabold text-indigo-400 mb-2">04</div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text)' }}>Analytics & Review</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Inspect missed questions in review mode or instantly replay only your incorrect answers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-6 mt-auto" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg text-white" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #4f46e5 50%, #38bdf8 100%)' }}>
              ⚡
            </div>
            <span className="font-extrabold text-lg" style={{ color: 'var(--text)' }}>OmniQuest</span>
          </div>

          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            Interactive Multi-Topic Quiz Game in JavaScript · Powered by Python Backend
          </p>

          <p className="text-xs flex items-center justify-center sm:justify-start gap-1.5" style={{ color: 'var(--text-dim)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Python 3.10 Engine</span>
          </p>
        </div>
      </footer>

      {/* About Topics Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full rounded-2xl p-6 border shadow-2xl relative" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border text-slate-400 hover:text-white cursor-pointer"
              style={{ borderColor: 'var(--border)' }}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚡</span>
              <h3 className="text-xl font-bold">About OmniQuest Topics & Engine</h3>
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              OmniQuest runs on a full-stack architecture with a dedicated Python REST engine serving randomized questions, answer verification, and leaderboard persistence.
            </p>

            <div className="space-y-2.5 text-xs mb-6 max-h-60 overflow-y-auto pr-1">
              {TOPICS.filter(t => t.id !== 'All').map(t => (
                <div key={t.id} className="p-3 rounded-xl border flex items-start gap-2.5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
                  <span className="text-xl mt-0.5">{t.icon}</span>
                  <div>
                    <b className={`${t.id === 'Marvel' ? 'text-rose-400' : 'text-indigo-400'} block mb-0.5`}>{t.label}</b>
                    <p style={{ color: 'var(--text-muted)' }}>{t.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-lg font-bold text-white text-sm cursor-pointer shadow-md"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Back to Arena
            </button>
          </div>
        </div>
      )}

      {/* Restart Quiz Confirmation Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl p-6 border shadow-2xl relative text-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 border text-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold mb-2">Restart Quiz Game?</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              Are you sure you want to restart? Your current question progress (<b>Q {currentIndex + 1} of {activePool.length}</b>) and current score of <b>{score} pts</b> will be reset.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={confirmRestart}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-white text-sm cursor-pointer shadow-md flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #e11d48 0%, #6366f1 100%)' }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yes, Restart Quiz</span>
              </button>

              <button
                type="button"
                onClick={restartToSetup}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold border text-xs sm:text-sm cursor-pointer hover:border-slate-400"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                Back to Setup
              </button>

              <button
                type="button"
                onClick={() => setShowRestartModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold border text-xs sm:text-sm cursor-pointer hover:border-indigo-400"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
