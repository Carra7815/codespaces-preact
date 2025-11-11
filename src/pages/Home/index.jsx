import { useCallback, useMemo, useState } from 'preact/hooks';
import './style.css';

import { Pie } from '../../components/Pie.jsx';
import { PieSlice } from '../../components/PieSlice.jsx';

const QUESTIONS = [
    '¿Alguna vez has comido insectos?',
    '¿Alguna vez has visitado París?',
    '¿Alguna vez has lamido un poste congelado?',
    '¿Alguna vez has comido pulpo?',
    '¿Alguna vez has sellado de un avión en paracaídas?',
    '¿Alguna vez has cogido 10,000 dólares?',
    '¿Alguna vez has hecho una voltereta hacia atrás?',
    '¿Alguna vez has hecho fútbol?',
    '¿Alguna vez has programado una aplicación?',
    '¿Alguna vez has hecho 100 lagartijas?',
    '¿Alguna vez has estudiado cálculo?',
    '¿Alguna vez has ido a África?',
    '¿Alguna vez has estado en un crucero?',
    '¿Alguna vez has estado tan emocionado que orinaste?',
    '¿Alguna vez has llevado 100kg?',
    '¿Alguna vez has besado a alguien?',
    '¿Alguna vez has visto un tornado?',
    '¿Alguna vez has comido un kilo de helado?',
    '¿Alguna vez has tirado un triple en baloncesto?',
    '¿Alguna vez has leído El Señor de los Anillos?',
];

const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#eab308', '#14b8a6', '#f43f5e', '#8b5cf6', '#10b981'];

const countWords = text => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return words.length;
};

const normalizeIndex = (value, total) => {
    return ((value % total) + total) % total;
};

const useWordTravelerGame = totalSlices => {
    const [inputValue, setInputValue] = useState('');
    const [position, setPosition] = useState(0);
    const [turns, setTurns] = useState(0);
    const [lastMove, setLastMove] = useState(null);

    const wordCount = useMemo(() => countWords(inputValue), [inputValue]);
    const activeIndex = useMemo(() => normalizeIndex(position, totalSlices), [position, totalSlices]);

    const updateInput = useCallback(value => {
        setInputValue(value);
    }, []);

    const submitTurn = useCallback(() => {
        const move = wordCount;
        if (move === 0) return false;
        setPosition(prev => normalizeIndex(prev + move, totalSlices));
        setTurns(prev => prev + 1);
        setLastMove(move);
        setInputValue('');
        return true;
    }, [totalSlices, wordCount]);

    const selectSlice = useCallback(index => {
        if (typeof index !== 'number') return;
        // setPosition(normalizeIndex(index, totalSlices));
    }, [totalSlices]);

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
    };
};

const GamePanel = ({ game, question }) => {
    const handleChange = event => {
        game.updateInput(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        game.submitTurn();
    };

    return (
        <section class="home-game__panel" aria-live="polite">
            <h1 class="home-game__title">Juego de la Palabra Viajera</h1>
            <p class="home-game__subtitle">Mueve tu ficha por el pastel escribiendo palabras.</p>
            <div class="home-game__status">
                <span class="home-game__status-item">Turnos: {game.turns}</span>
                <span class="home-game__status-item">Posición actual: {game.activeIndex + 1} / {game.totalSlices}</span>
            </div>
            <p class="home-game__question" data-testid="current-question">{question}</p>
            <form class="home-game__form" onSubmit={handleSubmit}>
                <label class="home-game__label" htmlFor="word-input">Escribe tu jugada</label>
                <textarea
                    id="word-input"
                    class="home-game__textarea"
                    placeholder="Escribe algunas palabras..."
                    value={game.inputValue}
                    onInput={handleChange}
                    autoComplete="off"
                    rows={4}
                />
                <div class="home-game__word-count">Palabras: {game.wordCount}</div>
                <button type="submit" class="home-game__button" disabled={game.wordCount === 0}>
                    Avanzar {game.wordCount === 1 ? '1 espacio' : `${game.wordCount} espacios`}
                </button>
            </form>
            {game.lastMove !== null && (
                <p class="home-game__history">Último movimiento: avanzaste {game.lastMove} {game.lastMove === 1 ? 'espacio' : 'espacios'}.</p>
            )}
        </section>
    );
};

const GameBoard = ({ questions, colors, activeIndex, onSliceSelect }) => (
    <section class="home-game__board">
        <Pie size={520} innerRadius={150} holeColor="#f8fafc" activeIndex={activeIndex} onSliceSelect={onSliceSelect}>
            {questions.map((prompt, index) => (
                <PieSlice key={index} color={colors[index % colors.length]} label={`${index + 1}`}>
                    {prompt}
                </PieSlice>
            ))}
        </Pie>
    </section>
);

export function Home() {
    const game = useWordTravelerGame(QUESTIONS.length);
    const currentQuestion = useMemo(() => QUESTIONS[game.activeIndex], [game.activeIndex]);

    return (
        <div class="home">
            <div class="home-game">
                <GamePanel game={game} question={currentQuestion} />
                <GameBoard
                    questions={QUESTIONS}
                    colors={COLORS}
                    activeIndex={game.activeIndex}
                    onSliceSelect={game.selectSlice}
                />
            </div>
        </div>
    );
}
