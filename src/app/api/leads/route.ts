import { NextResponse } from 'next/server';
import { supabase, isMock } from '@/lib/supabase';
import { getNextAgent } from '@/lib/assignment';
import { addMockLead } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    console.log("POST /api/leads request received");
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body));
    const { 
      name, phone, email, budget, source, location, 
      priority, type, members, move_in_date, amenities 
    } = body;

    // 1. Validation
    if (!name || !phone) {
      console.log("Validation failed: Name and Phone are required");
      return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
    }

    // 2. Get the next agent via Round Robin
    console.log("Fetching next agent...");
    const assignedAgentId = await getNextAgent();
    console.log("Assigned Agent ID:", assignedAgentId);

    if (!assignedAgentId) {
      console.error("Assignment failed: No agent available");
      return NextResponse.json({ error: 'No agents available for assignment. Please add an agent to the database first.' }, { status: 500 });
    }

    // 3. Insert into Supabase (or Mock)
    if (isMock) {
      console.log("Inserting lead into MOCK store...");
      const mockLead = addMockLead({
        name, phone, email, budget, source, location,
        priority, type, members: parseInt(members as any) || 1,
        move_in_date, amenities, agent_id: assignedAgentId,
        status: 'New Lead'
      });
      return NextResponse.json({ message: 'Lead captured successfully (MOCK)', lead: mockLead }, { status: 201 });
    }

    console.log("Inserting lead into Supabase...");
    const { data, error } = await supabase
      .from('leads')
      .insert([
        { 
          name, 
          phone, 
          email,
          budget,
          source: source || 'Unknown', 
          location,
          priority: priority || 'medium',
          type,
          members: parseInt(members as any) || 1,
          move_in_date: move_in_date || null,
          amenities: amenities || [],
          agent_id: assignedAgentId,
          status: 'New Lead' 
        }
      ])
      .select();

    if (error) {
      console.error("Supabase insert error details:", JSON.stringify(error, null, 2));
      throw error;
    }

    console.log("Lead captured successfully:", JSON.stringify(data?.[0]));
    return NextResponse.json({ message: 'Lead captured successfully', lead: data?.[0] }, { status: 201 });

  } catch (error: any) {
    console.error("Server-side API Route Error:", error);
    return NextResponse.json({ 
      error: error.message || "Unknown server error",
      details: error.details || error.hint || null
    }, { status: 500 });
  }
}