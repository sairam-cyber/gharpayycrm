'use client';

import React, { useEffect, useState } from 'react';
import { supabase, isMock } from '@/lib/supabase';
import { mockVisits } from '@/lib/mockData';
import { Visit, VisitStatus } from '@/types';
import { CheckCircle2, XCircle, Clock, MapPin, Home } from 'lucide-react';

export default function VisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    if (isMock) {
      setVisits([...mockVisits]);
      setLoading(false);
      return;
    }
    // Fetch visits with lead details and agent (joining)
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        leads (
          name,
          location,
          agent_id
        )
      `)
      .order('visit_date', { ascending: true });

    if (data) setVisits(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (visitId: string, leadId: string, outcome: VisitStatus) => {
    if (isMock) {
      const visit = mockVisits.find(v => v.id === visitId);
      if (visit) visit.outcome = outcome;
      fetchVisits();
      return;
    }
    // 1. Update visit outcome
    const { error } = await supabase
      .from('visits')
      .update({ outcome })
      .eq('id', visitId);

    if (!error) {
      // 2. If completed, move lead to 'Visited' stage
      if (outcome === 'Completed') {
        await supabase
          .from('leads')
          .update({ status: 'Visited' })
          .eq('id', leadId);
      }
      fetchVisits();
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' · ' + d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'No Show': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Scheduled': 
      case 'Pending': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const upcomingCount = visits.filter(v => v.outcome === 'Pending' || v.outcome === 'Scheduled').length;

  return (
    <div className="p-10 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Visits</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          {upcomingCount} upcoming visits
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Lead</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">PG</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400 animate-pulse font-bold">
                    Loading your schedule...
                  </td>
                </tr>
              ) : visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-bold text-slate-900">{visit.leads?.name || 'Deleted Lead'}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                      <Home size={14} className="text-slate-400" />
                      {visit.property_name}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">
                   {visit.leads?.location || '—'}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-700">
                      {visit.leads?.agent_id === '1' ? 'Rahul Sharma' : 
                       visit.leads?.agent_id === '2' ? 'Priya Nair' : 
                       visit.leads?.agent_id === '3' ? 'Amit Patel' : 'Sneha Reddy'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                      {formatDate(visit.visit_date)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusStyle(visit.outcome || 'Scheduled')}`}>
                      {visit.outcome === 'Pending' ? 'Scheduled' : visit.outcome}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {(visit.outcome === 'Pending' || visit.outcome === 'Scheduled') ? (
                      <div className="flex items-center justify-center gap-4">
                        <button 
                          onClick={() => handleUpdateStatus(visit.id, visit.lead_id, 'Completed')}
                          className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                        >
                          Complete
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(visit.id, visit.lead_id, 'No Show')}
                          className="text-[10px] font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest"
                        >
                          No Show
                        </button>
                      </div>
                    ) : (
                      <div className="w-full text-center">—</div>
                    )}
                  </td>
                </tr>
              ))}
              {visits.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-medium">
                    No visits scheduled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
