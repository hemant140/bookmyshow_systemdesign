
import React from 'react';
import { SCHEMAS } from '../constants';

const SchemaPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SCHEMAS.map((table) => (
        <div key={table.name} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-slate-700 px-4 py-2 border-b border-slate-600">
            <h3 className="font-bold text-blue-400 text-sm mono uppercase tracking-wider">{table.name}</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/50 text-slate-500 uppercase">
                <th className="px-4 py-2 font-semibold">Column</th>
                <th className="px-4 py-2 font-semibold">Type</th>
                <th className="px-4 py-2 font-semibold">Constraints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {table.columns.map((col, idx) => (
                <tr key={idx} className="hover:bg-slate-700/30">
                  <td className="px-4 py-2 font-medium text-slate-300 mono">{col.name}</td>
                  <td className="px-4 py-2 text-slate-500">{col.type}</td>
                  <td className="px-4 py-2 text-orange-400/80 italic">{col.constraints || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default SchemaPanel;
