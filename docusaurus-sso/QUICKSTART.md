# ⚡ Quick Start Guide

Get your Docusaurus SSO platform running in 5 minutes!

## 🎯 Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Steps

### 1. Install Dependencies (Already Done)

Dependencies are already installed. Skip to step 2!

### 2. Add Your OpenAI API Key

Edit the `.env` file and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

**Important**: This is required for the AI features (Summarize and Personalized tabs).

### 3. Initialize Database (Already Done)

The database has been created with all tables. You can verify by checking for `docusaurus.db` file.

### 4. Seed Initial Data (Optional)

Create a default tenant and admin user:

```bash
npx tsx scripts/seed.ts
```

This creates:
- **Tenant**: Default Organization
- **Admin Email**: admin@example.com

### 5. Start Development Server

```bash
npm start
```

The site will open at `http://localhost:3000` 🎉

## 🧪 Test the Features

### Test User Flow

1. **Visit** `http://localhost:3000`
2. **Click** "Sign In" button (top right corner)
3. **Sign up** with email/password or social login
4. **Complete onboarding**:
   - Select AI proficiency level
   - Select programming proficiency level
5. **Browse to a lesson** (e.g., "Introduction to AI and Machine Learning")
6. **Try the three tabs**:
   - ✅ **Original**: Public content (works for everyone)
   - 🔒 **Summarize**: AI summary (requires login)
   - 🎯 **Personalized**: Adapted to your level (requires login)

### Test Admin Dashboard

1. **Sign in** as admin (if you ran the seed script)
2. **Navigate to** `/admin`
3. **View** all database tables
4. **Click** different tables to see data
5. **Use** refresh button to update data

## 📝 What You Can Do Now

### ✅ Working Features

- Browse public documentation
- Sign up / Sign in (email/password)
- Complete onboarding
- View original lesson content
- Access admin dashboard (if admin)

### ⚠️ Requires API Implementation

These features need backend API routes to work:

- Social login (GitHub, Google)
- AI-generated summaries
- Personalized content
- Session persistence

## 🔧 Optional: Set Up Social Login

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add credentials to `.env`:
   ```env
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Set redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## 🗄️ View Database

Open Drizzle Studio to browse your database:

```bash
npm run db:studio
```

Opens at `http://localhost:4983`

## 📚 Next Steps

1. **Read** `PROJECT_SUMMARY.md` for complete feature list
2. **Check** `SETUP.md` for detailed configuration
3. **Review** `README.md` for full documentation
4. **Implement** API routes for full functionality

## 🐛 Troubleshooting

### "Database not found"
```bash
npm run db:push
```

### "OpenAI API error"
- Check your API key is correct
- Verify you have credits in your OpenAI account
- Check usage at https://platform.openai.com/usage

### "Can't sign in"
- API routes need to be implemented
- See PROJECT_SUMMARY.md for implementation options

## 🎨 Customize

### Change Site Name

Edit `docusaurus.config.ts`:
```typescript
title: 'Your Site Name',
tagline: 'Your tagline',
```

### Change Colors

Search for `#667eea` and `#764ba2` in `.module.css` files and replace with your colors.

### Add New Lessons

Create `.md` files in `docs/` folder using the example in `docs/intro.md`.

## 📞 Need Help?

- **Setup issues**: Check `SETUP.md`
- **Feature questions**: Check `README.md`
- **Architecture**: Check `PROJECT_SUMMARY.md`

---

**You're all set!** 🎉 Start the dev server and explore your new platform!

```bash
npm start
```
