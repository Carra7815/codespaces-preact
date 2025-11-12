import './GamePanel.css';

export function GamePanel({ game, question }) {
	const handleChange = event => {
		if (game.hasWon) return;
		game.updateInput(event.target.value);
	};

	const handleSubmit = event => {
		event.preventDefault();
		game.submitTurn();
	};

	const handleReset = () => {
		game.resetGame();
	};

	const isSubmitDisabled = game.wordCount === 0 || game.hasWon;

	return (
		<section class="game-panel" aria-live="polite">
			<h1 class="game-panel__title">Juego de la Palabra Viajera</h1>
			<p class="game-panel__subtitle">Mueve tu ficha por el pastel escribiendo palabras.</p>
			<div class="game-panel__status">
				<span class="game-panel__status-item">Turnos: {game.turns}</span>
				<span class="game-panel__status-item">Posición actual: {game.activeIndex + 1} / {game.totalSlices}</span>
				<span class="game-panel__status-item">Vueltas: {Math.min(game.laps, 3)} / 3</span>
			</div>
			{game.hasWon && (
				<div class="game-panel__win-message" role="status">
					¡Victoria! Diste 3 vueltas completas al tablero.
				</div>
			)}
			<p class="game-panel__question" data-testid="current-question">{question}</p>
			<form class="game-panel__form" onSubmit={handleSubmit}>
				<label class="game-panel__label" htmlFor="word-input">Escribe tu jugada</label>
				<textarea
					id="word-input"
					class="game-panel__textarea"
					placeholder="Escribe algunas palabras..."
					value={game.inputValue}
					onInput={handleChange}
					autoComplete="off"
					rows={4}
					disabled={game.hasWon}
				/>
				<div class="game-panel__word-count">Palabras: {game.wordCount}</div>
				<button type="submit" class="game-panel__submit-button" disabled={isSubmitDisabled}>
					Avanzar {game.wordCount === 1 ? '1 espacio' : `${game.wordCount} espacios`}
				</button>
			</form>
			{game.lastMove !== null && (
				<p class="game-panel__history">Último movimiento: avanzaste {game.lastMove} {game.lastMove === 1 ? 'espacio' : 'espacios'}.</p>
			)}
			<button type="button" class="game-panel__reset-button" onClick={handleReset}>
				Reiniciar partida
			</button>
		</section>
	);
}
