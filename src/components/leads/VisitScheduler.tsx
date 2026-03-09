'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface VisitSchedulerProps {
  leadId: string;
  leadName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VisitScheduler({ leadId, leadName, onClose, onSuccess }: VisitSchedulerProps) {
  const [property, setProperty] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create the visit record
    const { error: visitError } = await supabase
      .from('visits')
      .insert([{ 
        lead_id: leadId, 
        property_name: property, 
        visit_date: date, 
        outcome: 'Pending' 
      }]);

    if (!visitError) {
      // 2. Automatically move lead to 'Visit Scheduled' stage
      await supabase
        .from('leads')
        .update({ status: 'Visit Scheduled' })
        .eq('id', leadId);
      
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Schedule Visit for {leadName}</h2>
        <form onSubmit={handleSchedule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Name/Area</label>
            <input 
              required
              type="text" 
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="e.g. Koramangala PG - Room 302"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Visit Date & Time</label>
            <input 
              required
              type="datetime-local" 
              className="mt-1 block w-full border rounded-md p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Confirm Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
