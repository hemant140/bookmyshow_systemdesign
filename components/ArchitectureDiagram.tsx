
import React, { useMemo } from 'react';
import { SYSTEM_NODES, SYSTEM_CONNECTIONS } from '../constants';
import { ServiceNode } from '../types';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const COLUMN_GAP = 250;
const ROW_GAP = 120;

const ArchitectureDiagram: React.FC = () => {
  // Simple layout logic for visual organization
  const layout = useMemo(() => {
    const positions: Record<string, { x: number, y: number }> = {
      'client': { x: 50, y: 250 },
      'lb': { x: 300, y: 250 },
      'gateway': { x: 550, y: 250 },
      'user_svc': { x: 800, y: 50 },
      'movie_svc': { x: 800, y: 150 },
      'booking_svc': { x: 800, y: 250 },
      'payment_svc': { x: 800, y: 350 },
      'notif_svc': { x: 800, y: 450 },
      'main_db': { x: 1050, y: 200 },
      'cache': { x: 1050, y: 300 },
      'search_db': { x: 1050, y: 100 },
    };
    return positions;
  }, []);

  const getNodeColor = (type: ServiceNode['type']) => {
    switch (type) {
      case 'service': return 'fill-blue-500/20 stroke-blue-500';
      case 'database': return 'fill-emerald-500/20 stroke-emerald-500';
      case 'gateway': return 'fill-orange-500/20 stroke-orange-500';
      case 'external': return 'fill-slate-500/20 stroke-slate-400';
      default: return 'fill-gray-500/20 stroke-gray-500';
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-slate-900 rounded-xl border border-slate-700 p-8">
      <svg width="1300" height="600" className="mx-auto">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-500" />
          </marker>
        </defs>

        {/* Draw Connections */}
        {SYSTEM_CONNECTIONS.map((conn, idx) => {
          const from = layout[conn.from];
          const to = layout[conn.to];
          if (!from || !to) return null;

          const startX = from.x + NODE_WIDTH;
          const startY = from.y + NODE_HEIGHT / 2;
          const endX = to.x;
          const endY = to.y + NODE_HEIGHT / 2;

          return (
            <g key={`conn-${idx}`}>
              <path
                d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
                className="stroke-slate-600 fill-none stroke-2"
                markerEnd="url(#arrowhead)"
              />
              <text
                x={(startX + endX) / 2}
                y={((startY + endY) / 2) - 10}
                className="fill-slate-400 text-[10px] font-medium"
                textAnchor="middle"
              >
                {conn.label}
              </text>
            </g>
          );
        })}

        {/* Draw Nodes */}
        {SYSTEM_NODES.map((node) => {
          const pos = layout[node.id];
          if (!pos) return null;

          return (
            <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
              <rect
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx="8"
                className={`${getNodeColor(node.type)} stroke-2 transition-all hover:brightness-125`}
              />
              <text
                x={NODE_WIDTH / 2}
                y={35}
                className="fill-white font-bold text-sm"
                textAnchor="middle"
              >
                {node.name}
              </text>
              <text
                x={NODE_WIDTH / 2}
                y={55}
                className="fill-slate-400 text-[10px]"
                textAnchor="middle"
              >
                {node.type.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ArchitectureDiagram;
