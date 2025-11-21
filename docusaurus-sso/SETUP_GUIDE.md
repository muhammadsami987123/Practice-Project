# 🚀 Smart Interactive Documentation Platform - Setup Guide

## Overview

This is a complete Smart Interactive Documentation Platform built with:
- **Docusaurus** (latest version)
- **Better-Auth** (SSO with Multi-tenancy)
- **PostgreSQL** (local database)
- **OpenAI API** (for AI-generated content)
- **Tailwind CSS** (styling)
- **React Markdown** (for rendering AI content)

## Prerequisites

- Node.js >= 20.0
- PostgreSQL installed and running locally
- OpenAI API key
- npm or yarn

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- PostgreSQL driver (`pg`)
- Tailwind CSS and PostCSS
- React Markdown
- Better-Auth
- OpenAI SDK

## Step 2: Set Up PostgreSQL Database

1. **Create a PostgreSQL database:**
   ```bash
   createdb docusaurus_db
   ```

2. **Run the migration script:**
   ```bash
   psql -d docusaurus_db -f sql/migrations/001_initial_schema.sql
   ```

   Or use Drizzle to push the schema:
   ```bash
   npm run db:push
   ```

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://localhost:5432/docusaurus_db

# Better-Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-change-in-production
BETTER_AUTH_URL=http://localhost:3000

# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# OAuth Providers (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Dashboard Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password-in-production

# Default Tenant ID
DEFAULT_TENANT_ID=default-tenant
```

**Important:** 
- Generate a secure `BETTER_AUTH_SECRET` (use `openssl rand -base64 32`)
- Get your OpenAI API key from https://platform.openai.com/api-keys
- Change the admin password in production!

## Step 4: Start the Application

### Development Mode (Both servers)

```bash
npm run dev
```

This starts:
- API server on `http://localhost:3001`
- Docusaurus on `http://localhost:3000`

### Separate Terminals

**Terminal 1 - API Server:**
```bash
npm run server
```

**Terminal 2 - Docusaurus:**
```bash
npm start
```

## Step 5: Access the Application

1. **Main Site:** http://localhost:3000
2. **Admin Dashboard:** http://localhost:3000/admin
   - Use credentials from `.env` (ADMIN_USERNAME and ADMIN_PASSWORD)

## Features

### ✅ Authentication
- Email/Password authentication
- GitHub OAuth (if configured)
- Google OAuth (if configured)
- Multi-tenant support

### ✅ Onboarding Flow
- First-time users are prompted to set proficiency levels
- Navigate to `/onboarding` after signup
- Proficiency levels stored in JSONB format

### ✅ Three-Tab Lesson System
- **Original Tab:** Standard documentation content
- **Summarize Tab:** AI-generated summaries (auth required)
- **Personalized Tab:** Content tailored to user proficiency (auth required)

### ✅ Admin Dashboard
- Secure login with environment variables
- Database table viewer
- No navbar link (direct access only via `/admin`)

### ✅ Markdown Rendering
- AI-generated content properly rendered as markdown
- Matches Docusaurus native styling

## Database Schema

The platform uses the following PostgreSQL tables:

- `tenants` - Multi-tenancy support
- `users` - User accounts with proficiency data (JSONB)
- `sessions` - Better-Auth sessions
- `accounts` - OAuth provider accounts
- `verification_tokens` - Email verification
- `books` - Book collections
- `chapters` - Chapter organization
- `lessons` - Lesson content with summaries
- `personalized_content` - User-specific content
- `admin_users` - Admin access control

All tables include `tenant_id` for Row Level Security (RLS).

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -l`

### OpenAI API Errors
- Verify OPENAI_API_KEY is set correctly
- Check API key has sufficient credits
- Review server logs for specific error messages

### Authentication Issues
- Clear browser cookies
- Check BETTER_AUTH_SECRET is set
- Verify OAuth credentials if using social login

### Markdown Not Rendering
- Ensure `react-markdown` and `remark-gfm` are installed
- Check browser console for errors
- Verify content is valid markdown

## Production Deployment

Before deploying:

1. **Update environment variables:**
   - Use strong `BETTER_AUTH_SECRET`
   - Set `BETTER_AUTH_URL` to production domain
   - Use production database connection string
   - Change admin credentials

2. **Enable email verification:**
   - Update `src/auth.ts` to set `requireEmailVerification: true`

3. **Update OAuth redirect URLs:**
   - Update GitHub/Google OAuth apps with production URLs

4. **Database:**
   - Consider using managed PostgreSQL (AWS RDS, Supabase, etc.)
   - Enable SSL connections
   - Set up proper backups

5. **Security:**
   - Enable HTTPS
   - Set secure cookie flags
   - Implement rate limiting
   - Review CORS settings

## Development Commands

```bash
# Start both servers
npm run dev

# Start API server only
npm run server

# Start Docusaurus only
npm start

# Build for production
npm run build

# Database migrations
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio

# Type checking
npm run typecheck
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Check browser console for errors
4. Verify all environment variables are set

---

**Built with ❤️ using Docusaurus, Better-Auth, PostgreSQL, and OpenAI**

