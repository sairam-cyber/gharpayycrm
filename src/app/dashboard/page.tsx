'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import LeadPipeline from '@/components/leads/LeadPipeline';
import { Lead, LeadStatus } from '@/types';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data);
  };

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    fetchLeads(); // Refresh data
  };

  const stats = {
    total: leads.length,
    scheduled: leads.filter(l => l.status === 'Visit Scheduled').length,
    booked: leads.filter(l => l.status === 'Booked').length,
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gharpayy Lead Management</h1>
        <p className="text-gray-500">Track and manage your property leads efficiently.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Leads</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-blue-500 font-medium">Visits Scheduled</p>
          <p className="text-3xl font-bold text-gray-900">{stats.scheduled}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-green-500 font-medium">Bookings Confirmed</p>
          <p className="text-3xl font-bold text-gray-900">{stats.booked}</p>
        </div>
      </div>

      <LeadPipeline leads={leads} onMoveLead={handleUpdateStatus} />
    </div>
  );
}