import './GamePanel.css';

export function GamePanel({ game, question }) {
	const normalizedQuestion = (() => {
		if (question && typeof question === 'object') {
			return question;
		}
		const prompt = typeof question === 'string' && question.length ? question : game.currentQuestion ?? '';
		return { prompt, imageSrc: null, imageAlt: '' };
	})();

	const questionPrompt = normalizedQuestion.prompt ?? '';
	const questionImageSrc = normalizedQuestion.imageSrc ?? null;
	const questionImageAlt = normalizedQuestion.imageAlt ?? (questionPrompt || 'Ilustración de la pregunta');
	const currentPlayerName = game.currentPlayer?.name ?? `Jugador ${game.currentPlayerIndex + 1}`;

	const handleTextChange = event => {
		if (game.gameOver) return;
		game.updateInput(event.target.value);
	};

	const handleSpacesChange = event => {
		if (game.gameOver) return;
		game.updateGameMasterSpaces(event.target.value);
	};

	const handleSubmit = event => {
		event.preventDefault();
		game.submitTurn();
	};

	const handleReset = () => {
		game.resetGame();
	};

	const isSubmitDisabled = game.wordCount === 0 || game.gameOver;
	const buttonLabel = game.gameMasterSpaces
		? `Mover ${game.gameMasterSpaces} ${Number(game.gameMasterSpaces) === 1 ? 'espacio' : 'espacios'}`
		: `Usar ${game.wordCount || 0} ${game.wordCount === 1 ? 'palabra' : 'palabras'}`;

	return (
		<section class="game-panel" aria-live="polite">
			<div class="game-panel__header">
				<div>
					<h1 class="game-panel__title">Juego de la Palabra Viajera</h1>
					<p class="game-panel__subtitle">El Game Master valida respuestas, asigna espacios y controla las vueltas.</p>
				</div>
				<div class="game-panel__badge">
					<span>Revoluciones</span>
					<strong>{game.revolution} / {game.maxRevolutions}</strong>
				</div>
			</div>
			<div class="game-panel__status">
				<span class="game-panel__status-item">Jugador actual: {currentPlayerName}</span>
				<span class="game-panel__status-item">Turnos jugados: {game.turns}</span>
				<span class="game-panel__status-item">Casilla {game.activeIndex + 1} / {game.totalSlices}</span>
			</div>
			{game.gameOver && (
				<div class="game-panel__win-message" role="status">
					Se completaron las {game.maxRevolutions} vueltas. ¡Consulta el leaderboard final!
				</div>
			)}
			<div class="game-panel__question-card" data-testid="current-question">
				<div class="game-panel__question-layout">
					{questionImageSrc && (
						<div class="game-panel__question-image">
							<img src={questionImageSrc} alt={questionImageAlt} loading="lazy" />
						</div>
					)}
					<div class="game-panel__question-copy">
						<h2>Pregunta #{game.activeIndex + 1}</h2>
						<p>{questionPrompt}</p>
					</div>
				</div>
			</div>
			<form class="game-panel__form" onSubmit={handleSubmit}>
				<label class="game-panel__label" htmlFor="word-input">Respuesta del jugador</label>
				<textarea
					id="word-input"
					class="game-panel__textarea"
					placeholder="Describe tu experiencia..."
					value={game.inputValue}
					onInput={handleTextChange}
					autoComplete="off"
					rows={4}
					disabled={game.gameOver}
				/>
				<div class="game-panel__field-grid">
					<div class="game-panel__field">
						<span class="game-panel__field-label">Palabras detectadas</span>
						<div class="game-panel__word-count">{game.wordCount}</div>
					</div>
					<div class="game-panel__field">
						<label class="game-panel__field-label" htmlFor="spaces-input">Espacios dictados por el Game Master</label>
						<input
							id="spaces-input"
							type="number"
							min={1}
							class="game-panel__number-input"
							value={game.gameMasterSpaces}
							onInput={handleSpacesChange}
							disabled={game.gameOver}
						/>
						<small class="game-panel__hint">Deja el campo vacío para usar el conteo automático.</small>
					</div>
				</div>
				<button type="submit" class="game-panel__submit-button" disabled={isSubmitDisabled}>
					{buttonLabel}
				</button>
			</form>
			{game.lastMove !== null && (
				<p class="game-panel__history">
					Último movimiento: el Game Master avanzó {game.lastMove} {game.lastMove === 1 ? 'espacio' : 'espacios'}.
				</p>
			)}
			<div class="game-panel__scoreboard" aria-live="polite">
				<div class="game-panel__scoreboard-header">
					<h3>Marcador en vivo</h3>
					<p>Los puntos se basan en la cantidad de palabras válidas.</p>
				</div>
				<ul>
					{game.players.map((player, index) => (
						<li key={player.id} class={index === game.currentPlayerIndex ? 'is-active' : undefined}>
							<span class="game-panel__player-name">{player.name}</span>
							<span class="game-panel__player-score">{player.score} pts</span>
							<span class="game-panel__player-turns">{player.turns} turnos</span>
						</li>
					))}
				</ul>
			</div>
			<button type="button" class="game-panel__reset-button" onClick={handleReset}>
				Reiniciar partida
			</button>
			{game.gameOver && (
				<div class="game-panel__leaderboard" role="dialog" aria-modal="true">
					<h3>Leaderboard final</h3>
					<ol>
						{game.leaderboard.map(player => (
							<li key={player.id}>
								<span class="game-panel__leaderboard-name">{player.name}</span>
								<span class="game-panel__leaderboard-score">{player.score} pts</span>
							</li>
						))}
					</ol>
				</div>
			)}
		</section>
	);
}
