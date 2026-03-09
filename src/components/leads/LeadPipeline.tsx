'use client';

import React, { useState } from 'react';
import { Lead, LeadStatus } from '@/types';
import VisitScheduler from '@/components/leads/VisitScheduler';

const STAGE_COLORS: Record<string, string> = {
  'New Lead': '#3b82f6',
  'Contacted': '#f59e0b',
  'Visit Scheduled': '#f59e0b',
  'Visited': '#0f172a',
  'Negotiation': '#f59e0b',
  'Won': '#10b981',
  'Lost': '#ef4444'
};

const STAGES: LeadStatus[] = [
  'New Lead', 'Contacted', 'Visit Scheduled', 'Visited', 'Negotiation', 'Won', 'Lost'
];

interface PipelineProps {
  leads: Lead[];
  onMoveLead: (leadId: string, newStatus: LeadStatus) => void;
}

export default function LeadPipeline({ leads, onMoveLead }: PipelineProps) {
  const [selectedLeadForVisit, setSelectedLeadForVisit] = useState<Lead | null>(null);

  const getAgentInitials = (lead: Lead) => {
    if (lead.agents?.name) {
      return lead.agents.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return '?';
  };

  const isOverdue = (updatedAt: string, status: LeadStatus) => {
    if (status === 'Won' || status === 'Lost') return false;
    const lastUpdate = new Date(updatedAt).getTime();
    const now = new Date().getTime();
    return (now - lastUpdate) > 24 * 60 * 60 * 1000;
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-8 h-[calc(100vh-250px)] scrollbar-hide">
      {STAGES.map((stage) => (
        <div key={stage} className="flex-shrink-0 w-[300px] bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col p-3">
          {/* Column Header */}
          <div className="px-2 py-3 flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: STAGE_COLORS[stage] || '#cbd5e1' }}
              />
              <span className="font-bold text-slate-800 text-sm">{stage.replace('Lead', '')}</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full shadow-sm">
              {leads.filter(l => l.status === stage).length}
            </span>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-1 flex-1 scrollbar-hide">
            {leads
              .filter((lead) => lead.status === stage)
              .map((lead) => {
                const overdue = isOverdue(lead.updated_at, lead.status);
                return (
                  <div key={lead.id} className={`bg-white p-4 rounded-xl border ${overdue ? 'border-red-200 shadow-red-50' : 'border-slate-100'} shadow-sm transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] group relative overflow-hidden`}>
                    {overdue && (
                      <div className="mb-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Follow-up Overdue</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-black text-slate-900 text-[15px] leading-tight group-hover:text-primary transition-colors">
                        {lead.name}
                      </p>
                    </div>
                    
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-3 uppercase tracking-tighter">
                      {lead.location || 'Unknown'} · <span className="text-slate-500">₹{lead.budget || '12,000'}/mo</span>
                    </p>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex flex-wrap gap-1.5">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black transition-colors ${
                          lead.type === 'Boys' ? 'text-blue-500' : lead.type === 'Girls' ? 'text-pink-500' : 'text-purple-500'
                        }`}>
                          {lead.type === 'Boys' ? '♂' : lead.type === 'Girls' ? '♀' : '⚦'} {lead.type || 'Boys'}
                        </div>
                      </div>

                      <div className="flex items-center justify-center w-7 h-7 bg-slate-900 rounded-full text-[9px] font-black text-white shadow-lg shadow-black/20 shrink-0" title={lead.agents?.name}>
                        {getAgentInitials(lead)}
                      </div>
                    </div>

                    {/* Move dropdown hidden by default, visible on hover for functionality */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <select 
                        className="text-[10px] bg-white border border-slate-200 rounded-full px-1 py-0.5 text-slate-400 font-bold outline-none"
                        onChange={(e) => onMoveLead(lead.id, e.target.value as LeadStatus)}
                        value={stage}
                      >
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {selectedLeadForVisit && (
        <VisitScheduler 
          leadId={selectedLeadForVisit.id}
          leadName={selectedLeadForVisit.name}
          onClose={() => setSelectedLeadForVisit(null)}
          onSuccess={() => {
            setSelectedLeadForVisit(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}