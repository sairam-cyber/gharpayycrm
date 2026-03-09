import { supabase, isMock } from './supabase';
import { getNextMockAgent } from './mockData';

/**
 * Automatically selects the next agent based on who was assigned a lead least recently.
 * This ensures a fair "Round Robin" distribution.
 */
export async function getNextAgent() {
  if (isMock) {
    console.log("getNextAgent: Using MOCK assignment");
    return getNextMockAgent();
  }

  try {
    console.log("getNextAgent: Fetching agents from Supabase...");
    // 1. Fetch the agent with the oldest 'last_assigned_at' timestamp
    const { data: agents, error } = await supabase
      .from('agents')
      .select('id, name')
      .order('last_assigned_at', { ascending: true })
      .limit(1);

    if (error) {
      console.error("getNextAgent: Error fetching agent:", error.message);
      return null;
    }

    if (!agents || agents.length === 0) {
      console.warn("getNextAgent: No agents found");
      return null;
    }

    const assignedAgent = agents[0];
    console.log("getNextAgent: Selected agent:", assignedAgent.name, assignedAgent.id);

    // 2. Update the agent's timestamp to 'now' so they move to the end of the queue
    const { error: updateError } = await supabase
      .from('agents')
      .update({ last_assigned_at: new Date().toISOString() })
      .eq('id', assignedAgent.id);

    if (updateError) {
      console.error("getNextAgent: Failed to update timestamp:", updateError.message);
    }

    return assignedAgent.id;
  } catch (err) {
    console.error("getNextAgent: Unexpected error:", err);
    return null;
  }
}