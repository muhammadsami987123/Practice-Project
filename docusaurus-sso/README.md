# Docusaurus SSO Multi-Tenant Platform

A modern documentation platform built with Docusaurus, featuring SSO authentication, multi-tenancy, and AI-powered personalized learning content.

## 🌟 Features

### Authentication & Multi-Tenancy
- ✅ **SSO Integration** with Better-Auth
- ✅ **Multi-tenant architecture** with row-level security
- ✅ **Social login** support (GitHub, Google)
- ✅ **Email/Password authentication**
- ✅ **Session management** with secure tokens

### User Experience
- ✅ **Interactive onboarding** with proficiency level selection
- ✅ **Personalized content** based on AI and programming skills
- ✅ **Three-tab lesson system**:
  - **Original**: Standard documentation (public)
  - **Summarize**: AI-generated summaries (authenticated users only)
  - **Personalized**: Content adapted to user's proficiency level (authenticated users only)

### AI Integration
- ✅ **OpenAI GPT-4** integration for content generation
- ✅ **Automatic summary generation** for lessons
- ✅ **Personalized content** based on user proficiency
- ✅ **Adaptive learning** with context-aware explanations

### Admin Dashboard
- ✅ **Database management** interface
- ✅ **Real-time data viewing** across all tables
- ✅ **Multi-table support** with easy navigation
- ✅ **Access control** for admin users

## 🏗️ Architecture

### Database Schema

The platform uses SQLite with Drizzle ORM and includes the following tables:

#### Core Tables
- **tenants**: Multi-tenancy support
- **users**: User accounts with proficiency data (JSONB)
- **sessions**: Authentication sessions
- **accounts**: OAuth provider accounts
- **verification_tokens**: Email verification

#### Content Tables
- **lessons**: Tutorial content with summaries
  - `summary`: AI-generated summary
  - `is_summary_generated`: Boolean flag
- **personalized_content**: User-specific personalized lessons
  - `is_personalized_content_generated`: Boolean flag
- **admin_users**: Admin access control

All tables include `tenant_id` for row-level security.

### Tech Stack

- **Frontend**: React, TypeScript, Docusaurus
- **Authentication**: Better-Auth
- **Database**: SQLite with Drizzle ORM
- **AI**: OpenAI GPT-4 Turbo
- **Styling**: CSS Modules with modern gradients

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for AI features)
- (Optional) GitHub/Google OAuth credentials for SSO

### Installation

1. **Clone the repository**
   ```bash
   cd docusaurus-sso
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   ```env
   OPENAI_API_KEY=your-openai-api-key
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   ```

   Optional (for SSO):
   ```env
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Initialize the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Seed initial data** (optional)
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

   The site will be available at `http://localhost:3000`

## 📖 Usage

### For Users

1. **Sign Up/Sign In**
   - Click the "Sign In" button in the top right corner
   - Choose email/password or social login (GitHub/Google)

2. **Complete Onboarding**
   - Select your AI proficiency level (Beginner/Intermediate/Expert)
   - Select your programming proficiency level
   - Click "Complete Setup"

3. **Access Lessons**
   - Browse tutorials in the docs section
   - Use the three tabs:
     - **Original**: View standard documentation
     - **Summarize**: Get AI-generated summaries (requires login)
     - **Personalized**: Get content adapted to your level (requires login)

### For Admins

1. **Access Admin Dashboard**
   - Navigate to `/admin`
   - View all database tables
   - Monitor user activity and content generation

2. **Manage Content**
   - Create new lessons in the `docs` folder
   - AI summaries are generated automatically on first access
   - Personalized content is generated per user

## 🛠️ Development

### Project Structure

```
docusaurus-sso/
├── src/
│   ├── components/
│   │   ├── AuthButton/          # Sign in/out button
│   │   └── LessonTabs/          # Three-tab lesson interface
│   ├── pages/
│   │   ├── onboarding.tsx       # User onboarding page
│   │   └── admin.tsx            # Admin dashboard
│   ├── services/
│   │   └── openai.ts            # OpenAI integration
│   ├── db/
│   │   ├── schema.ts            # Database schema
│   │   └── index.ts             # Database connection
│   ├── api/
│   │   └── helpers.ts           # API helper functions
│   └── auth.ts                  # Better-Auth configuration
├── docs/                        # Documentation content
├── blog/                        # Blog posts
├── static/                      # Static assets
└── docusaurus.config.ts         # Docusaurus configuration
```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

### Adding New Lessons

1. Create a new markdown file in `docs/`
2. Add frontmatter with lesson metadata
3. Use the `LessonTabs` component:

```tsx
import LessonTabs from '@site/src/components/LessonTabs';

<LessonTabs 
  lessonId="unique-lesson-id"
  originalContent={`
    <h2>Your lesson content here</h2>
    <p>This will be shown in the Original tab</p>
  `}
/>
```

## 🔐 Security

### Multi-Tenancy
- All tables include `tenant_id` for data isolation
- Row-level security enforced at the database level
- Users can only access data within their tenant

### Authentication
- Secure session management with Better-Auth
- Password hashing with bcrypt
- CSRF protection enabled
- HTTP-only cookies for session tokens

### API Security
- Authentication required for personalized content
- Admin routes protected with role-based access control
- Rate limiting on AI generation endpoints (recommended)

## 🎨 Customization

### Styling
- All components use CSS Modules
- Gradient theme: `#667eea` to `#764ba2`
- Customize in component `.module.css` files

### AI Prompts
- Modify prompts in `src/services/openai.ts`
- Adjust temperature and max_tokens for different outputs
- Customize proficiency level descriptions

### Database Schema
- Extend schema in `src/db/schema.ts`
- Run `npm run db:generate` to create migrations
- Run `npm run db:push` to apply changes

## 📊 Database Management

### Using Drizzle Studio

```bash
npm run db:studio
```

This opens a web interface to:
- Browse all tables
- Edit data directly
- Run queries
- View relationships

### Manual Queries

```typescript
import { db, users } from './src/db';
import { eq } from 'drizzle-orm';

// Get all users
const allUsers = await db.select().from(users);

// Get user by email
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, 'user@example.com'));
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Docusaurus](https://docusaurus.io/) - Documentation framework
- [Better-Auth](https://better-auth.com/) - Authentication library
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [OpenAI](https://openai.com/) - AI content generation

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

Built with ❤️ using Docusaurus, Better-Auth, and OpenAI
