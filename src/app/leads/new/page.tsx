'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isMock } from '@/lib/supabase';
import { mockAgents } from '@/lib/mockData';
import { LeadStatus } from '@/types';
import { 
  ArrowLeft, UserPlus, Phone, Mail, IndianRupee, 
  MapPin, Users, Calendar, Share2, UserCircle, 
  CheckCircle2, Shield, Wifi, Zap, Car, Dumbbell, 
  Utensils, Layout
} from 'lucide-react';

const LOCATIONS: string[] = ['Koramangala', 'HSR Layout', 'Indiranagar', 'BTM Layout', 'Whitefield', 'Electronic City', 'JP Nagar'];
const SOURCES = ['Website', 'Google', 'Referral', 'Walk-in', 'Tally', 'Calendly', 'Other'];
const PG_TYPES = ['Boys', 'Girls', 'Co-ed'];
const PRIORITIES = ['low', 'medium', 'high'];

const AMENITIES = [
  { id: 'Good Food', icon: Utensils },
  { id: 'Fully Furnished', icon: Layout },
  { id: 'Super Amenities', icon: Shield },
  { id: 'Parking', icon: Car },
  { id: 'WiFi', icon: Wifi },
  { id: 'AC', icon: Zap },
  { id: 'Laundry', icon: IndianRupee }, // Using Generic
  { id: 'Gym', icon: Dumbbell },
  { id: 'Power Backup', icon: Zap },
  { id: 'Security', icon: Shield },
];

export default function AddLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    type: 'Boys',
    location: '',
    members: 1,
    move_in_date: '',
    source: SOURCES[0],
    agent_id: '',
    priority: 'medium' as const,
    amenities: [] as string[],
  });

  useEffect(() => {
    const fetchAgents = async () => {
      if (isMock) {
        setAgents(mockAgents.map(a => ({ id: a.id, name: a.name })));
        return;
      }
      const { data } = await supabase.from('agents').select('id, name');
      if (data) setAgents(data);
    };
    fetchAgents();
  }, []);

  const handleToggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('API Error Response:', result);
        alert('Error creating lead: ' + (result.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Fetch Error:', error);
      alert('Error creating lead: ' + error.name + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-[1000px] mx-auto min-h-screen">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Add New Lead</h1>
        <p className="text-slate-500 font-medium mt-1">Capture a new PG accommodation lead</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name *</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    placeholder=""
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email</label>
                <input 
                  type="email" 
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">PG Type</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  {PG_TYPES.map(t => <option key={t} value={t}>{t} PG</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Members</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  value={formData.members}
                  onChange={(e) => setFormData({...formData, members: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Source</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                >
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Priority</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone *</label>
                <input 
                  required
                  type="text" 
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Budget</label>
                <input 
                  type="text" 
                  placeholder=""
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                >
                  <option value="">Select Location</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Move-in Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  value={formData.move_in_date}
                  onChange={(e) => setFormData({...formData, move_in_date: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Assign to Agent</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  value={formData.agent_id}
                  onChange={(e) => setFormData({...formData, agent_id: e.target.value})}
                >
                  <option value="">Select Agent</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4 pt-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Amenities</label>
            <div className="flex flex-wrap gap-4">
              {AMENITIES.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' 
                        : 'bg-white text-slate-600 border-slate-100 hover:border-amber-400'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-xs font-bold">{amenity.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-10 bg-slate-50 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-5 bg-amber-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <UserPlus size={24} />
            {loading ? 'Adding Lead...' : 'Add Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
