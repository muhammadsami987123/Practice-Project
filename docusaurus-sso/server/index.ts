import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDatabase, COLLECTIONS } from '../src/db/index.js';
import {
    createSession,
    getSession,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    deleteSession,
    type User
} from '../src/auth.js';
import { generateLessonSummary, generatePersonalizedContent } from '../src/services/openai.js';
import OpenAI from 'openai';
import type { Lesson, PersonalizedContent, Tenant, Book, Chapter, AdminUser } from '../src/db/schema.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// In-memory admin session store
const adminSessions = new Map<string, any>();

async function getCurrentUser(req: express.Request): Promise<User | null> {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return null;

    const session = await getSession(sessionId);
    if (!session) return null;

    const user = await getUserById(session.userId);
    return user;
}

// ==================== AUTH ====================

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.get('/api/auth/session', async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ user });
});

app.post('/api/auth/sign-in', async (req, res) => {
    const { email, password } = req.body; // password ignored for mock
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const sessionId = await createSession(user.id, user.tenantId);
        res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, user });
    } catch (e) {
        console.error('Sign-in error:', e);
        res.status(500).json({ error: 'Sign in failed' });
    }
});

app.post('/api/auth/sign-up', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const db = await connectToDatabase();
        const tenantsCollection = db.collection<Tenant>(COLLECTIONS.TENANTS);

        // Ensure default tenant exists
        const tenantId = process.env.DEFAULT_TENANT_ID || 'default-tenant';
        const tenantExists = await tenantsCollection.findOne({ id: tenantId });
        if (!tenantExists) {
            await tenantsCollection.insertOne({
                id: tenantId,
                name: 'Default Tenant',
                domain: 'default',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // Check duplicate email
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const userId = Math.random().toString(36).substring(2, 15);
        const user = await createUser({
            id: userId,
            tenantId,
            email,
            name,
            emailVerified: false,
            hasCompletedOnboarding: false,
        });

        const sessionId = await createSession(user.id, user.tenantId);
        res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, user });
    } catch (e) {
        console.error('Sign-up error:', e);
        res.status(500).json({ error: 'Sign up failed' });
    }
});

app.post('/api/auth/sign-out', async (req, res) => {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
        await deleteSession(sessionId);
    }
    res.clearCookie('sessionId');
    res.json({ success: true });
});

