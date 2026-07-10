const settingsState = {
  mode: 'time',
  timeLimit: 30,
  wordsTarget: 25,
  quoteLength: 'medium',
  difficulty: 'normal',
  punctuation: false,
  numbers: false,
  stopOnError: false,
  blindMode: false,
  caretStyle: 'smooth',
  showLiveStats: true,
  theme: 'dusk',
};

const testState = {
  promptWords: [],
  typedWords: [],
  currentWordIndex: 0,
  currentCharIndex: 0,
  started: false,
  finished: false,
  startedAt: null,
  finishedAt: null,
  timeRemaining: settingsState.timeLimit,
  timerInterval: null,
  correctChars: 0,
  incorrectChars: 0,
  extraChars: 0,
  missedChars: 0,
  chart: null,
  chartPoints: [],
};

const baseWords = [
  'bridge', 'shadow', 'river', 'grace', 'thunder', 'cobalt', 'velvet', 'lantern', 'ripple', 'silver',
  'ocean', 'forest', 'spark', 'mosaic', 'autumn', 'whisper', 'ember', 'echo', 'breeze', 'prism',
  'logic', 'garden', 'signal', 'motion', 'horizon', 'falcon', 'meadow', 'pioneer', 'voltage', 'circuit',
  'stellar', 'nebula', 'crystal', 'moment', 'sunrise', 'sunset', 'lattice', 'galaxy', 'orbit', 'quartz',
  'tempo', 'rhythm', 'canvas', 'archer', 'comet', 'voyage', 'wizard', 'voyager', 'murmur', 'puzzle',
  'monkey', 'type', 'focus', 'intent', 'clarity', 'breathe', 'serene', 'jungle', 'vector', 'button',
  'router', 'server', 'desktop', 'window', 'keyboard', 'monitor', 'design', 'interface', 'motion', 'pattern'
];

const quotes = {
  short: [
    'Stay curious and keep moving.',
    'Small steps create great results.',
    'Make the ordinary feel magical.'
  ],
  medium: [
    'The best way to improve is to practice regularly and focus on steady progress over time.',
    'A calm mind sorts complexity into simple, useful ideas that are easy to understand.',
    'Typing with intention builds both rhythm and confidence in every sentence you craft.'
  ],
  long: [
    'The quiet discipline of practice transforms raw effort into smooth, dependable skill, and that steady improvement becomes visible in every careful keystroke you make.',
    'When the mind stays present and the hands remain relaxed, concentration deepens, errors shrink, and the flow of words feels almost effortless and natural.'
  ]
};

const themes = {
  dusk: { background: '#111827', text: '#f9fafb', secondary: '#6b7280', error: '#f87171' },
  midnight: { background: '#050816', text: '#e2e8f0', secondary: '#64748b', error: '#fb7185' },
  sunset: { background: '#2b1616', text: '#fef2f2', secondary: '#f59e0b', error: '#fb7185' }
};

