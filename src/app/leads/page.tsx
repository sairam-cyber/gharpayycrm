'use client';

import React, { useEffect, useState } from 'react';
import { supabase, isMock } from '@/lib/supabase';
import { mockLeads } from '@/lib/mockData';
import { Lead } from '@/types';
import { Search, Filter, ChevronDown, MoreHorizontal, User } from 'lucide-react';

const STAGES = [
  'All Stages', 'New', 'Contacted', 'Requirement Collected', 
  'Property Suggested', 'Visit Scheduled', 'Visited', 'Negotiation', 'Won', 'Lost'
];

const SOURCES = ['All Sources', 'Tally', 'Google', 'Calendly', 'Walk-in', 'Referral', 'Website', 'Unknown'];
const LOCATIONS = ['All Locations', 'Koramangala', 'HSR Layout', 'Indiranagar', 'BTM Layout', 'Whitefield', 'Electronic City', 'JP Nagar'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [selectedSource, setSelectedSource] = useState('All Sources');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    if (isMock) {
      setLeads(mockLeads);
      return;
    }
    const { data } = await supabase
      .from('leads')
      .select('*, agents(name)')
      .order('created_at', { ascending: false });
    if (data) setLeads(data as (Lead & { agents: { name: string } | null })[]);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.phone.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStage = selectedStage === 'All Stages' || lead.status.includes(selectedStage);
    const matchesSource = selectedSource === 'All Sources' || lead.source === selectedSource;

    return matchesSearch && matchesStage && matchesSource;
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'low': return 'bg-slate-50 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'Boys': return 'bg-blue-50 text-blue-600';
      case 'Girls': return 'bg-pink-50 text-pink-600';
      case 'Co-ed': return 'bg-purple-50 text-purple-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="p-10 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leads</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          {filteredLeads.length} of {leads.length} leads
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone, email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <div className="relative min-w-[160px]">
            <select 
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative min-w-[160px]">
            <select 
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Stage</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{lead.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-500 tracking-tight">{lead.phone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${getTypeColor(lead.type)}`}>
                      {lead.type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{lead.location || '—'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{lead.source}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-lg border ${getPriorityColor(lead.priority)}`}>
                      {lead.priority || 'low'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0">
                        {lead.agents?.name ? lead.agents.name.split(' ').map(n => n[0]).join('').toUpperCase() : '—'}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{lead.agents?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-slate-400 font-medium">
                    No leads found matching your criteria.
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
