'use client';

import { useEffect, useState } from 'react';
import { supabase, isMock } from '@/lib/supabase';
import { mockLeads } from '@/lib/mockData';
import { Lead, LeadStatus } from '@/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, UserPlus, Calendar, TrendingUp } from 'lucide-react';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#0f172a'];

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    if (isMock) {
      setLeads([...mockLeads]);
      return;
    }
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data);
  };

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    fetchLeads();
  };

  const getStats = () => {
    const total = leads.length;
    const newToday = leads.filter(l => {
      const today = new Date().toDateString();
      return new Date(l.created_at).toDateString() === today;
    }).length;
    const scheduled = leads.filter(l => l.status === 'Visit Scheduled').length;
    const conversionRate = total > 0 ? Math.round((leads.filter(l => l.status === 'Won').length / total) * 100) : 0;
    
    return { total, newToday, scheduled, conversionRate };
  };

  const stats = getStats();

  // Data for Charts
  const pipelineData = [
    { name: 'New', count: leads.filter(l => l.status === 'New Lead').length },
    { name: 'Contacted', count: leads.filter(l => l.status === 'Contacted').length },
    { name: 'Visited', count: leads.filter(l => l.status === 'Visit Scheduled').length },
    { name: 'Won', count: leads.filter(l => l.status === 'Won').length },
    { name: 'Lost', count: leads.filter(l => l.status === 'Lost').length },
  ];

  const sourceData = [
    { name: 'Website', value: leads.filter(l => l.source === 'Website').length },
    { name: 'Google', value: leads.filter(l => l.source === 'Google').length },
    { name: 'Referral', value: leads.filter(l => l.source === 'Referral').length },
    { name: 'Other', value: leads.filter(l => !['Website', 'Google', 'Referral'].includes(l.source)).length },
  ].filter(d => d.value > 0);

  const getAgentWorkload = () => {
    const counts = leads.reduce((acc, l) => {
      acc[l.agent_id] = (acc[l.agent_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([agent_id, count]) => ({ agent_id, count }));
  };

  const agentWorkload = getAgentWorkload();

  return (
    <div className="p-10 max-w-[1400px] mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 font-medium">Welcome back. Here's your sales overview.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="stat-card">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Leads</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{stats.total}</p>
          <p className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +{stats.newToday} today
          </p>
        </div>

        <div className="bg-amber-500 p-6 rounded-2xl shadow-lg shadow-amber-500/20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
            <UserPlus size={80} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">New Today</p>
          <p className="text-5xl font-black mt-2">{stats.newToday}</p>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Visits Scheduled</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{stats.scheduled}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 text-white rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conversion Rate</p>
          <p className="text-3xl font-black mt-1">{stats.conversionRate}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="stat-card h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Leads by Pipeline Stage</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Leads by Source</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {sourceData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Workload */}
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-slate-400" size={18} />
          <h3 className="font-bold text-slate-800">Agent Workload</h3>
        </div>
        {agentWorkload.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentWorkload.map((item) => (
              <div key={item.agent_id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Leads Assigned</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{item.count}</p>
                <p className="text-[10px] font-medium text-slate-500 mt-1">Agent ID: {item.agent_id.split('-')[0]}...</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden bg-slate-50 rounded-xl border border-slate-100 italic text-slate-400 text-sm p-12 text-center">
            Agent performance data will appear here once assignments are active.
          </div>
        )}
      </div>
    </div>
  );
}