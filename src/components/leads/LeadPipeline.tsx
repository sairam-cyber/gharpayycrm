'use client';

import React, { useState } from 'react';
import { Lead, LeadStatus } from '@/types';
import VisitScheduler from '@/components/leads/VisitScheduler';

const STAGES: LeadStatus[] = [
  'New Lead', 'Contacted', 'Requirement Collected', 
  'Property Suggested', 'Visit Scheduled', 'Booked', 'Lost'
];

const isStale = (updatedAt: string) => {
  const lastUpdate = new Date(updatedAt).getTime();
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
  return lastUpdate < twentyFourHoursAgo;
};

interface PipelineProps {
  leads: Lead[];
  onMoveLead: (leadId: string, newStatus: LeadStatus) => void;
}

export default function LeadPipeline({ leads, onMoveLead }: PipelineProps) {
  const [selectedLeadForVisit, setSelectedLeadForVisit] = useState<Lead | null>(null);

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
      {STAGES.map((stage) => (
        <div key={stage} className="flex-shrink-0 w-80 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="font-bold text-gray-700 mb-4 flex justify-between">
            {stage}
            <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
              {leads.filter(l => l.status === stage).length}
            </span>
          </h3>
          
          <div className="space-y-3">
            {leads
              .filter((lead) => lead.status === stage)
              .map((lead) => (
                <div key={lead.id} className={`p-4 rounded-md shadow-sm border bg-white transition-all ${
                  isStale(lead.updated_at) ? 'border-red-500 bg-red-50/30' : 'border-gray-100 hover:border-blue-400'
                }`}>
                  {isStale(lead.updated_at) && (
                    <span className="text-[10px] font-bold text-red-600 uppercase flex items-center mb-2">
                      ⚠️ High Priority: No Activity &gt; 24h
                    </span>
                  )}
                  <p className="font-semibold text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                  <p className="text-xs mt-2 inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    {lead.source}
                  </p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <select 
                      className="text-xs border rounded p-1 text-gray-600"
                      onChange={(e) => onMoveLead(lead.id, e.target.value as LeadStatus)}
                      value={stage}
                    >
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    
                    <button 
                      onClick={() => setSelectedLeadForVisit(lead)}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Schedule Visit
                    </button>
                  </div>
                </div>
              ))}
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