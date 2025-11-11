import { toChildArray } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import './Pie.css';
import { PieSlice } from './PieSlice.jsx';

const DEFAULT_COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4'];

const OFFSET_ANGLE = -90;

const toCartesian = (cx, cy, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy + radius * Math.sin(angleInRadians),
    };
};

const clampInnerRadius = (innerRadius, outerRadius) => {
    if (innerRadius <= 0) return 0;
    const maxInner = outerRadius - 2;
    return innerRadius > maxInner ? maxInner : innerRadius;
};

/**
 * @param {any} child
 * @returns {child is import('preact').VNode<Record<string, any>>}
 */
const isSliceElement = child => typeof child === 'object' && child !== null && child.type === PieSlice;

const buildArcPath = (cx, cy, outerRadius, innerRadius, startAngle, endAngle) => {
    const outerStart = toCartesian(cx, cy, outerRadius, startAngle);
    const outerEnd = toCartesian(cx, cy, outerRadius, endAngle);
    const sweep = endAngle - startAngle;
    const largeArc = sweep > 180 ? 1 : 0;

    if (innerRadius <= 0) {
        return [
            `M ${cx} ${cy}`,
            `L ${outerStart.x} ${outerStart.y}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
            'Z',
        ].join(' ');
    }

    const innerEnd = toCartesian(cx, cy, innerRadius, endAngle);
    const innerStart = toCartesian(cx, cy, innerRadius, startAngle);

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
        'Z',
    ].join(' ');
};

export function Pie({ children, size = 200, innerRadius = 0, holeColor = '#fff', activeIndex = null, onSliceSelect }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const outerRadius = size / 2;
    const innerRadiusPx = clampInnerRadius(innerRadius, outerRadius);
    const center = { x: outerRadius, y: outerRadius };

    const slices = useMemo(() => toChildArray(children).filter(isSliceElement), [children]);

    const totalValue = useMemo(() => {
        const sum = slices.reduce((acc, slice) => {
            const value = typeof slice.props?.value === 'number' && slice.props.value > 0 ? slice.props.value : 1;
            return acc + value;
        }, 0);
        return sum > 0 ? sum : 1;
    }, [slices]);

    const segments = useMemo(() => {
        if (!slices.length) {
            const startAngle = OFFSET_ANGLE;
            const endAngle = OFFSET_ANGLE + 360;
            return [
                {
                    color: DEFAULT_COLORS[0],
                    label: 'Slice',
                    value: 1,
                    path: buildArcPath(center.x, center.y, outerRadius, innerRadiusPx, startAngle, endAngle),
                    midAngle: (startAngle + endAngle) / 2,
                    textContent: null,
                },
            ];
        }

        let currentAngle = OFFSET_ANGLE;
        return slices.map((slice, index) => {
            const value = typeof slice.props?.value === 'number' && slice.props.value > 0 ? slice.props.value : 1;
            const angle = (value / totalValue) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;
            const path = buildArcPath(center.x, center.y, outerRadius, innerRadiusPx, startAngle, endAngle);
            const midAngle = startAngle + angle / 2;
            const labelRadius = innerRadiusPx > 0 ? innerRadiusPx + (outerRadius - innerRadiusPx) * 0.55 : outerRadius * 0.6;
            const labelPoint = toCartesian(center.x, center.y, labelRadius, midAngle);
            return {
                color: slice.props?.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                label: slice.props?.label || `Slice ${index + 1}`,
                value,
                path,
                midAngle,
                labelX: labelPoint.x,
                labelY: labelPoint.y,
                textContent: slice.props?.detail ?? slice.props?.children ?? null,
            };
        });
    }, [center.x, center.y, innerRadiusPx, outerRadius, slices, totalValue]);

    useEffect(() => {
        if (selectedIndex !== null && selectedIndex >= segments.length) {
            setSelectedIndex(null);
        }
    }, [segments.length, selectedIndex]);

    const normalizedActiveIndex = useMemo(() => {
        if (typeof activeIndex !== 'number' || !segments.length) return null;
        const normalized = ((activeIndex % segments.length) + segments.length) % segments.length;
        return normalized;
    }, [activeIndex, segments.length]);

    const selectedSegment = selectedIndex !== null && segments[selectedIndex] ? segments[selectedIndex] : null;

    const handleSelect = index => {
        setSelectedIndex(prev => (prev === index ? null : index));
        if (typeof onSliceSelect === 'function') {
            onSliceSelect(index);
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleSelect(index);
        }
    };

    return (
        <div className="pie" style={{ width: `${size}px`, height: `${size}px` }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Interactive pie chart">
                <title>Interactive pie chart</title>
                {segments.map((segment, index) => {
                    const isSelected = selectedIndex === index;
                    const isActive = normalizedActiveIndex === index;
                    return (
                        <g
                            key={index}
                            className="pie-slice"
                            tabIndex={0}
                            role="button"
                            aria-pressed={isSelected}
                            data-selected={isSelected}
                            data-active={isActive}
                            aria-label={`${segment.label}: ${segment.value}`}
                            onClick={() => handleSelect(index)}
                            onKeyDown={event => handleKeyDown(event, index)}
                        >
                            <path d={segment.path} fill={segment.color} />
                            {textLabelVisible(segment.label) && (
                                <text x={segment.labelX} y={segment.labelY} className="pie-label" textAnchor="middle" dominantBaseline="middle">
                                    {segment.label}
                                </text>
                            )}
                        </g>
                    );
                })}
                {innerRadiusPx > 0 && (
                    <circle cx={center.x} cy={center.y} r={innerRadiusPx} fill={holeColor} pointerEvents="none" />
                )}
            </svg>
            {selectedSegment && (
                <div className="pie-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedIndex(null)}>
                    <div className="pie-overlay__panel" onClick={event => event.stopPropagation()}>
                        <button type="button" className="pie-overlay__close" onClick={() => setSelectedIndex(null)} aria-label="Close">
                            ×
                        </button>
                        <h2 className="pie-overlay__label">{selectedSegment.label}</h2>
                        {selectedSegment.textContent && (
                            <div className="pie-overlay__detail">{selectedSegment.textContent}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

Pie.Slice = PieSlice;

const textLabelVisible = label => typeof label === 'string' && label.trim().length > 0;