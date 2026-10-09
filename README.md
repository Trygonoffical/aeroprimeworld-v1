# AeroPrime Worldwide

A Node.js logistics operating layer for domestic shipping, cross-border commerce, fulfilment, last-mile and post-purchase operations.

## Run locally

```sh
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:3000`.

## Connect Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase/schema.sql`.
3. Copy the project URL and API keys into `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. In Supabase Auth, create an email/password user for the operations team.
5. Restart the Node server.

The public tracking page reads shipments and shipment events from Supabase. Admin login uses Supabase Auth, and authenticated operations users can create, edit, delete, and update shipment statuses from the admin dashboard. Status changes write a new shipment event for the public tracking timeline.

## Create an admin user from the terminal

The server-only service key can create a confirmed Supabase Auth user through the included script. Enter the password silently so it does not appear in shell history:

```sh
read -s ADMIN_PASSWORD; echo; export ADMIN_PASSWORD; ADMIN_EMAIL=ops@example.com npm run admin:create; unset ADMIN_PASSWORD
```

The password is never printed or stored by the script. Sign in at `http://localhost:3000/admin` after it completes.

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or commit `.env` to source control.
