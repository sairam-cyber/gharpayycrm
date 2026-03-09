'use client';

import React, { useEffect, useState } from 'react';
import { supabase, isMock } from '@/lib/supabase';
import { mockLeads } from '@/lib/mockData';
import { Lead, LeadStatus } from '@/types';
import LeadPipeline from '@/components/leads/LeadPipeline';

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    if (isMock) {
      setLeads([...mockLeads]);
      return;
    }
    const { data } = await supabase
      .from('leads')
      .select('*, agents(name)')
      .order('created_at', { ascending: false });
    if (data) setLeads(data as (Lead & { agents: { name: string } | null })[]);
  };

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    if (isMock) {
      const lead = mockLeads.find(l => l.id === id);
      if (lead) {
        lead.status = status;
        lead.updated_at = new Date().toISOString();
      }
      setLeads([...mockLeads]);
      return;
    }
    // 1. Update Lead Status
    const { error: leadError } = await supabase.from('leads').update({ status }).eq('id', id);
    if (leadError) {
      alert('Error updating lead status: ' + leadError.message);
      return;
    }

    // 2. Sync with Visits table for specific statuses
    if (status === 'Visit Scheduled' || status === 'Visited') {
      // Check if a visit record already exists for this lead
      const { data: existingVisits } = await supabase
        .from('visits')
        .select('id')
        .eq('lead_id', id)
        .limit(1);

      if (existingVisits && existingVisits.length > 0) {
        // Update existing visit
        await supabase
          .from('visits')
          .update({ 
            outcome: status === 'Visited' ? 'Completed' : 'Pending' 
          })
          .eq('id', existingVisits[0].id);
      } else {
        // Create new visit record
        const { data: leadData } = await supabase.from('leads').select('name').eq('id', id).single();
        await supabase
          .from('visits')
          .insert([{
            lead_id: id,
            property_name: 'TBD', // Placeholder as we don't have this in Lead yet
            visit_date: new Date().toISOString(),
            outcome: status === 'Visited' ? 'Completed' : 'Pending'
          }]);
      }
    }

    fetchLeads();
  };

  return (
    <div className="p-10 max-w-[1600px] mx-auto min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Pipeline</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Drag leads between stages to update their status
        </p>
      </header>

      <LeadPipeline leads={leads} onMoveLead={handleUpdateStatus} />
    </div>
  );
}
