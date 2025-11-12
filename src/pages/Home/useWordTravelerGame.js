import { useCallback, useMemo, useState } from 'preact/hooks';

const countWords = text => text.trim().split(/\s+/).filter(Boolean).length;

const normalizeIndex = (value, total) => ((value % total) + total) % total;

export function useWordTravelerGame(totalSlices) {
	const [inputValue, setInputValue] = useState('');
	const [position, setPosition] = useState(0);
	const [turns, setTurns] = useState(0);
	const [lastMove, setLastMove] = useState(null);
	const [steps, setSteps] = useState(0);
	const [laps, setLaps] = useState(0);
	const [hasWon, setHasWon] = useState(false);

	const wordCount = useMemo(() => countWords(inputValue), [inputValue]);
	const activeIndex = useMemo(() => normalizeIndex(position, totalSlices), [position, totalSlices]);

	const updateInput = useCallback(value => {
		setInputValue(value);
	}, []);

	const submitTurn = useCallback(() => {
		const move = wordCount;
		if (move === 0 || hasWon) return false;

		const nextPosition = normalizeIndex(position + move, totalSlices);
		const updatedSteps = steps + move;
		const computedLaps = Math.floor(updatedSteps / totalSlices);

		setPosition(nextPosition);
		setSteps(updatedSteps);
		setTurns(prev => prev + 1);
		setLastMove(move);
		setInputValue('');
		setLaps(computedLaps);
		if (computedLaps >= 3) {
			setHasWon(true);
		}
		return true;
	}, [hasWon, position, steps, totalSlices, wordCount]);

	const selectSlice = useCallback(index => {
		if (typeof index !== 'number' || hasWon) return;
		// setPosition(normalizeIndex(index, totalSlices));
	}, [hasWon, totalSlices]);

	const resetGame = useCallback(() => {
		setInputValue('');
		setPosition(0);
		setTurns(0);
		setLastMove(null);
		setSteps(0);
		setLaps(0);
		setHasWon(false);
	}, []);

	return {
		totalSlices,
		inputValue,
		updateInput,
		wordCount,
		turns,
		lastMove,
		activeIndex,
		submitTurn,
		selectSlice,
		laps,
		hasWon,
		resetGame,
	};
}