const elements = {
  settingsToggle: document.getElementById('settingsToggle'),
  settingsToggleToolbar: document.getElementById('settingsToggleToolbar'),
  settingsPanel: document.getElementById('settingsPanel'),
  modeSelect: document.getElementById('modeSelect'),
  timeSelect: document.getElementById('timeSelect'),
  wordsSelect: document.getElementById('wordsSelect'),
  quoteSelect: document.getElementById('quoteSelect'),
  punctuationToggle: document.getElementById('punctuationToggle'),
  punctuationButton: document.getElementById('punctuationButton'),
  numbersToggle: document.getElementById('numbersToggle'),
  numbersButton: document.getElementById('numbersButton'),
  stopOnErrorToggle: document.getElementById('stopOnErrorToggle'),
  blindModeToggle: document.getElementById('blindModeToggle'),
  liveStatsToggle: document.getElementById('liveStatsToggle'),
  difficultySelect: document.getElementById('difficultySelect'),
  caretSelect: document.getElementById('caretSelect'),
  themeSelect: document.getElementById('themeSelect'),
  typingPrompt: document.getElementById('typingPrompt'),
  restartBtn: document.getElementById('restartBtn'),
  newQuoteBtn: document.getElementById('newQuoteButton'),
  statusMessage: document.getElementById('statusMessage'),
  wpm: document.getElementById('wpm'),
  rawWpm: document.getElementById('rawWpm'),
  accuracy: document.getElementById('accuracy'),
  timeDisplay: document.getElementById('timeDisplay'),
  statsBar: document.getElementById('statsBar'),
  resultsCard: document.getElementById('resultsCard'),
  resultWpm: document.getElementById('resultWpm'),
  resultRawWpm: document.getElementById('resultRawWpm'),
  resultAccuracy: document.getElementById('resultAccuracy'),
  resultChars: document.getElementById('resultChars'),
  correctCount: document.getElementById('correctCount'),
  incorrectCount: document.getElementById('incorrectCount'),
  extraCount: document.getElementById('extraCount'),
  missedCount: document.getElementById('missedCount'),
  resultsChart: document.getElementById('resultsChart'),
  modeTimeButton: document.getElementById('modeTimeButton'),
  modeWordsButton: document.getElementById('modeWordsButton'),
  modeQuoteButton: document.getElementById('modeQuoteButton'),
  modeZenButton: document.getElementById('modeZenButton'),
  time15Button: document.getElementById('time15Button'),
  time30Button: document.getElementById('time30Button'),
  time60Button: document.getElementById('time60Button'),
  time120Button: document.getElementById('time120Button')
};

function init() {
  bindEvents();
  syncControls();
  updateModeVisibility();
  applyTheme();
  resetTest();
}

function bindEvents() {
  const togglePanel = () => {
    elements.settingsPanel.classList.toggle('hidden');
  };

  elements.settingsToggle.addEventListener('click', togglePanel);
  elements.settingsToggleToolbar.addEventListener('click', togglePanel);

  elements.modeSelect.addEventListener('change', (event) => {
    settingsState.mode = event.target.value;
    syncChipStates();
    updateModeVisibility();
    resetTest();
  });

  elements.timeSelect.addEventListener('change', (event) => {
    settingsState.timeLimit = Number(event.target.value);
    syncChipStates();
    resetTest();
  });

  elements.wordsSelect.addEventListener('change', (event) => {
    settingsState.wordsTarget = Number(event.target.value);
    resetTest();
  });

  elements.quoteSelect.addEventListener('change', (event) => {
    settingsState.quoteLength = event.target.value;
    resetTest();
  });

  elements.punctuationButton.addEventListener('click', () => {
    settingsState.punctuation = !settingsState.punctuation;
    elements.punctuationToggle.checked = settingsState.punctuation;
    syncChipStates();
    resetTest();
  });

  elements.numbersButton.addEventListener('click', () => {
    settingsState.numbers = !settingsState.numbers;
    elements.numbersToggle.checked = settingsState.numbers;
    syncChipStates();
    resetTest();
  });

  elements.stopOnErrorToggle.addEventListener('change', (event) => {
    settingsState.stopOnError = event.target.checked;
  });

  elements.blindModeToggle.addEventListener('change', (event) => {
    settingsState.blindMode = event.target.checked;
    renderPrompt();
  });

  elements.liveStatsToggle.addEventListener('change', (event) => {
    settingsState.showLiveStats = event.target.checked;
    elements.statsBar.classList.toggle('hidden', !settingsState.showLiveStats);
  });

  elements.difficultySelect.addEventListener('change', (event) => {
    settingsState.difficulty = event.target.value;
  });

  elements.caretSelect.addEventListener('change', (event) => {
    settingsState.caretStyle = event.target.value;
    updateCaretStyle();
  });

  elements.themeSelect.addEventListener('change', (event) => {
    settingsState.theme = event.target.value;
    applyTheme();
  });

  [elements.modeTimeButton, elements.modeWordsButton, elements.modeQuoteButton, elements.modeZenButton].forEach((button) => {
    button.addEventListener('click', () => {
      settingsState.mode = button.dataset.mode;
      elements.modeSelect.value = settingsState.mode;
      syncChipStates();
      updateModeVisibility();
      resetTest();
    });
  });

  [elements.time15Button, elements.time30Button, elements.time60Button, elements.time120Button].forEach((button) => {
    button.addEventListener('click', () => {
      settingsState.timeLimit = Number(button.dataset.time);
      elements.timeSelect.value = String(settingsState.timeLimit);
      syncChipStates();
      resetTest();
    });
  });

  elements.restartBtn.addEventListener('click', resetTest);
  elements.newQuoteBtn.addEventListener('click', () => {
    if (settingsState.mode === 'quote') {
      resetTest();
    } else {
      buildPrompt();
      renderPrompt();
    }
  });

  elements.typingPrompt.addEventListener('click', () => {
    elements.typingPrompt.focus();
  });

  document.addEventListener('keydown', handleKeyDown);
}

