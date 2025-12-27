import React, { useEffect, useRef } from 'react';
import { SystemLogEntry } from '../types';
import { Activity, Database, Brain, Server, Shield } from 'lucide-react';

interface SystemLogProps {
  logs: SystemLogEntry[];
}

export const SystemLog: React.FC<SystemLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (layer: string) => {
    switch (layer) {
      case 'CLIENT': return <Activity size={16} className="text-blue-500" />;
      case 'API': return <Server size={16} className="text-purple-500" />;
      case 'DOMAIN': return <Brain size={16} className="text-pink-500" />;
      case 'DATA': return <Database size={16} className="text-emerald-500" />;
      default: return <Shield size={16} />;
    }
  };

  const getColor = (status?: string) => {
    switch (status) {
      case 'success': return 'border-l-green-500 bg-green-50/50';
      case 'error': return 'border-l-red-500 bg-red-50/50';
      default: return 'border-l-slate-300 bg-white';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 w-full max-w-md shadow-xl z-50">
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Activity size={18} />
          System Internals
        </h3>
        <span className="text-xs text-slate-400 font-mono">LIVE TRACE</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
        {logs.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-10">
            Waiting for interactions...
            <br />
            <span className="text-xs">Try joining a group.</span>
          </div>
        )}
        
        {logs.map((log) => (
          <div key={log.id} className={`relative pl-4 py-3 pr-3 border-l-2 rounded-r-md text-sm shadow-sm animate-in fade-in slide-in-from-right-4 duration-300 ${getColor(log.status)}`}>
            <div className="flex items-center gap-2 mb-1">
              {getIcon(log.layer)}
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">{log.layer} LAYER</span>
              <span className="ml-auto text-xs text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}</span>
            </div>
            <div className="font-medium text-slate-800">{log.action}</div>
            {log.details && (
              <pre className="mt-2 text-xs font-mono bg-slate-100 p-2 rounded text-slate-600 overflow-x-auto">
                {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
              </pre>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-slate-200 bg-white text-xs text-slate-500 flex justify-between">
        <div className="flex gap-4">
            <span className="flex items-center gap-1"><Server size={12} className="text-purple-500"/> API</span>
            <span className="flex items-center gap-1"><Brain size={12} className="text-pink-500"/> Domain</span>
            <span className="flex items-center gap-1"><Database size={12} className="text-emerald-500"/> Data</span>
        </div>
      </div>
    </div>
  );
};
