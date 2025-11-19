import './GameBoard.css';

import { Pie } from '../../components/Pie.jsx';
import { PieSlice } from '../../components/PieSlice.jsx';

export function GameBoard({ spaces = [], colors, activeIndex, onSliceSelect }) {
	return (
		<div class="game-board">
			<Pie size={520} innerRadius={150} holeColor="#f8fafc" activeIndex={activeIndex} onSliceSelect={onSliceSelect}>
				{spaces.map((space, index) => {
					const prompt = space?.prompt ?? '';
					return (
					<PieSlice
						key={space.id ?? index}
						color={colors[index % colors.length]}
						label={space.used ? '' : `${index + 1}`}
						used={space.used}
					>
						{prompt}
					</PieSlice>
					);
				})}
			</Pie>
		</div>
	);
}
