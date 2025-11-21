# 🚀 Running the Full Application

## Current Status

✅ **What's Working:**
- Docusaurus site is running at `http://localhost:3000`
- Database is created with all tables
- All UI components are built and styled
- API server code is ready

⚠️ **What Needs to be Done:**

The frontend components need to be updated to call the API server at `localhost:3001` instead of relative paths.

## Quick Fix - Update API Endpoints

You need to update these files to use `http://localhost:3001` for API calls:

### 1. Update LessonTabs Component

File: `src/components/LessonTabs/index.tsx`

Change:
```typescript
const response = await fetch(`/api/lessons/${lessonId}/summary`);
```

To:
```typescript
const response = await fetch(`http://localhost:3001/api/lessons/${lessonId}/summary`, {
  credentials: 'include',
});
```

And:
```typescript
const response = await fetch(`http://localhost:3001/api/lessons/${lessonId}/personalized`, {
  credentials: 'include',
});
```

### 2. Update Onboarding Page

File: `src/pages/onboarding.tsx`

The `handleSubmit` function should call:
```typescript
const response = await fetch('http://localhost:3001/api/user/onboarding', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    aiProficiency,
    programmingProficiency,
  }),
});
```

### 3. Update Admin Page

File: `src/pages/admin.tsx`

Change all API calls to use `http://localhost:3001`:
- `/api/admin/check` → `http://localhost:3001/api/admin/check`
- `/api/admin/tables` → `http://localhost:3001/api/admin/tables`
- `/api/admin/tables/${tableName}` → `http://localhost:3001/api/admin/tables/${tableName}`

Add `credentials: 'include'` to all fetch calls.

## Running Both Servers

### Option 1: Run Both Together (Recommended)

```bash
npm run dev
```

This runs both the API server (port 3001) and Docusaurus (port 3000) concurrently.

### Option 2: Run Separately

Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm start
```

## Testing the Application

1. **Start both servers**:
   ```bash
   npm run dev
   ```

2. **Create a test lesson** in the database:
   ```bash
   npx tsx scripts/create-test-lesson.ts
   ```

3. **Seed the database** (creates admin user and default tenant):
   ```bash
   npx tsx scripts/seed.ts
   ```

4. **Test the flow**:
   - Visit `http://localhost:3000`
   - Click "Sign In" (top right)
   - Click "Sign up" link
   - Create an account
   - Complete onboarding (select proficiency levels)
   - Browse to a lesson
   - Try the three tabs (Original, Summarize, Personalized)

5. **Test admin dashboard**:
   - Sign in as admin (if you ran seed script)
   - Visit `http://localhost:3000/admin`
   - View database tables

## Important Notes

- **OpenAI API Key**: Make sure you've added your OpenAI API key to `.env`
- **CORS**: The API server is configured to accept requests from `localhost:3000`
- **Cookies**: Sessions are stored in HTTP-only cookies
- **Database**: All data is stored in `docusaurus.db`

## Troubleshooting

### "Failed to load summary"
- Make sure API server is running on port 3001
- Check that OpenAI API key is set in `.env`
- Check browser console for errors

### "Authentication required"
- Make sure you're signed in
- Check that cookies are enabled
- Try signing out and back in

### "Cannot connect to API"
- Ensure both servers are running
- Check that port 3001 is not blocked
- Verify CORS settings in `server/index.ts`

## Next Steps

After updating the API endpoints:

1. Stop the current `pnpm start` process
2. Run `npm run dev` to start both servers
3. Test the complete flow
4. Enjoy your fully functional platform! 🎉

---

**Need help?** Check the main README.md or PROJECT_SUMMARY.md for more details.
