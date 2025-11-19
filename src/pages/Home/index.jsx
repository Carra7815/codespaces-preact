import { useEffect, useMemo, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import './Home.css';

import { GameBoard } from './GameBoard.jsx';
import { GamePanel } from './GamePanel.jsx';
import { useWordTravelerGame } from './useWordTravelerGame.js';

import africaImg from '../../assets/questions/africa.webp';
        import backflipImg from '../../assets/questions/backflip.webp';
        import basketballImg from '../../assets/questions/bball.webp';
        import calculusImg from '../../assets/questions/calculus.webp';
        import cashImg from '../../assets/questions/cash.webp';
        import codeImg from '../../assets/questions/code.webp';
        import cruiseImg from '../../assets/questions/cruise.webp';
        import eiffelImg from '../../assets/questions/eiffel.webp';
        import futbolImg from '../../assets/questions/futbol.webp';
        import heartImg from '../../assets/questions/heart.webp';
        import iceCreamImg from '../../assets/questions/ice-cream.webp';
        import insectsImg from '../../assets/questions/insects.webp';
        import lotrImg from '../../assets/questions/lotr.webp';
        import octopusImg from '../../assets/questions/octopus.webp';
        import peeImg from '../../assets/questions/pee.webp';
        import poleImg from '../../assets/questions/pole.webp';
        import pushupImg from '../../assets/questions/pushup.webp';
        import skydivingImg from '../../assets/questions/skydiving.webp';
        import tornadoImg from '../../assets/questions/tornado.webp';
        import weightliftingImg from '../../assets/questions/weightlifting.webp';

const QUESTIONS = [
    {
        prompt: '¿Alguna vez has comido insectos?',
        imageSrc: insectsImg,
        imageAlt: 'Plato ilustrado con insectos comestibles',
    },
    {
        prompt: '¿Alguna vez has visitado París?',
        imageSrc: eiffelImg,
        imageAlt: 'Silueta estilizada de la Torre Eiffel',
    },
    {
        prompt: '¿Alguna vez has lamido un poste congelado?',
        imageSrc: poleImg,
        imageAlt: 'Poste congelado con carita sorprendida',
    },
    {
        prompt: '¿Alguna vez has comido pulpo?',
        imageSrc: octopusImg,
        imageAlt: 'Pulpo simpático servido en un plato',
    },
    {
        prompt: '¿Alguna vez has saltado de un avión en paracaídas?',
        imageSrc: skydivingImg,
        imageAlt: 'Persona descendiendo con paracaídas colorido',
    },
    {
        prompt: '¿Alguna vez has cogido 10,000 dólares?',
        imageSrc: cashImg,
        imageAlt: 'Montón de billetes sosteniéndose en la mano',
    },
    {
        prompt: '¿Alguna vez has hecho una voltereta hacia atrás?',
        imageSrc: backflipImg,
        imageAlt: 'Figura humana realizando una voltereta',
    },
    {
        prompt: '¿Alguna vez has hecho fútbol?',
        imageSrc: futbolImg,
        imageAlt: 'Balón de fútbol girando en el aire',
    },
    {
        prompt: '¿Alguna vez has programado una aplicación?',
        imageSrc: codeImg,
        imageAlt: 'Pantalla con líneas de código y engranes',
    },
    {
        prompt: '¿Alguna vez has hecho 100 lagartijas?',
        imageSrc: pushupImg,
        imageAlt: 'Persona ejercitándose haciendo lagartijas',
    },
    {
        prompt: '¿Alguna vez has estudiado cálculo?',
        imageSrc: calculusImg,
        imageAlt: 'Pizarra con fórmulas matemáticas',
    },
    {
        prompt: '¿Alguna vez has ido a África?',
        imageSrc: africaImg,
        imageAlt: 'Mapa minimalista del continente africano',
    },
    {
        prompt: '¿Alguna vez has estado en un crucero?',
        imageSrc: cruiseImg,
        imageAlt: 'Barco crucero navegando en el mar',
    },
    {
        prompt: '¿Alguna vez has estado tan emocionado que orinaste?',
        imageSrc: peeImg,
        imageAlt: 'Carita sonrojada sosteniendo una estrella',
    },
    {
        prompt: '¿Alguna vez has llevado 100kg?',
        imageSrc: weightliftingImg,
        imageAlt: 'Atleta levantando una barra pesada',
    },
    {
        prompt: '¿Alguna vez has besado a alguien?',
        imageSrc: heartImg,
        imageAlt: 'Dos siluetas preparadas para un beso',
    },
    {
        prompt: '¿Alguna vez has visto un tornado?',
        imageSrc: tornadoImg,
        imageAlt: 'Tornado caricaturesco sobre un campo',
    },
    {
        prompt: '¿Alguna vez has comido un kilo de helado?',
        imageSrc: iceCreamImg,
        imageAlt: 'Gigante copa de helado con toppings',
    },
    {
        prompt: '¿Alguna vez has tirado un triple en baloncesto?',
        imageSrc: basketballImg,
        imageAlt: 'Balón de baloncesto entrando en la canasta',
    },
    {
        prompt: '¿Alguna vez has leído El Señor de los Anillos?',
        imageSrc: lotrImg,
        imageAlt: 'Libro abierto con una joya brillante',
    },
];

const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#eab308', '#14b8a6', '#f43f5e', '#8b5cf6', '#10b981'];
const MAX_REVOLUTIONS = 3;

const getPlayerCountFromSearch = () => {
    if (typeof window === 'undefined') return 0;
    const params = new URLSearchParams(window.location.search);
    const value = Number(params.get('players'));
    return Number.isInteger(value) && value > 0 ? value : 0;
};

export function Home() {
    const location = useLocation();
    const navigate = location?.route;
    const [playerCount, setPlayerCount] = useState(() => getPlayerCountFromSearch());

    useEffect(() => {
        if (!playerCount && typeof navigate === 'function') {
            navigate('/', true);
        }
    }, [navigate, playerCount]);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        const handlePopState = () => setPlayerCount(getPlayerCountFromSearch());
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const game = useWordTravelerGame({
        questions: QUESTIONS,
        playerCount,
        maxRevolutions: MAX_REVOLUTIONS,
    });

    const currentQuestion = useMemo(() => game.currentQuestionData, [game.currentQuestionData]);

    return (
        <div class="home-page">
            <div class="home-page__grid">
                <GamePanel game={game} question={currentQuestion} />
                <GameBoard
                    spaces={game.spaces}
                    colors={COLORS}
                    activeIndex={game.activeIndex}
                    onSliceSelect={game.selectSlice}
                />
            </div>
        </div>
    );
}
