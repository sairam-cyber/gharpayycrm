const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('example.supabase.co')) {
  console.error('Error: Please set real NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAgent() {
  console.log('Adding agent to Supabase...', supabaseUrl);
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
      console.error('\nError adding agent:', error.message);
      console.error(error);
    }
  } else {
    console.log('\nSuccess! Agent added to the database:', data[0].name);
  }
}

addAgent();
