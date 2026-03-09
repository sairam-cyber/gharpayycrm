-- 1. Agents Table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  last_assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Leads Table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  budget TEXT,
  source TEXT NOT NULL, -- e.g., 'Website', 'Tally', 'WhatsApp'
  status TEXT DEFAULT 'New Lead', -- New Lead, Contacted, Booked, etc.
  agent_id UUID REFERENCES agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Visits Table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  property_name TEXT,
  visit_date TIMESTAMP WITH TIME ZONE,
  outcome TEXT, -- Pending, Completed, Cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
