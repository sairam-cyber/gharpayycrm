import { Lead, Agent } from '@/types';

// In-memory mock storage
// Note: This will reset on server restart, but it's better than failing.
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '9876543210',
    email: 'john@example.com',
    budget: '15000',
    location: 'Koramangala',
    status: 'New Lead',
    priority: 'high',
    type: 'Boys',
    source: 'Website',
    members: 1,
    move_in_date: '2026-04-01',
    amenities: ['Good Food', 'WiFi'],
    agent_id: 'agent-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agents: { name: 'Rahul Sharma' }
  }
];

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Rahul Sharma',
    email: 'rahul@gharpay.co',
    phone: '9000000001',
    status: 'active',
    last_assigned_at: new Date().toISOString()
  },
  {
    id: 'agent-2',
    name: 'Priya Nair',
    email: 'priya@gharpay.co',
    phone: '9000000002',
    status: 'active',
    last_assigned_at: new Date().toISOString()
  }
];

export const mockVisits: any[] = [
  {
    id: 'v-1',
    lead_id: '1',
    property_name: 'Luxury Studio - Koramangala',
    visit_date: new Date(Date.now() + 86400000).toISOString(),
    outcome: 'Pending',
    leads: {
      name: 'John Doe',
      location: 'Koramangala',
      agent_id: 'agent-1'
    }
  }
];

export function addMockLead(lead: Partial<Lead>) {
  const newLead = {
    ...lead,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Lead;
  
  // Attach agent info for join simulation
  const agent = mockAgents.find(a => a.id === lead.agent_id);
  if (agent) {
    newLead.agents = { name: agent.name };
  }
  
  mockLeads.unshift(newLead);
  return newLead;
}

export function getNextMockAgent() {
  const sorted = [...mockAgents].sort((a, b) => 
    new Date(a.last_assigned_at || 0).getTime() - new Date(b.last_assigned_at || 0).getTime()
  );
  const agent = sorted[0];
  if (agent) {
    agent.last_assigned_at = new Date().toISOString();
    return agent.id;
  }
  return null;
}