function syncControls() {
  elements.modeSelect.value = settingsState.mode;
  elements.timeSelect.value = String(settingsState.timeLimit);
  elements.wordsSelect.value = String(settingsState.wordsTarget);
  elements.quoteSelect.value = settingsState.quoteLength;
  elements.punctuationToggle.checked = settingsState.punctuation;
  elements.numbersToggle.checked = settingsState.numbers;
  elements.stopOnErrorToggle.checked = settingsState.stopOnError;
  elements.blindModeToggle.checked = settingsState.blindMode;
  elements.liveStatsToggle.checked = settingsState.showLiveStats;
  elements.difficultySelect.value = settingsState.difficulty;
  elements.caretSelect.value = settingsState.caretStyle;
  elements.themeSelect.value = settingsState.theme;
  syncChipStates();
  updateCaretStyle();
  elements.statsBar.classList.toggle('hidden', !settingsState.showLiveStats);
}

function syncChipStates() {
  const setActive = (button, isActive) => {
    button.classList.toggle('active', isActive);
    button.classList.toggle('muted', !isActive);
  };

  setActive(elements.modeTimeButton, settingsState.mode === 'time');
  setActive(elements.modeWordsButton, settingsState.mode === 'words');
  setActive(elements.modeQuoteButton, settingsState.mode === 'quote');
  setActive(elements.modeZenButton, settingsState.mode === 'zen');

  setActive(elements.time15Button, settingsState.timeLimit === 15);
  setActive(elements.time30Button, settingsState.timeLimit === 30);
  setActive(elements.time60Button, settingsState.timeLimit === 60);
  setActive(elements.time120Button, settingsState.timeLimit === 120);

  setActive(elements.punctuationButton, settingsState.punctuation);
  setActive(elements.numbersButton, settingsState.numbers);
}

function updateModeVisibility() {
  elements.timeSelect.closest('label').classList.toggle('hidden', settingsState.mode !== 'time');
  elements.wordsSelect.closest('label').classList.toggle('hidden', settingsState.mode !== 'words');
  elements.quoteSelect.closest('label').classList.toggle('hidden', settingsState.mode !== 'quote');
}

function updateCaretStyle() {
  elements.typingPrompt.classList.remove('caret-smooth', 'caret-block', 'caret-underline', 'caret-off');
  elements.typingPrompt.classList.add(`caret-${settingsState.caretStyle === 'smooth' ? 'smooth' : settingsState.caretStyle}`);
}

function applyTheme() {
  const theme = themes[settingsState.theme] || themes.dusk;
  document.documentElement.style.setProperty('--bg', theme.background);
  document.documentElement.style.setProperty('--panel', theme.background === '#111827' ? '#1f2937' : '#2f2438');
  document.documentElement.style.setProperty('--text', theme.text);
  document.documentElement.style.setProperty('--secondary', theme.secondary);
  document.documentElement.style.setProperty('--incorrect', theme.error);
  document.documentElement.style.setProperty('--caret', theme.text);
}

function resetTest() {
  clearInterval(testState.timerInterval);
  testState.promptWords = [];
  testState.typedWords = [];
  testState.currentWordIndex = 0;
  testState.currentCharIndex = 0;
  testState.started = false;
  testState.finished = false;
  testState.startedAt = null;
  testState.finishedAt = null;
  testState.timeRemaining = settingsState.timeLimit;
  testState.correctChars = 0;
  testState.incorrectChars = 0;
  testState.extraChars = 0;
  testState.missedChars = 0;
  testState.chartPoints = [];
  elements.resultsCard.classList.add('hidden');
  elements.statusMessage.textContent = 'Start typing to begin the test.';
  elements.timeDisplay.textContent = `${settingsState.timeLimit}s`;
  updateStats();
  buildPrompt();
  renderPrompt();
}

