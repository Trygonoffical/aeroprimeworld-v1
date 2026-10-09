require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const email = process.env.ADMIN_EMAIL || process.argv[2];
const password = process.env.ADMIN_PASSWORD;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.');
  process.exit(1);
}

if (!email || !password) {
  console.error('Usage: ADMIN_EMAIL=admin@aeroprime.in ADMIN_PASSWORD="Aeroprime_@123" npm run admin:create');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

(async () => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    console.error(`Could not create admin user: ${error.message}`);
    process.exit(1);
  }

  console.log(`Admin user created: ${data.user.email}`);
  console.log('You can now sign in at http://localhost:3000/admin.');
})().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