// Google Auth
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.API_URL || 'http://localhost:3001'}/api/auth/google/callback`
);

app.get('/api/auth/google', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    res.redirect(url);
});

app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const { data } = await oauth2.userinfo.get();

        if (!data.email) {
            throw new Error('No email found in Google profile');
        }

        let user = await getUserByEmail(data.email);

        if (!user) {
            const tenantId = process.env.DEFAULT_TENANT_ID || 'default-tenant';
            user = await createUser({
                id: Math.random().toString(36).substring(2, 15),
                tenantId,
                email: data.email,
                name: data.name || 'Google User',
                emailVerified: true,
                hasCompletedOnboarding: false,
                image: data.picture || undefined,
            });
        }

        const sessionId = await createSession(user.id, user.tenantId);
        res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect(`${CLIENT_URL}/`);
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.redirect(`${CLIENT_URL}/auth/signin?error=Google auth failed`);
    }
});

app.get('/api/auth/github', async (req, res) => {
    try {
        // Mock GitHub User
        const email = 'mock-github-user@example.com';
        let user = await getUserByEmail(email);

        if (!user) {
            const tenantId = process.env.DEFAULT_TENANT_ID || 'default-tenant';
            user = await createUser({
                id: Math.random().toString(36).substring(2, 15),
                tenantId,
                email,
                name: 'Mock GitHub User',
                emailVerified: true,
                hasCompletedOnboarding: false,
                image: 'https://avatars.githubusercontent.com/u/0?v=4',
            });
        }

        const sessionId = await createSession(user.id, user.tenantId);
        res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect(`${CLIENT_URL}/`);
    } catch (e) {
        console.error('GitHub auth error:', e);
        res.redirect(`${CLIENT_URL}/auth/signin?error=GitHub auth failed`);
    }
});

// ==================== USER ====================

app.post('/api/user/onboarding', async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    const { aiProficiency, programmingProficiency } = req.body;
    try {
        await updateUser(user.id, {
            proficiencyData: { aiProficiency, programmingProficiency },
            hasCompletedOnboarding: true,
        });
        res.json({ success: true });
    } catch (e) {
        console.error('Onboarding error:', e);
        res.status(500).json({ error: 'Failed to update onboarding' });
    }
});

// ==================== LESSONS ====================

app.get('/api/lessons/:lessonId/summary', async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { lessonId } = req.params;
    try {
        const db = await connectToDatabase();
        const lessonsCollection = db.collection<Lesson>(COLLECTIONS.LESSONS);

        const lesson = await lessonsCollection.findOne({ id: lessonId });
        if (!lesson) {
            console.error(`Lesson not found: ${lessonId}`);
            return res.status(404).json({ error: `Lesson "${lessonId}" not found. Please ensure the lesson exists in the database.` });
        }

        if (lesson.isSummaryGenerated && lesson.summaryText) {
            return res.json({ summary: lesson.summaryText });
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is not set');
            return res.status(500).json({ error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.' });
        }

        const summary = await generateLessonSummary(lesson.originalContent, lesson.title);
        await lessonsCollection.updateOne(
            { id: lessonId },
            { $set: { summaryText: summary, isSummaryGenerated: true, updatedAt: new Date() } }
        );
        res.json({ summary });
    } catch (e: any) {
        console.error('Summary error:', e);
        const errorMessage = e.message || 'Failed to generate summary';
        if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
            return res.status(500).json({ error: 'OpenAI API authentication failed. Please check your OPENAI_API_KEY.' });
        }
        return res.status(500).json({ error: errorMessage });
    }
});

app.get('/api/lessons/:lessonId/personalized', async (req, res) => {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { lessonId } = req.params;
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is not set');
            return res.status(500).json({ error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.' });
        }

        const db = await connectToDatabase();
        const personalizedCollection = db.collection<PersonalizedContent>(COLLECTIONS.PERSONALIZED_CONTENT);
        const lessonsCollection = db.collection<Lesson>(COLLECTIONS.LESSONS);

        const existing = await personalizedCollection.findOne({
            lessonId,
            userId: user.id
        });

        if (existing && existing.isPersonalizedGenerated) {
            return res.json({ content: existing.content });
        }

        const lesson = await lessonsCollection.findOne({ id: lessonId });
        if (!lesson) {
            console.error(`Lesson not found: ${lessonId}`);
            return res.status(404).json({ error: `Lesson "${lessonId}" not found. Please ensure the lesson exists in the database.` });
        }

        if (!user.proficiencyData) {
            return res.status(400).json({ error: 'Please complete onboarding first so we know your proficiency levels.' });
        }

        const content = await generatePersonalizedContent(lesson.originalContent, lesson.title, user.proficiencyData);

        if (existing) {
            await personalizedCollection.updateOne(
                { id: existing.id },
                { $set: { content, isPersonalizedGenerated: true, updatedAt: new Date() } }
            );
        } else {
            await personalizedCollection.insertOne({
                id: Math.random().toString(36).substring(2, 15),
                tenantId: user.tenantId,
                lessonId,
                userId: user.id,
                content,
                isPersonalizedGenerated: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        return res.json({ content });
    } catch (e: any) {
        console.error('Personalization error:', e);
        const errorMessage = e.message || 'Failed to generate personalized content';
        if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
            return res.status(500).json({ error: 'OpenAI API authentication failed. Please check your OPENAI_API_KEY.' });
        }
        return res.status(500).json({ error: errorMessage });
    }
});

// ==================== CHATBOT ====================

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant for a documentation site." },
                ...messages
            ],
        });

        res.json({ message: completion.choices[0].message });
    } catch (error: any) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
});

// ==================== ADMIN ====================

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
        return res.status(500).json({ error: 'Admin credentials not configured' });
    }

    if (username === adminUsername && password === adminPassword) {
        const sessionId = Math.random().toString(36).substring(2, 15);
        adminSessions.set(sessionId, { isAdmin: true, username });
        res.cookie('adminSessionId', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/api/admin/check', async (req, res) => {
    const sessionId = req.cookies.adminSessionId;
    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const session = adminSessions.get(sessionId);
    if (session && session.isAdmin) {
        res.json({ isAdmin: true });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.get('/api/admin/tables', async (req, res) => {
    const sessionId = req.cookies.adminSessionId;
    if (!sessionId) return res.status(401).json({ error: 'Not authenticated' });
    const session = adminSessions.get(sessionId);
    if (!session || !session.isAdmin) return res.status(401).json({ error: 'Not authenticated' });

    try {
        const db = await connectToDatabase();
        const tables = [
            {
                name: 'users',
                columns: ['id', 'tenantId', 'email', 'name', 'proficiencyData', 'hasCompletedOnboarding'],
                rows: await db.collection(COLLECTIONS.USERS).find({}).toArray()
            },
            {
                name: 'lessons',
                columns: ['id', 'tenantId', 'title', 'slug', 'isSummaryGenerated'],
                rows: await db.collection(COLLECTIONS.LESSONS).find({}).toArray()
            },
            {
                name: 'personalized_content',
                columns: ['id', 'lessonId', 'userId', 'isPersonalizedGenerated'],
                rows: await db.collection(COLLECTIONS.PERSONALIZED_CONTENT).find({}).toArray()
            },
            {
                name: 'tenants',
                columns: ['id', 'name', 'domain'],
                rows: await db.collection(COLLECTIONS.TENANTS).find({}).toArray()
            },
            {
                name: 'admin_users',
                columns: ['id', 'userId', 'role'],
                rows: await db.collection(COLLECTIONS.ADMIN_USERS).find({}).toArray()
            },
            {
                name: 'books',
                columns: ['id', 'tenantId', 'title', 'slug'],
                rows: await db.collection(COLLECTIONS.BOOKS).find({}).toArray()
            },
            {
                name: 'chapters',
                columns: ['id', 'tenantId', 'bookId', 'title', 'slug'],
                rows: await db.collection(COLLECTIONS.CHAPTERS).find({}).toArray()
            },
        ];
        res.json({ tables });
    } catch (e) {
        console.error('Admin tables error:', e);
        res.status(500).json({ error: 'Failed to fetch tables' });
    }
});

app.get('/api/admin/tables/:tableName', async (req, res) => {
    const sessionId = req.cookies.adminSessionId;
    if (!sessionId) return res.status(401).json({ error: 'Not authenticated' });
    const session = adminSessions.get(sessionId);
    if (!session || !session.isAdmin) return res.status(401).json({ error: 'Not authenticated' });

    const { tableName } = req.params;
    try {
        const db = await connectToDatabase();
        let rows: any[] = [];
        let columns: string[] = [];

        const collectionMap: Record<string, { collection: string; columns: string[] }> = {
            'users': { collection: COLLECTIONS.USERS, columns: ['id', 'tenantId', 'email', 'name', 'proficiencyData', 'hasCompletedOnboarding'] },
            'lessons': { collection: COLLECTIONS.LESSONS, columns: ['id', 'tenantId', 'title', 'slug', 'isSummaryGenerated'] },
            'personalized_content': { collection: COLLECTIONS.PERSONALIZED_CONTENT, columns: ['id', 'lessonId', 'userId', 'isPersonalizedGenerated'] },
            'tenants': { collection: COLLECTIONS.TENANTS, columns: ['id', 'name', 'domain'] },
            'admin_users': { collection: COLLECTIONS.ADMIN_USERS, columns: ['id', 'userId', 'role'] },
            'books': { collection: COLLECTIONS.BOOKS, columns: ['id', 'tenantId', 'title', 'slug'] },
            'chapters': { collection: COLLECTIONS.CHAPTERS, columns: ['id', 'tenantId', 'bookId', 'title', 'slug'] },
        };

        const config = collectionMap[tableName];
        if (!config) {
            return res.status(404).json({ error: 'Table not found' });
        }

        rows = await db.collection(config.collection).find({}).toArray();
        columns = config.columns;

        res.json({ rows, columns });
    } catch (e) {
        console.error('Admin table error:', e);
        res.status(500).json({ error: 'Failed to fetch table data' });
    }
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`🚀 API Server running at http://localhost:${PORT}`);
    console.log('📊 Docusaurus should be at http://localhost:3000');
});

