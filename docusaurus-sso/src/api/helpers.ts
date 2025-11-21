// API route handlers for Docusaurus
// These will be served through a custom server or serverless functions

import { db, users, sessions } from '../db';
import { eq } from 'drizzle-orm';

export async function getSession(sessionToken: string) {
    try {
        const session = await db
            .select()
            .from(sessions)
            .where(eq(sessions.id, sessionToken))
            .limit(1);

        if (!session || session.length === 0) {
            return null;
        }

        const sessionData = session[0];

        // Check if session is expired
        if (sessionData.expiresAt < new Date()) {
            return null;
        }

        // Get user data
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, sessionData.userId))
            .limit(1);

        if (!user || user.length === 0) {
            return null;
        }

        return {
            session: sessionData,
            user: user[0],
        };
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

export async function updateUserOnboarding(
    userId: string,
    proficiencyData: {
        aiProficiency: 'Beginner' | 'Intermediate' | 'Expert';
        programmingProficiency: 'Beginner' | 'Intermediate' | 'Expert';
    }
) {
    try {
        await db
            .update(users)
            .set({
                proficiencyData,
                hasCompletedOnboarding: true,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

        return { success: true };
    } catch (error) {
        console.error('Error updating user onboarding:', error);
        throw new Error('Failed to update user onboarding');
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        return user[0] || null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}
