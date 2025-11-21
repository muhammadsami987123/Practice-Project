# Docusaurus SSO Setup Guide

This guide will walk you through setting up the Docusaurus SSO Multi-Tenant Platform with all its features.

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18 or higher installed
- ✅ npm or yarn package manager
- ✅ OpenAI API key (required for AI features)
- ✅ (Optional) GitHub OAuth App credentials
- ✅ (Optional) Google OAuth credentials

## 🚀 Quick Start

### Step 1: Install Dependencies

All dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Step 2: Configure Environment Variables

1. The `.env` file has been created with default values
2. **IMPORTANT**: Add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

3. (Optional) Add OAuth credentials for social login:

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 3: Initialize the Database

Generate and push the database schema:

```bash
npm run db:generate
npm run db:push
```

This will create a `docusaurus.db` SQLite database file with all necessary tables.

### Step 4: Seed Initial Data (Optional)

To create a default tenant and admin user:

```bash
npx tsx scripts/seed.ts
```

This creates:
- Default tenant: "Default Organization"
- Admin user: admin@example.com

### Step 5: Start the Development Server

```bash
npm start
```

The site will be available at `http://localhost:3000`

## 🔧 Detailed Configuration

### Setting Up GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Docusaurus SSO"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env` file

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key to your `.env` file

**Important**: The OpenAI API is a paid service. Monitor your usage at the OpenAI dashboard.

## 🗄️ Database Management

### View Database with Drizzle Studio

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` where you can:
- Browse all tables
- Edit data
- Run queries
- View relationships

### Database Schema Overview

The database includes these tables:

1. **tenants** - Multi-tenant organizations
2. **users** - User accounts with proficiency data
3. **sessions** - Authentication sessions
4. **accounts** - OAuth provider accounts
5. **verification_tokens** - Email verification
6. **lessons** - Tutorial content with summaries
7. **personalized_content** - User-specific content
8. **admin_users** - Admin access control

All tables include `tenant_id` for row-level security.

## 🎨 Customization

### Branding

Edit `docusaurus.config.ts`:

```typescript
const config: Config = {
  title: 'Your Site Name',
  tagline: 'Your tagline',
  // ... other config
};
```

### Theme Colors

The default gradient is `#667eea` to `#764ba2`. To change:

1. Update CSS variables in component `.module.css` files
2. Search for `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
3. Replace with your preferred colors

### AI Prompts

Customize AI behavior in `src/services/openai.ts`:

- Modify system prompts for different tones
- Adjust `temperature` (0.0-1.0) for creativity
- Change `max_tokens` for response length
- Update proficiency descriptions

## 📝 Creating Content

### Adding New Lessons

1. Create a new `.md` or `.mdx` file in `docs/`
2. Add frontmatter:

```markdown
---
sidebar_position: 2
title: Your Lesson Title
---
```

3. Use the LessonTabs component:

```tsx
import LessonTabs from '@site/src/components/LessonTabs';

<LessonTabs 
  lessonId="unique-lesson-id"
  originalContent={`
    <h2>Your Content Here</h2>
    <p>This appears in the Original tab</p>
  `}
/>
```

### Content Guidelines

- **Original Tab**: Public content, accessible to all
- **Summarize Tab**: Auto-generated, requires authentication
- **Personalized Tab**: Adapted to user level, requires authentication

## 🔐 Security Best Practices

### Production Deployment

Before deploying to production:

1. **Change the auth secret**:
   ```env
   BETTER_AUTH_SECRET=generate-a-strong-random-secret-here
   ```

2. **Update the auth URL**:
   ```env
   BETTER_AUTH_URL=https://your-production-domain.com
   ```

3. **Enable email verification**:
   In `src/auth.ts`, set:
   ```typescript
   requireEmailVerification: true
   ```

4. **Update OAuth redirect URLs** to production domain

5. **Secure the database**:
   - Use proper file permissions for `docusaurus.db`
   - Consider migrating to PostgreSQL for production

### Rate Limiting

For production, implement rate limiting on:
- AI generation endpoints
- Authentication endpoints
- Admin API routes

## 🧪 Testing

### Test User Flow

1. Visit `http://localhost:3000`
2. Click "Sign In" button (top right)
3. Sign up with email or social login
4. Complete onboarding (select proficiency levels)
5. Browse to a lesson
6. Try all three tabs (Original, Summarize, Personalized)

### Test Admin Dashboard

1. Sign in as admin user
2. Navigate to `/admin`
3. View database tables
4. Check data integrity

## 🐛 Troubleshooting

### Database Issues

**Problem**: "Database file not found"
**Solution**: Run `npm run db:push`

**Problem**: "Table doesn't exist"
**Solution**: Delete `docusaurus.db` and run `npm run db:push` again

### Authentication Issues

**Problem**: "Session not found"
**Solution**: Clear browser cookies and sign in again

**Problem**: "OAuth redirect error"
**Solution**: Check OAuth callback URLs match exactly

### AI Generation Issues

**Problem**: "OpenAI API error"
**Solution**: 
- Verify API key is correct
- Check API usage limits
- Ensure you have credits in your OpenAI account

**Problem**: "Content generation is slow"
**Solution**: This is normal - GPT-4 can take 10-30 seconds

## 📊 Monitoring

### Check OpenAI Usage

Monitor your OpenAI usage at:
- https://platform.openai.com/usage

### Database Size

Check database size:
```bash
# Windows
dir docusaurus.db

# Linux/Mac
ls -lh docusaurus.db
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build/` directory with static files.

### Deployment Options

1. **Vercel** (Recommended for Docusaurus)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`

3. **GitHub Pages**
   ```bash
   npm run deploy
   ```

**Note**: For SSO and database features, you'll need a server-side deployment (Vercel, Netlify Functions, or custom server).

## 📚 Additional Resources

- [Docusaurus Documentation](https://docusaurus.io/)
- [Better-Auth Documentation](https://better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🆘 Getting Help

If you encounter issues:

1. Check this setup guide
2. Review the main README.md
3. Check the console for error messages
4. Verify all environment variables are set
5. Ensure database is initialized

## ✅ Checklist

Before going live:

- [ ] OpenAI API key configured
- [ ] OAuth providers configured (if using)
- [ ] Database initialized and seeded
- [ ] Auth secret changed from default
- [ ] Production URL updated in config
- [ ] Email verification enabled
- [ ] Rate limiting implemented
- [ ] Database backed up
- [ ] SSL certificate configured
- [ ] Monitoring set up

---

Happy building! 🎉
