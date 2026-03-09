export type LeadStatus = 
  | 'New Lead' 
  | 'Contacted' 
  | 'Requirement Collected' 
  | 'Property Suggested' 
  | 'Visit Scheduled' 
  | 'Visit Completed' 
  | 'Booked' 
  | 'Lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: LeadStatus;
  agent_id: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  name: string;
  last_assigned_at: string;
}