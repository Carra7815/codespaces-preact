import './GameBoard.css';

import { Pie } from '../../components/Pie.jsx';
import { PieSlice } from '../../components/PieSlice.jsx';

export function GameBoard({ questions, colors, activeIndex, onSliceSelect }) {
	return (
		<div class="game-board">
			<Pie size={520} innerRadius={150} holeColor="#f8fafc" activeIndex={activeIndex} onSliceSelect={onSliceSelect}>
				{questions.map((prompt, index) => (
					<PieSlice key={index} color={colors[index % colors.length]} label={`${index + 1}`}>
						{prompt}
					</PieSlice>
				))}
			</Pie>
		</div>
	);
}
