// Custom MongoDB-based authentication
// Better-Auth doesn't support MongoDB, so we'll use a custom implementation

import { connectToDatabase, COLLECTIONS } from './db';
import type { User, Session } from './db/schema';

export async function createSession(userId: string, tenantId: string): Promise<string> {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection(COLLECTIONS.SESSIONS);
    
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    await sessionsCollection.insertOne({
        id: sessionId,
        userId,
        tenantId,
        expiresAt,
        createdAt: new Date(),
    });
    
    return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection<Session>(COLLECTIONS.SESSIONS);
    
    const session = await sessionsCollection.findOne({ id: sessionId });
    if (!session) return null;
    
    if (session.expiresAt < new Date()) {
        await sessionsCollection.deleteOne({ id: sessionId });
        return null;
    }
    
    return session;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    return await usersCollection.findOne({ email });
}

export async function getUserById(id: string): Promise<User | null> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    return await usersCollection.findOne({ id });
}

export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    
    const now = new Date();
    const user: User = {
        ...userData,
        createdAt: now,
        updatedAt: now,
    };
    
    await usersCollection.insertOne(user);
    return user;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);
    
    await usersCollection.updateOne(
        { id: userId },
        { $set: { ...updates, updatedAt: new Date() } }
    );
}

export async function deleteSession(sessionId: string): Promise<void> {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection(COLLECTIONS.SESSIONS);
    await sessionsCollection.deleteOne({ id: sessionId });
}

export type { User, Session };
