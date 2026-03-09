import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getNextAgent } from '@/lib/assignment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, source } = body;

    // 1. Validation
    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
    }

    // 2. Get the next agent via Round Robin
    const assignedAgentId = await getNextAgent();

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([
        { 
          name, 
          phone, 
          source: source || 'Unknown', 
          agent_id: assignedAgentId,
          status: 'New Lead' 
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ message: 'Lead captured successfully', lead: data[0] }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}