function buildPrompt() {
  if (settingsState.mode === 'quote') {
    const quotePool = quotes[settingsState.quoteLength] || quotes.medium;
    const chosenQuote = quotePool[Math.floor(Math.random() * quotePool.length)];
    testState.promptWords = chosenQuote.split(/(\s+)/).filter(Boolean).filter((part) => part.trim() !== '');
  } else if (settingsState.mode === 'zen') {
    testState.promptWords = buildWordList(80);
  } else if (settingsState.mode === 'words') {
    testState.promptWords = buildWordList(settingsState.wordsTarget);
  } else {
    testState.promptWords = buildWordList(Math.max(40, settingsState.timeLimit * 2));
  }

  testState.typedWords = Array.from({ length: testState.promptWords.length }, () => '');
  testState.currentWordIndex = 0;
  testState.currentCharIndex = 0;
}

function buildWordList(count) {
  const words = [];
  for (let i = 0; i < count; i += 1) {
    const base = baseWords[Math.floor(Math.random() * baseWords.length)];
    words.push(customizeWord(base));
  }
  return words;
}

function customizeWord(word) {
  let nextWord = word;
  if (settingsState.punctuation && Math.random() > 0.5) {
    const punctuation = ['.', ',', '!', '?', ';'];
    nextWord += punctuation[Math.floor(Math.random() * punctuation.length)];
  }
  if (settingsState.numbers && Math.random() > 0.6) {
    const number = String(Math.floor(Math.random() * 99));
    nextWord = `${number}${nextWord}`;
  }
  return nextWord;
}

function renderPrompt() {
  const prompt = elements.typingPrompt;
  prompt.innerHTML = '';
  const fragment = document.createDocumentFragment();

  const currentWord = testState.promptWords[testState.currentWordIndex] || '';
  testState.promptWords.forEach((word, wordIndex) => {
    const wordNode = document.createElement('span');
    wordNode.className = 'word';
    if (wordIndex === testState.currentWordIndex) {
      wordNode.classList.add('word-current');
    }

    const hasError = getWordError(wordIndex);
    if (hasError && wordIndex < testState.currentWordIndex) {
      wordNode.classList.add('word-error');
    }

    Array.from(word).forEach((char, charIndex) => {
      const charNode = document.createElement('span');
      charNode.className = 'char';
      const typedWord = testState.typedWords[wordIndex] || '';
      const typedChar = typedWord[charIndex];

      if (wordIndex < testState.currentWordIndex) {
        if (typedChar === char) {
          charNode.classList.add('correct');
        } else {
          charNode.classList.add(settingsState.blindMode ? 'pending' : 'incorrect');
        }
      } else if (wordIndex === testState.currentWordIndex) {
        if (charIndex < typedWord.length) {
          if (typedChar === char) {
            charNode.classList.add('correct');
          } else {
            charNode.classList.add(settingsState.blindMode ? 'pending' : 'incorrect');
          }
        } else if (charIndex === testState.currentCharIndex) {
          charNode.classList.add('current');
        }
      }

      charNode.textContent = char;
      wordNode.appendChild(charNode);
    });

    if (wordIndex === testState.currentWordIndex && currentWord) {
      const extraCount = Math.max(0, (testState.typedWords[wordIndex] || '').length - currentWord.length);
      for (let index = 0; index < extraCount; index += 1) {
        const extraNode = document.createElement('span');
        extraNode.className = 'char extra';
        extraNode.textContent = (testState.typedWords[wordIndex] || '')[currentWord.length + index];
        wordNode.appendChild(extraNode);
      }
    }

    fragment.appendChild(wordNode);
    if (wordIndex < testState.promptWords.length - 1) {
      fragment.appendChild(document.createTextNode(' '));
    }
  });

  prompt.appendChild(fragment);
  updateCaretStyle();
}

function getWordError(wordIndex) {
  const expected = testState.promptWords[wordIndex] || '';
  const typed = testState.typedWords[wordIndex] || '';
  if (!typed) return false;
  for (let index = 0; index < typed.length; index += 1) {
    if (typed[index] !== expected[index]) {
      return true;
    }
  }
  return typed.length > expected.length;
}

