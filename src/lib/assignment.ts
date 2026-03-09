import { supabase } from './supabase';

/**
 * Automatically selects the next agent based on who was assigned a lead least recently.
 * This ensures a fair "Round Robin" distribution.
 */
export async function getNextAgent() {
  try {
    // 1. Fetch the agent with the oldest 'last_assigned_at' timestamp
    const { data: agents, error } = await supabase
      .from('agents')
      .select('id, name')
      .order('last_assigned_at', { ascending: true })
      .limit(1);

    if (error) {
      console.error("Error fetching agent for assignment:", error.message);
      return null;
    }

    if (!agents || agents.length === 0) {
      console.warn("No agents found in the database. Please add an agent to the 'agents' table.");
      return null;
    }

    const assignedAgent = agents[0];

    // 2. Update the agent's timestamp to 'now' so they move to the end of the queue
    const { error: updateError } = await supabase
      .from('agents')
      .update({ last_assigned_at: new Date().toISOString() })
      .eq('id', assignedAgent.id);

    if (updateError) {
      console.error("Failed to update agent timestamp:", updateError.message);
    }

    return assignedAgent.id;
  } catch (err) {
    console.error("Unexpected error in assignment logic:", err);
    return null;
  }
}