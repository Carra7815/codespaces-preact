import { useMemo } from 'preact/hooks';
import './Home.css';

import { GameBoard } from './GameBoard.jsx';
import { GamePanel } from './GamePanel.jsx';
import { useWordTravelerGame } from './useWordTravelerGame.js';

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

export function Home() {
    const game = useWordTravelerGame(QUESTIONS.length);
    const currentQuestion = useMemo(() => QUESTIONS[game.activeIndex], [game.activeIndex]);

    return (
        <div class="home-page">
            <div class="home-page__grid">
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