function handleKeyDown(event) {
  const targetTag = event.target?.tagName;
  if (targetTag === 'INPUT' || targetTag === 'SELECT' || targetTag === 'TEXTAREA') {
    return;
  }

  if (event.key === 'Escape' && settingsState.mode === 'zen') {
    event.preventDefault();
    finishTest();
    return;
  }

  if (event.key === 'Backspace') {
    event.preventDefault();
    removeLastChar();
    return;
  }

  if (event.key === ' ') {
    event.preventDefault();
    submitWord();
    return;
  }

  if (event.key.length !== 1 || testState.finished) {
    return;
  }

  if (!testState.started) {
    startTest();
  }

  if (settingsState.stopOnError && getWordError(testState.currentWordIndex) && testState.currentCharIndex > 0) {
    return;
  }

  const currentWord = testState.promptWords[testState.currentWordIndex] || '';
  const typedWord = testState.typedWords[testState.currentWordIndex] || '';
  const expectedChar = currentWord[testState.currentCharIndex];
  const typedChar = event.key;

  if (typedChar === expectedChar) {
    testState.correctChars += 1;
  } else if (testState.currentCharIndex < currentWord.length) {
    testState.incorrectChars += 1;
  } else {
    testState.extraChars += 1;
  }

  testState.typedWords[testState.currentWordIndex] = typedWord + typedChar;
  testState.currentCharIndex += 1;
  testState.currentCharIndex = Math.min(testState.currentCharIndex, currentWord.length + 1);
  testState.typedWords[testState.currentWordIndex] = (testState.typedWords[testState.currentWordIndex] || '').slice(0, currentWord.length + 1);

  if (settingsState.difficulty === 'master' && typedChar !== expectedChar) {
    finishTest();
    return;
  }

  if (testState.currentCharIndex > currentWord.length) {
    testState.currentCharIndex = currentWord.length;
  }

  updateStats();
  renderPrompt();
}

function removeLastChar() {
  if (!testState.started) return;
  const currentWord = testState.promptWords[testState.currentWordIndex] || '';
  const typedWord = testState.typedWords[testState.currentWordIndex] || '';
  if (!typedWord.length) {
    return;
  }

  const removedChar = typedWord[typedWord.length - 1];
  const lastExpected = currentWord[typedWord.length - 1];
  testState.typedWords[testState.currentWordIndex] = typedWord.slice(0, -1);
  testState.currentCharIndex = Math.max(0, typedWord.length - 1);

  if (removedChar === lastExpected) {
    testState.correctChars = Math.max(0, testState.correctChars - 1);
  } else if (typedWord.length - 1 < currentWord.length) {
    testState.incorrectChars = Math.max(0, testState.incorrectChars - 1);
  } else {
    testState.extraChars = Math.max(0, testState.extraChars - 1);
  }

  updateStats();
  renderPrompt();
}

function submitWord() {
  if (!testState.started) {
    startTest();
  }

  const currentWord = testState.promptWords[testState.currentWordIndex] || '';
  const typedWord = testState.typedWords[testState.currentWordIndex] || '';

  if (!typedWord.length) {
    if (testState.currentWordIndex < testState.promptWords.length - 1) {
      testState.currentWordIndex += 1;
      testState.currentCharIndex = 0;
      renderPrompt();
    }
    return;
  }

  if (settingsState.stopOnError && getWordError(testState.currentWordIndex)) {
    return;
  }

  if (settingsState.difficulty === 'expert' && getWordError(testState.currentWordIndex)) {
    finishTest();
    return;
  }

  const expectedLength = currentWord.length;
  const typedLength = typedWord.length;
  if (typedLength < expectedLength) {
    testState.missedChars += expectedLength - typedLength;
  }

  testState.currentWordIndex += 1;
  testState.currentCharIndex = 0;

  if (settingsState.mode === 'zen' && testState.currentWordIndex >= testState.promptWords.length - 10) {
    testState.promptWords = [...testState.promptWords, ...buildWordList(30)];
    testState.typedWords = [...testState.typedWords, ...Array.from({ length: 30 }, () => '')];
  }

  if (settingsState.mode !== 'zen' && testState.currentWordIndex >= testState.promptWords.length) {
    finishTest();
    return;
  }

  updateStats();
  renderPrompt();
}

