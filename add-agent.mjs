import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function addAgent() {
  const { data, error } = await supabase
    .from('agents')
    .insert([{ id: '77777777-7777-7777-7777-777777777777', name: 'System Admin', email: 'admin@gharpay.co' }])
    .select();
  
  if (error) {
    if (error.code === '23505') {
      console.log('Agent already exists');
    } else {
      console.error('Error adding agent:', error);
    }
  } else {
    console.log('Agent added:', data);
  }
}

addAgent();
