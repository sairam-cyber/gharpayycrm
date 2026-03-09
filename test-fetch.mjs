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

const endpoint = `${supabaseUrl}/rest/v1/agents?select=*`;

async function testFetch() {
  console.log(`Testing fetch from: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('\nHTTP Error:', response.status, response.statusText);
      console.error(errorData);
    } else {
      const data = await response.json();
      console.log('\nSuccess! Found agents:', data.length);
      console.log(data);
    }
  } catch (error) {
    console.error('\nFetch failed:', error.message);
  }
}

testFetch();
