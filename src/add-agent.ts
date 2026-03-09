import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Force load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('example.supabase.co')) {
  console.error('Error: Please set real NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAgent() {
  console.log('Adding agent to Supabase...', supabaseUrl);
  try {
    const { data, error } = await supabase
      .from('agents')
      .insert([
        { 
          id: '77777777-7777-7777-7777-777777777777', 
          name: 'System Admin', 
          email: 'admin@gharpay.co',
          status: 'active'
        }
      ])
      .select();
    
    if (error) {
      if (error.code === '23505') {
        console.log('\nSuccess! Agent already exists in the database.');
      } else {
        console.error('\nError adding agent - Supabase returned an error:', error.message);
        console.error('Full connection error:', error);
      }
    } else if (data && data.length > 0) {
      console.log('\nSuccess! Agent added to the database:', data[0].name);
    } else {
       console.log('\nInsert succeeded but no data returned.');
    }
  } catch(err) {
      console.error('\nCaught exception while adding agent:', err);
  }
}

addAgent();