function startTest() {
  testState.started = true;
  testState.startedAt = Date.now();
  testState.timeRemaining = settingsState.timeLimit;
  elements.statusMessage.textContent = 'Keep going…';

  if (settingsState.mode === 'time') {
    testState.timerInterval = setInterval(() => {
      testState.timeRemaining -= 1;
      elements.timeDisplay.textContent = `${Math.max(0, testState.timeRemaining)}s`;
      testState.chartPoints.push({ time: Date.now() - testState.startedAt, wpm: getWpm(), rawWpm: getRawWpm() });
      if (testState.timeRemaining <= 0) {
        finishTest();
      }
    }, 1000);
  }
}

function updateStats() {
  const totalTyped = testState.correctChars + testState.incorrectChars + testState.extraChars;
  const elapsedSeconds = Math.max(1, (Date.now() - (testState.startedAt || Date.now())) / 1000);
  const accuracyValue = totalTyped ? Math.round((testState.correctChars / totalTyped) * 100) : 100;

  elements.wpm.textContent = String(getWpm());
  elements.rawWpm.textContent = String(getRawWpm());
  elements.accuracy.textContent = `${accuracyValue}%`;
  elements.timeDisplay.textContent = settingsState.mode === 'time' ? `${Math.max(0, testState.timeRemaining)}s` : '∞';
}

function getWpm() {
  const elapsedMinutes = Math.max(1, (Date.now() - (testState.startedAt || Date.now())) / 60000);
  return Math.round((testState.correctChars / 5) / elapsedMinutes);
}

function getRawWpm() {
  const elapsedMinutes = Math.max(1, (Date.now() - (testState.startedAt || Date.now())) / 60000);
  return Math.round(((testState.correctChars + testState.incorrectChars + testState.extraChars) / 5) / elapsedMinutes);
}

function finishTest() {
  if (testState.finished) return;
  testState.finished = true;
  clearInterval(testState.timerInterval);
  testState.finishedAt = Date.now();
  elements.statusMessage.textContent = 'Test complete.';
  elements.resultsCard.classList.remove('hidden');

  const totalTyped = testState.correctChars + testState.incorrectChars + testState.extraChars;
  const elapsedSeconds = Math.max(1, (testState.finishedAt - testState.startedAt) / 1000);
  const wpm = Math.round((testState.correctChars / 5) / (elapsedSeconds / 60));
  const rawWpm = Math.round((totalTyped / 5) / (elapsedSeconds / 60));
  const accuracy = totalTyped ? Math.round((testState.correctChars / totalTyped) * 100) : 100;

  elements.resultWpm.textContent = String(wpm);
  elements.resultRawWpm.textContent = String(rawWpm);
  elements.resultAccuracy.textContent = `${accuracy}%`;
  elements.resultChars.textContent = String(totalTyped);
  elements.correctCount.textContent = String(testState.correctChars);
  elements.incorrectCount.textContent = String(testState.incorrectChars);
  elements.extraCount.textContent = String(testState.extraChars);
  elements.missedCount.textContent = String(testState.missedChars);
  renderChart([wpm, rawWpm]);
  updateStats();
}

function renderChart(wpmSeries) {
  if (!window.Chart) return;
  const points = testState.chartPoints.length > 0 ? testState.chartPoints : [{ time: 0, wpm: wpmSeries[0], rawWpm: wpmSeries[1] }];
  const labels = points.map((point) => `${Math.round(point.time / 1000)}s`);
  const data = points.map((point) => point.wpm);
  const rawData = points.map((point) => point.rawWpm);

  if (testState.chart) {
    testState.chart.destroy();
  }

  testState.chart = new Chart(elements.resultsChart, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'WPM', data, borderColor: '#60a5fa', tension: 0.3, fill: false },
        { label: 'Raw WPM', data: rawData, borderColor: '#34d399', tension: 0.3, fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#f9fafb' } } },
      scales: { x: { ticks: { color: '#9ca3af' } }, y: { ticks: { color: '#9ca3af' } } }
    }
  });
}

init();
