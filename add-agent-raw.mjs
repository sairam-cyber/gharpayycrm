import fs from 'fs';
import path from 'path';

// Parse .env.local manually to get credentials
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].replace(/"/g, '').trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].replace(/"/g, '').trim();
  }
});

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('example.supabase.co')) {
  console.error('Error: Please set real credentials in .env.local');
  process.exit(1);
}

const endpoint = `${supabaseUrl}/rest/v1/agents`;

async function addAgent() {
  console.log(`Adding agent using REST API to: ${endpoint}`);
  
  const payload = {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'System Admin',
    email: 'admin@gharpay.co',
    status: 'active'
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === '23505') {
        console.log('\nSuccess! Agent already exists in the database.');
      } else {
        console.error('\nHTTP Error:', response.status, response.statusText);
        console.error(errorData);
      }
    } else {
      const data = await response.json();
      console.log('\nSuccess! Agent added to the database:', data[0]?.name || 'Unknown');
    }
  } catch (error) {
    console.error('\nFetch failed:', error.message);
  }
}

addAgent();
