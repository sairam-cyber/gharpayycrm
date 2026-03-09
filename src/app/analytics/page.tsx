'use client';

import React, { useEffect, useState } from 'react';
import { supabase, isMock } from '@/lib/supabase';
import { mockLeads } from '@/lib/mockData';
import { Lead } from '@/types';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, MapPin, PieChart as PieIcon, Users } from 'lucide-react';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    if (isMock) {
      setLeads([...mockLeads]);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: true });
    if (data) setLeads(data);
    setLoading(false);
  };

  // Data Aggregation: Leads This Week
  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const counts = last7Days.reduce((acc, day) => ({ ...acc, [day]: 0 }), {} as Record<string, number>);

    leads.forEach(l => {
      const day = new Date(l.created_at).toLocaleDateString('en-US', { weekday: 'short' });
      if (counts[day] !== undefined) counts[day]++;
    });

    return last7Days.map(day => ({ name: day, count: counts[day] }));
  };

  // Data Aggregation: Demand by Location
  const getLocationData = () => {
    const counts = leads.reduce((acc, l) => {
      const loc = l.location || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  // Data Aggregation: PG Type Distribution
  const getTypeData = () => {
    const counts = leads.reduce((acc, l) => {
      const type = l.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Boys PG', value: counts['Boys'] || 0 },
      { name: 'Girls PG', value: counts['Girls'] || 0 },
      { name: 'Co-ed', value: counts['Co-ed'] || 0 },
    ];
  };

  // Data Aggregation: Agent Performance
  const getAgentData = () => {
    const agents: Record<string, { name: string, total: number, won: number }> = {};

    leads.forEach(l => {
      const agentId = l.agent_id || 'unassigned';
      if (!agents[agentId]) {
        agents[agentId] = { name: `Agent ${agentId.split('-')[0]}`, total: 0, won: 0 };
      }
      agents[agentId].total++;
      if (l.status === 'Won') agents[agentId].won++;
    });

    return Object.values(agents);
  };

  if (loading) return (
    <div className="p-20 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest">
      Analyzing data...
    </div>
  );

  return (
    <div className="p-10 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Detailed breakdown of your sales performance</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Leads This Week */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp size={18} className="text-amber-500" />
            <h3 className="font-bold text-slate-800">Leads This Week</h3>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getWeeklyData()}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand by Location */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center gap-2 mb-8">
            <MapPin size={18} className="text-slate-900" />
            <h3 className="font-bold text-slate-800">Demand by Location</h3>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getLocationData()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} width={100} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PG Type Distribution */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center gap-2 mb-8">
            <PieIcon size={18} className="text-blue-500" />
            <h3 className="font-bold text-slate-800">PG Type Distribution</h3>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getTypeData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${value}`}
                >
                  {getTypeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center gap-2 mb-8">
            <Users size={18} className="text-emerald-500" />
            <h3 className="font-bold text-slate-800">Agent Performance</h3>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getAgentData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                   labelFormatter={() => ''}
                />
                <Legend verticalAlign="bottom" height={36}/>
                <Bar dataKey="total" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Total Leads" barSize={32} />
                <Bar dataKey="won" fill="#10b981" radius={[4, 4, 0, 0]} name="Won" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
