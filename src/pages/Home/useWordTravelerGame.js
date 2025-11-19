import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

const countWords = text => (text ? text.trim().split(/\s+/).filter(Boolean).length : 0);

const normalizeIndex = (value, total) => {
	if (!total) return 0;
	return ((value % total) + total) % total;
};

const shuffleArray = source => {
	const clone = [...source];
	for (let i = clone.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[clone[i], clone[j]] = [clone[j], clone[i]];
	}
	return clone;
};

const fallbackQuestion = {
	prompt: 'Pregunta',
	imageSrc: null,
	imageAlt: 'Ilustración de la pregunta',
};

const normalizeQuestionEntry = entry => {
	if (typeof entry === 'string') {
		return {
			prompt: entry,
			imageSrc: null,
			imageAlt: entry ? `Ilustración de ${entry}` : fallbackQuestion.imageAlt,
		};
	}
	if (entry && typeof entry === 'object') {
		const prompt = entry.prompt ?? entry.text ?? fallbackQuestion.prompt;
		const imageSrc = entry.imageSrc ?? entry.image ?? null;
		const imageAlt = entry.imageAlt ?? (prompt ? `Ilustración de ${prompt}` : fallbackQuestion.imageAlt);
		return {
			prompt,
			imageSrc,
			imageAlt,
		};
	}
	return { ...fallbackQuestion };
};

const createSpaces = questions =>
	shuffleArray(questions).map((question, index) => {
		const normalized = normalizeQuestionEntry(question);
		return {
			id: `${index}-${normalized.prompt}-${Math.random().toString(36).slice(2, 8)}`,
			...normalized,
			used: false,
		};
	});

const createPlayers = count => {
	return Array.from({ length: count }, (_, index) => ({
		id: index,
		name: `Jugador ${index + 1}`,
		score: 0,
		turns: 0,
	}));
};

const findNextUnusedIndex = (spaces, startIndex) => {
	if (!spaces.length) return null;
	for (let offset = 0; offset < spaces.length; offset += 1) {
		const idx = normalizeIndex(startIndex + offset, spaces.length);
		if (!spaces[idx].used) {
			return idx;
		}
	}
	return null;
};

export function useWordTravelerGame({ questions = [], playerCount = 1, maxRevolutions = 3 }) {
	const baseQuestions = Array.isArray(questions) && questions.length ? questions : [fallbackQuestion];
	const totalSlices = baseQuestions.length;
	const safePlayerCount = Number.isInteger(playerCount) && playerCount > 0 ? playerCount : 1;

	const [spaces, setSpaces] = useState(() => createSpaces(baseQuestions));
	const [position, setPosition] = useState(0);
	const [turns, setTurns] = useState(0);
	const [lastMove, setLastMove] = useState(null);
	const [steps, setSteps] = useState(0);
	const [revolution, setRevolution] = useState(1);
	const [players, setPlayers] = useState(() => createPlayers(safePlayerCount));
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [gameMasterSpaces, setGameMasterSpaces] = useState('');
	const [gameOver, setGameOver] = useState(false);

	useEffect(() => {
		setPlayers(createPlayers(safePlayerCount));
		setCurrentPlayerIndex(0);
		setSpaces(createSpaces(baseQuestions));
		setPosition(0);
		setTurns(0);
		setLastMove(null);
		setSteps(0);
		setRevolution(1);
		setInputValue('');
		setGameMasterSpaces('');
		setGameOver(false);
	}, [baseQuestions, safePlayerCount]);

	const wordCount = useMemo(() => countWords(inputValue), [inputValue]);
	const activeIndex = useMemo(() => normalizeIndex(position, totalSlices), [position, totalSlices]);
	const currentQuestionData = useMemo(() => spaces[activeIndex] ?? fallbackQuestion, [spaces, activeIndex]);
	const currentQuestion = currentQuestionData.prompt ?? fallbackQuestion.prompt;

	const updateInput = useCallback(value => {
		setInputValue(value);
	}, []);

	const updateGameMasterSpaces = useCallback(value => {
		setGameMasterSpaces(value);
	}, []);

	const selectSlice = useCallback(() => {}, []);

	const submitTurn = useCallback(() => {
		if (gameOver || wordCount === 0 || !players.length) return false;
		const currentSpace = spaces[activeIndex];
		if (!currentSpace) return false;

		const parsedMove = Number(gameMasterSpaces);
		const moveSpaces = Number.isFinite(parsedMove) && parsedMove > 0 ? parsedMove : wordCount;
		if (moveSpaces <= 0) return false;

		let workingSpaces = spaces.map((space, index) => (index === activeIndex ? { ...space, used: true } : space));
		let nextRevolution = revolution;
		let shouldEnd = false;

		setPlayers(prev =>
			prev.map((player, index) =>
				index === currentPlayerIndex
					? {
						...player,
						score: player.score + wordCount,
						turns: player.turns + 1,
					}
					: player
			)
		);

		const tentativePosition = normalizeIndex(position + moveSpaces, totalSlices);
		let nextPositionIndex = findNextUnusedIndex(workingSpaces, tentativePosition);

		const boardCleared = workingSpaces.every(space => space.used);
		if (boardCleared) {
			nextRevolution = revolution + 1;
			if (nextRevolution > maxRevolutions) {
				shouldEnd = true;
			} else {
				workingSpaces = createSpaces(baseQuestions);
				nextPositionIndex = 0;
			}
		} else if (nextPositionIndex === null) {
			nextPositionIndex = findNextUnusedIndex(workingSpaces, 0);
		}

		setSpaces(workingSpaces);
		setPosition(nextPositionIndex ?? 0);
		setSteps(prev => prev + moveSpaces);
		setTurns(prev => prev + 1);
		setLastMove(moveSpaces);
		setCurrentPlayerIndex(prev => (prev + 1) % players.length);
		setInputValue('');
		setGameMasterSpaces('');
		if (nextRevolution !== revolution) {
			setRevolution(Math.min(nextRevolution, maxRevolutions));
		}
		if (shouldEnd) {
			setGameOver(true);
		}
		return true;
	}, [activeIndex, baseQuestions, gameMasterSpaces, gameOver, maxRevolutions, players.length, position, revolution, spaces, totalSlices, wordCount, currentPlayerIndex]);

	const resetGame = useCallback(() => {
		setSpaces(createSpaces(baseQuestions));
		setPosition(0);
		setTurns(0);
		setLastMove(null);
		setSteps(0);
		setRevolution(1);
		setPlayers(createPlayers(safePlayerCount));
		setCurrentPlayerIndex(0);
		setInputValue('');
		setGameMasterSpaces('');
		setGameOver(false);
	}, [baseQuestions, safePlayerCount]);

	const leaderboard = useMemo(() => {
		return [...players].sort((a, b) => b.score - a.score || a.id - b.id);
	}, [players]);

	const currentPlayer = players[currentPlayerIndex] ?? players[0] ?? null;

	return {
		totalSlices,
		spaces,
		inputValue,
		updateInput,
		wordCount,
		turns,
		lastMove,
		activeIndex,
		currentQuestion,
		currentQuestionData,
		gameMasterSpaces,
		updateGameMasterSpaces,
		submitTurn,
		selectSlice,
		revolution,
		maxRevolutions,
		players,
		currentPlayerIndex,
		currentPlayer,
		leaderboard,
		steps,
		gameOver,
		resetGame,
	};
}
