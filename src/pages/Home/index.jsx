import { useMemo, useState } from 'preact/hooks';
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

export function Home() {
    const [inputValue, setInputValue] = useState('');
    const [position, setPosition] = useState(0);
    const [turns, setTurns] = useState(0);
    const [lastMove, setLastMove] = useState(null);

    const totalSlices = QUESTIONS.length;
    const wordCount = useMemo(() => countWords(inputValue), [inputValue]);
    const activeIndex = ((position % totalSlices) + totalSlices) % totalSlices;
    const currentQuestion = QUESTIONS[activeIndex];

    const handleInputChange = event => {
        setInputValue(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        if (wordCount === 0) return;

        setPosition(prev => (prev + wordCount) % totalSlices);
        setTurns(prev => prev + 1);
        setLastMove(wordCount);
        setInputValue('');
    };

    const handleSliceSelect = index => {
        if (typeof index === 'number') {
            setPosition(index % totalSlices);
        }
    };

    return (
        <div class="home">
            <div class="home-game">
                <section class="home-game__panel" aria-live="polite">
                    <h1 class="home-game__title">Juego de la Palabra Viajera</h1>
                    <p class="home-game__subtitle">Mueve tu ficha por el pastel escribiendo palabras.</p>
                    <div class="home-game__status">
                        <span class="home-game__status-item">Turnos: {turns}</span>
                        <span class="home-game__status-item">Posición actual: {activeIndex + 1} / {totalSlices}</span>
                    </div>
                    <p class="home-game__question" data-testid="current-question">{currentQuestion}</p>
                    <form class="home-game__form" onSubmit={handleSubmit}>
                        <label class="home-game__label" htmlFor="word-input">Escribe tu jugada</label>
                        <textarea
                            id="word-input"
                            class="home-game__textarea"
                            placeholder="Escribe algunas palabras..."
                            value={inputValue}
                            onInput={handleInputChange}
                            autoComplete="off"
                            rows={4}
                        />
                        <div class="home-game__word-count">Palabras: {wordCount}</div>
                        <button type="submit" class="home-game__button" disabled={wordCount === 0}>
                            Avanzar {wordCount === 1 ? '1 espacio' : `${wordCount} espacios`}
                        </button>
                    </form>
                    {lastMove !== null && (
                        <p class="home-game__history">Último movimiento: avanzaste {lastMove} {lastMove === 1 ? 'espacio' : 'espacios'}.</p>
                    )}
                </section>
                <div class="home-game__board">
                    <Pie size={520} innerRadius={150} holeColor="#f8fafc" activeIndex={activeIndex} onSliceSelect={handleSliceSelect}>
                        {QUESTIONS.map((prompt, index) => (
                            <PieSlice key={index} color={COLORS[index % COLORS.length]} label={`${index + 1}`}>
                                {prompt}
                            </PieSlice>
                        ))}
                    </Pie>
                </div>
            </div>
        </div>
    );
}
