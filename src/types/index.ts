export type LeadStatus = 
  | 'New Lead' 
  | 'Contacted' 
  | 'Requirement Collected' 
  | 'Property Suggested' 
  | 'Visit Scheduled' 
  | 'Visited' 
  | 'Negotiation'
  | 'Won' 
  | 'Lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  source: string;
  status: LeadStatus;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  type?: 'Boys' | 'Girls' | 'Co-ed';
  members?: number;
  move_in_date?: string;
  amenities?: string[];
  agent_id: string;
  agents?: { name: string };
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  last_assigned_at: string;
}

export type VisitStatus = 'Scheduled' | 'Completed' | 'No Show';

export interface Visit {
  id: string;
  lead_id: string;
  agent_id?: string;
  property_name: string;
  visit_date: string;
  outcome: VisitStatus;
  lead?: Lead;
  agent?: Agent;
}