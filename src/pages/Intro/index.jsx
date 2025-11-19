import { useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import './Intro.css';

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 6;

export function Intro() {
	const { route: navigate } = useLocation();
	const [players, setPlayers] = useState(2);

	const handleSubmit = event => {
		event.preventDefault();
		const total = Math.min(Math.max(players, MIN_PLAYERS), MAX_PLAYERS);
		if (typeof navigate === 'function') {
			navigate(`/game?players=${total}`);
		}
	};

	return (
		<div class="intro-page">
			<section class="intro-page__panel">
				<h1 class="intro-page__title">Word Traveler</h1>
				<p class="intro-page__subtitle">
					Organiza a tus jugadores, elige a un Game Master humano y prepárate para recorrer el tablero.
				</p>
				<form class="intro-page__form" onSubmit={handleSubmit}>
					<label class="intro-page__label" htmlFor="player-count">Número de jugadores</label>
					<input
						id="player-count"
						type="number"
						min={MIN_PLAYERS}
						max={MAX_PLAYERS}
						value={players}
						onInput={event => setPlayers(Number(event.currentTarget.value))}
						class="intro-page__input"
					/>
					<p class="intro-page__hint">Los turnos rotarán automáticamente entre los jugadores.</p>
					<button type="submit" class="intro-page__button">Comenzar partida</button>
				</form>
			</section>
		</div>
	);
}
