# Supabase Setup Instructions

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Supabase CLI installed (`npm install -g supabase`)

## Setup Steps

### 1. Create a New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - Name: `meeting-dash-cursor`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your location)
5. Click "Create new project"

### 2. Get Your Project Credentials
1. In your project dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (for admin operations)

### 3. Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Run Database Migrations
Execute the SQL in `migrations/001_create_meetings_table.sql` in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `001_create_meetings_table.sql`
4. Click "Run"

### 5. Verify Setup
The migration will create:
- `meetings` table with proper schema
- Row Level Security policies
- Automatic `updated_at` timestamp trigger
- Performance indexes

### 6. Test Connection
Once configured, you can test the connection by running the development server:

```bash
npm run dev
```

## Table Schema

The `meetings` table includes:
- `id` (UUID, primary key, auto-generated)
- `title` (TEXT, required)
- `time` (TIMESTAMPTZ, required)
- `content` (TEXT, markdown content)
- `created_at` (TIMESTAMPTZ, auto-generated)
- `updated_at` (TIMESTAMPTZ, auto-updated)

## Security

Row Level Security (RLS) is enabled with policies that currently allow all operations for simplicity. In production, you may want to restrict access based on user authentication. 